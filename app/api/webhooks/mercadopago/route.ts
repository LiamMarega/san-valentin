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
      console.log("MercadoPago webhook received but no paymentId found in body:", JSON.stringify(body))
      return NextResponse.json({ received: true })
    }

    console.log(`Processing MercadoPago notification for payment ${paymentId}...`)

    // Verificar el pago consultando la API de MercadoPago (no confiar en el body del webhook)
    const paymentClient = new Payment(mpClient)
    const payment = await paymentClient.get({ id: paymentId })

    if (!payment) {
      console.error("Payment not found in MercadoPago API:", paymentId)
      return NextResponse.json({ received: true })
    }

    if (!payment.external_reference) {
      console.error("Payment missing external_reference:", paymentId, "Payment status:", payment.status)
      return NextResponse.json({ received: true })
    }

    const letterId = payment.external_reference
    const status = payment.status

    console.log(`MercadoPago payment ${paymentId} for letter ${letterId}: status=${status}`)

    if (status === "approved") {
      console.log(`Attempting to update DB for letter ${letterId} to 'paid' and 'sent'...`)
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

      if (updateResult.length === 0) {
        console.log(`No rows updated for letter ${letterId}. Possibly already processed or ID mismatch.`)
        // Aún así retornamos 200
        return NextResponse.json({ received: true })
      }

      const letter = updateResult[0]
      console.log(`Successfully updated letter ${letterId} in DB.`)

      // 2. Enviar el email que estaba pendiente
      try {
        console.log(`Sending email for letter ${letterId} to ${letter.receiver_email}...`)
        await sendLetterEmail({
          to: letter.receiver_email,
          senderName: letter.sender_name,
          receiverName: letter.receiver_name,
          messageType: letter.message_type,
          letterId: letter.id,
        })
        console.log(`Email successfully sent for letter: ${letterId}`)
      } catch (emailError) {
        console.error(`Error sending email for letter ${letterId}:`, emailError)
        // No lanzamos error aquí para no fallar el webhook si el pago ya se procesó en DB
      }
    } else {
      console.log(`Payment ${paymentId} status is ${status}, skipping DB update.`)
    }

    // Siempre retornar 200 para evitar reintentos infinitos de MercadoPago
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("MercadoPago webhook critical error:", error)
    // Retornar 200 incluso en error para evitar reintentos
    return NextResponse.json({ received: true })
  }
}
