// app/api/webhooks/mercadopago/route.ts
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30 // Solo funciona en Vercel Pro (60s max)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("MP webhook received:", JSON.stringify(body))

    let paymentId: string | null = null

    if (body.type === "payment" && body.data?.id) {
      paymentId = String(body.data.id)
    } else if (body.topic === "payment" && body.resource) {
      paymentId = body.resource.split("/").pop() ?? null
    }

    if (!paymentId) {
      console.log("No paymentId found, ignoring.")
      return NextResponse.json({ received: true })
    }

    console.log(`Payment ${paymentId} received, processing in background...`)

    // ✅ Intentar usar after() para procesar en background (Next.js 15+)
    try {
      const { after } = require("next/server")
      if (typeof after === "function") {
        after(async () => {
          try {
            await processPayment(paymentId!)
          } catch (err) {
            console.error("Background processing error:", err)
          }
        })
        return NextResponse.json({ received: true })
      }
    } catch {
      // after() no disponible
    }

    // ✅ Fallback: usar waitUntil de Vercel
    try {
      const { waitUntil } = require("@vercel/functions")
      waitUntil(processPayment(paymentId))
      return NextResponse.json({ received: true })
    } catch {
      // waitUntil no disponible
    }

    // ✅ Último fallback: procesar inline pero con timeout safety
    await processPayment(paymentId)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook critical error:", error)
    return NextResponse.json({ received: true })
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" })
}

// =============================================
// Procesamiento del pago
// =============================================
async function processPayment(paymentId: string) {
  console.log(`[processPayment] Starting for ${paymentId}...`)

  const { MercadoPagoConfig, Payment } = await import("mercadopago")
  const { sql } = await import("@/lib/db")
  const { sendLetterEmail } = await import("@/lib/email")

  const token = process.env.MP_ACCESS_TOKEN
  if (!token) {
    console.error("MP_ACCESS_TOKEN not configured!")
    return
  }

  // 1. Consultar MP API
  console.log(`[processPayment] Fetching payment from MP API...`)
  const mpClient = new MercadoPagoConfig({ accessToken: token })
  const paymentClient = new Payment(mpClient)

  let payment
  try {
    payment = await paymentClient.get({ id: Number(paymentId) })
  } catch (mpError) {
    console.error(`[processPayment] MP API error:`, mpError)
    return
  }

  if (!payment) {
    console.log(`[processPayment] Payment not found`)
    return
  }

  console.log(`[processPayment] Status: ${payment.status}, Ref: ${payment.external_reference}`)

  if (!payment.external_reference) {
    console.log(`[processPayment] No external_reference, skipping`)
    return
  }

  if (payment.status !== "approved") {
    console.log(`[processPayment] Status is "${payment.status}", not approved. Skipping.`)
    return
  }

  const letterId = payment.external_reference

  // 2. Actualizar DB
  console.log(`[processPayment] Updating DB for letter ${letterId}...`)
  try {
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
      console.log(`[processPayment] Letter ${letterId} already processed or not found.`)
      return
    }

    const letter = updateResult[0]
    console.log(`[processPayment] Letter ${letterId} updated in DB.`)

    // 3. Enviar email
    console.log(`[processPayment] Sending email to ${letter.receiver_email}...`)
    try {
      await sendLetterEmail({
        to: letter.receiver_email,
        senderName: letter.sender_name,
        receiverName: letter.receiver_name,
        messageType: letter.message_type,
        letterId: letter.id,
      })
      console.log(`[processPayment] ✅ Email sent for letter ${letterId}`)
    } catch (emailError) {
      console.error(`[processPayment] ❌ Email failed:`, emailError)
    }
  } catch (dbError) {
    console.error(`[processPayment] ❌ DB error:`, dbError)
  }
}