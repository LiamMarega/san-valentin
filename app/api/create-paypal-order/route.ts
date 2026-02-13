import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { createPayPalOrder } from "@/lib/paypal"

export async function POST(req: Request) {
  try {
    const { letterId } = await req.json()

    if (!letterId) {
      return NextResponse.json(
        { error: "letterId is required" },
        { status: 400 }
      )
    }

    const rows = await sql`
      SELECT id, is_premium, payment_status, receiver_name, sender_name
      FROM letters
      WHERE id = ${letterId}
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Letter not found" },
        { status: 404 }
      )
    }

    const letter = rows[0]

    if (!letter.is_premium) {
      return NextResponse.json(
        { error: "Letter is not premium" },
        { status: 400 }
      )
    }

    if (letter.payment_status === "paid") {
      return NextResponse.json(
        { error: "Letter already paid" },
        { status: 400 }
      )
    }

    const { orderId } = await createPayPalOrder({
      letterId,
      senderName: letter.sender_name,
      receiverName: letter.receiver_name,
    })

    await sql`
      UPDATE letters
      SET paypal_order_id = ${orderId},
          payment_method = 'paypal'
      WHERE id = ${letterId}
    `

    return NextResponse.json({ orderId })
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 }
    )
  }
}
