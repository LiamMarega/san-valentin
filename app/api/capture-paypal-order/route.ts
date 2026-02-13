import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { capturePayPalOrder } from "@/lib/paypal"
import { sendLetterEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { orderId, letterId } = await req.json()

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      )
    }

    console.log(`[PayPal] Capturing order ${orderId}...`)
    const captureResult = await capturePayPalOrder(orderId)

    if (captureResult.status !== "COMPLETED") {
      console.log(`[PayPal] Order ${orderId} status: ${captureResult.status}, not COMPLETED`)
      return NextResponse.json(
        { error: "Payment not completed", status: captureResult.status },
        { status: 400 }
      )
    }

    const resolvedLetterId = letterId || captureResult.letterId

    if (!resolvedLetterId) {
      console.error("[PayPal] No letterId found after capture")
      return NextResponse.json(
        { error: "No letter ID found" },
        { status: 400 }
      )
    }

    console.log(`[PayPal] Updating DB for letter ${resolvedLetterId}...`)
    const updateResult = await sql`
      UPDATE letters
      SET payment_status = 'paid',
          paypal_order_id = ${orderId},
          payment_method = 'paypal',
          status = 'sent'
      WHERE id = ${resolvedLetterId}
        AND payment_status != 'paid'
      RETURNING *
    `

    if (updateResult.length === 0) {
      console.log(`[PayPal] Letter ${resolvedLetterId} already processed or not found`)
      return NextResponse.json({ success: true, letterId: resolvedLetterId })
    }

    const letter = updateResult[0]

    console.log(`[PayPal] Sending email to ${letter.receiver_email}...`)
    try {
      const emailResult = await sendLetterEmail({
        to: letter.receiver_email,
        senderName: letter.sender_name,
        receiverName: letter.receiver_name,
        messageType: letter.message_type,
        letterId: letter.id,
      })

      if (emailResult?.provider) {
        await sql`
          UPDATE letters
          SET email_provider = ${emailResult.provider}
          WHERE id = ${letter.id}
        `
      }

      console.log(`[PayPal] Email sent for letter ${resolvedLetterId} via ${emailResult.provider}`)
    } catch (emailError) {
      console.error(`[PayPal] Email failed:`, emailError)
    }

    return NextResponse.json({ success: true, letterId: resolvedLetterId })
  } catch (error) {
    console.error("[PayPal] Capture error:", error)
    return NextResponse.json(
      { error: "Failed to capture payment" },
      { status: 500 }
    )
  }
}
