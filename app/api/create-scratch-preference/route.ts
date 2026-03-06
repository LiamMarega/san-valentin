import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { sql } from "@/lib/db"

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const { scratchCardId } = await req.json()

    if (!scratchCardId) {
      return NextResponse.json(
        { error: "scratchCardId is required" },
        { status: 400 }
      )
    }

    // Verify scratch card exists and is premium with pending payment
    const rows = await sql`
      SELECT id, is_premium, payment_status, receiver_name, sender_name
      FROM scratch_cards
      WHERE id = ${scratchCardId}
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Scratch card not found" },
        { status: 404 }
      )
    }

    const scratchCard = rows[0]

    if (!scratchCard.is_premium) {
      return NextResponse.json(
        { error: "Scratch card is not premium" },
        { status: 400 }
      )
    }

    if (scratchCard.payment_status === "paid") {
      return NextResponse.json(
        { error: "Scratch card already paid" },
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
            id: scratchCardId,
            title: `Raspadito Premium - De ${scratchCard.sender_name} para ${scratchCard.receiver_name}`,
            quantity: 1,
            unit_price: 2.99,
            currency_id: "USD",
          },
        ],
        back_urls: {
          success: `https://www.valentinedayletter.com/raspadito/exito?id=${scratchCardId}`,
          failure: `https://www.valentinedayletter.com/raspadito?payment=failed`,
          pending: `https://www.valentinedayletter.com/raspadito/exito?id=${scratchCardId}&payment=pending`,
        },
        external_reference: `scratch_${scratchCardId}`,
        notification_url: `https://www.valentinedayletter.com/api/webhooks/mercadopago`,
        statement_descriptor: "RaspaditoAmor",
      },
    })

    return NextResponse.json({
      init_point: result.init_point,
      preference_id: result.id,
    })
  } catch (error) {
    console.error("Error creating MercadoPago preference for scratch card:", error)
    return NextResponse.json(
      { error: "Failed to create payment preference" },
      { status: 500 }
    )
  }
}
