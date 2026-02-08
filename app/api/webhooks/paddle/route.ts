import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendLetterEmail } from "@/lib/email"
import crypto from "crypto"

// Verificar la firma del webhook de Paddle
function verifyPaddleWebhook(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false

  try {
    const [tsPart, h1Part] = signature.split(";")
    const ts = tsPart.replace("ts=", "")
    const h1 = h1Part.replace("h1=", "")

    const signedPayload = `${ts}:${rawBody}`
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex")

    return crypto.timingSafeEqual(
      Buffer.from(h1),
      Buffer.from(expectedSig)
    )
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get("paddle-signature")

  // Verificar firma en producción
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET
  if (webhookSecret) {
    const isValid = verifyPaddleWebhook(rawBody, signature, webhookSecret)
    if (!isValid) {
      console.error("Invalid Paddle webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }
  }

  const body = JSON.parse(rawBody)
  const eventType = body.event_type

  if (eventType === "transaction.completed") {
    const transaction = body.data
    const customData = transaction.custom_data
    const letterId = customData?.letterId

    if (letterId) {
      console.log(`Pago recibido para carta: ${letterId}`)

      // 1. Actualizar DB a 'paid'
      const updateResult = await sql`
        UPDATE letters
        SET payment_status = 'paid', 
            paddle_txn_id = ${transaction.id},
            status = 'sent'
        WHERE id = ${letterId}
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
        console.log("Email enviado tras pago exitoso")
      }
    }
  }

  return NextResponse.json({ received: true })
}
