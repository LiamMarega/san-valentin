// app/api/webhooks/mercadopago/route.ts
import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { sql } from "@/lib/db"
import { sendLetterEmail } from "@/lib/email"

// ✅ Mover la instanciación dentro de una función lazy para evitar crash al cargar el módulo
function getMPClient() {
  const token = process.env.MP_ACCESS_TOKEN
  if (!token) {
    throw new Error("MP_ACCESS_TOKEN is not configured")
  }
  return new MercadoPagoConfig({ accessToken: token })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log("MercadoPago webhook received:", JSON.stringify(body))

    // Extraer paymentId de ambos formatos (webhook v2 e IPN legacy)
    let paymentId: string | null = null

    if (body.type === "payment" && body.data?.id) {
      paymentId = String(body.data.id)
    } else if (body.topic === "payment" && body.resource) {
      const parts = body.resource.split("/")
      paymentId = parts[parts.length - 1]
    }

    if (!paymentId) {
      console.log("No paymentId found, ignoring.")
      return NextResponse.json({ received: true })
    }

    console.log(`Processing payment ${paymentId}...`)

    // ✅ Instanciar el cliente dentro del try-catch
    const mpClient = getMPClient()
    const paymentClient = new Payment(mpClient)

    // ✅ Convertir a NUMBER - el SDK lo requiere
    const payment = await paymentClient.get({ id: Number(paymentId) })

    if (!payment) {
      console.error("Payment not found:", paymentId)
      return NextResponse.json({ received: true })
    }

    if (!payment.external_reference) {
      console.log(
        `Payment ${paymentId} has no external_reference (status: ${payment.status}). Skipping.`
      )
      return NextResponse.json({ received: true })
    }

    const letterId = payment.external_reference
    const status = payment.status

    console.log(`Payment ${paymentId} → letter ${letterId} → status: ${status}`)

    if (status === "approved") {
      // 1. Actualizar DB (idempotente)
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
        console.log(`Letter ${letterId} already processed or not found.`)
        return NextResponse.json({ received: true })
      }

      const letter = updateResult[0]
      console.log(`Letter ${letterId} updated in DB.`)

      // 2. Enviar email (no bloquear el webhook si falla)
      try {
        await sendLetterEmail({
          to: letter.receiver_email,
          senderName: letter.sender_name,
          receiverName: letter.receiver_name,
          messageType: letter.message_type,
          letterId: letter.id,
        })
        console.log(`Email sent for letter ${letterId}`)
      } catch (emailError) {
        console.error(`Email failed for letter ${letterId}:`, emailError)
        // Guardar flag para reintentar después si quieres
        await sql`
          UPDATE letters SET email_sent = false WHERE id = ${letterId}
        `.catch(() => { })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook critical error:", error)
    // ✅ Siempre retornar 200 para evitar reintentos infinitos
    return NextResponse.json({ received: true })
  }
}