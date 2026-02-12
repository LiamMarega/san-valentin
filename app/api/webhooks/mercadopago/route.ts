import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { sql } from "@/lib/db"
import { sendLetterEmail } from "@/lib/email"

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // MercadoPago envia distintos tipos de notificacion.
    // Manejamos ambos formatos: webhook (type + data.id) e IPN legacy (topic + resource)
    let paymentId: string | null = null

    if (body.type === "payment" && body.data?.id) {
      paymentId = String(body.data.id)
    } else if (body.topic === "payment" && body.resource) {
      const parts = body.resource.split("/")
      paymentId = parts[parts.length - 1]
    }

    if (!paymentId) {
      // No es una notificacion de pago (puede ser merchant_order, etc.)
      return NextResponse.json({ received: true })
    }

    // Verificar el pago consultando la API de MercadoPago (no confiar en el body del webhook)
    const paymentClient = new Payment(mpClient)
    const payment = await paymentClient.get({ id: paymentId })

    if (!payment || !payment.external_reference) {
      console.error("Payment not found or missing external_reference:", paymentId)
      return NextResponse.json({ received: true })
    }

    const letterId = payment.external_reference
    const status = payment.status

    console.log(`MercadoPago payment ${paymentId} for letter ${letterId}: status=${status}`)

    if (status === "approved") {
      // 1. Actualizar DB a 'paid' (idempotente: WHERE payment_status != 'paid')
      const updateResult = await sql`
        UPDATE letters
        SET payment_status = 'paid',
            mp_payment_id = ${paymentId},
            status = 'sent'
        WHERE id = ${letterId}
          AND payment_status != 'paid'
        RETURNING *
      `

      const letter = updateResult[0]

      // 2. Enviar el email que estaba pendiente
      if (letter) {
        await sendLetterEmail({
          to: letter.receiver_email,
          senderName: letter.sender_name,
          receiverName: letter.receiver_name,
          messageType: letter.message_type,
          letterId: letter.id,
        })
        console.log(`Email enviado tras pago exitoso para carta: ${letterId}`)
      }
    }

    // Siempre retornar 200 para evitar reintentos infinitos de MercadoPago
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("MercadoPago webhook error:", error)
    // Retornar 200 incluso en error para evitar reintentos
    return NextResponse.json({ received: true })
  }
}
