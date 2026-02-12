import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { sql } from "@/lib/db"

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const { letterId } = await req.json()

    if (!letterId) {
      return NextResponse.json(
        { error: "letterId is required" },
        { status: 400 }
      )
    }

    // Verificar que la carta existe y es premium con pago pendiente
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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      ? process.env.NEXT_PUBLIC_APP_URL.startsWith("http")
        ? process.env.NEXT_PUBLIC_APP_URL
        : `https://${process.env.NEXT_PUBLIC_APP_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"

    const preference = new Preference(mpClient)

    const result = await preference.create({
      body: {
        items: [
          {
            id: letterId,
            title: `Carta Premium - De ${letter.sender_name} para ${letter.receiver_name}`,
            quantity: 1,
            unit_price: 1,
            currency_id: "USD",
          },
        ],
        back_urls: {
          success: `https://www.valentinedayletter.com/sent`,
          failure: `https://www.valentinedayletter.com/?payment=failed`,
          pending: `https://www.valentinedayletter.com/sent?payment=pending`,
        },
        external_reference: letterId,
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        statement_descriptor: "CartaSecreta",
      },
    })

    return NextResponse.json({
      init_point: result.init_point,
      preference_id: result.id,
    })
  } catch (error) {
    console.error("Error creating MercadoPago preference:", error)
    return NextResponse.json(
      { error: "Failed to create payment preference" },
      { status: 500 }
    )
  }
}
