import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendLetterEmail } from "@/lib/email"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      sender_name,
      receiver_name,
      receiver_email,
      message_type,
      scheduled_at,
      timezone,
      // v2 fields
      theme = "classic",
      custom_content = null,
      relationship_type = "pareja",
      photo_url = null,
      music_url = null,
    } = body

    // Generar un ID único para la carta
    const letterId = uuidv4()

    // Manejo de Fechas con Timezone
    if (scheduled_at && timezone) {
      await sql`
        INSERT INTO letters (
          id, sender_name, receiver_name, receiver_email, message_type,
          status, timezone, scheduled_at, created_at,
          theme, custom_content, relationship_type, photo_url, music_url
        ) VALUES (
          ${letterId}, ${sender_name}, ${receiver_name}, ${receiver_email}, ${message_type},
          'pending', ${timezone},
          (${scheduled_at}::timestamp AT TIME ZONE ${timezone}),
          NOW(),
          ${theme}, ${custom_content}, ${relationship_type}, ${photo_url}, ${music_url}
        )
      `
    } else {
      // ENVIO INMEDIATO (Sin programar)
      await sql`
        INSERT INTO letters (
          id, sender_name, receiver_name, receiver_email, message_type,
          status, created_at,
          theme, custom_content, relationship_type, photo_url, music_url
        ) VALUES (
          ${letterId}, ${sender_name}, ${receiver_name}, ${receiver_email}, ${message_type},
          'sent', NOW(),
          ${theme}, ${custom_content}, ${relationship_type}, ${photo_url}, ${music_url}
        )
      `

      // Enviamos el email YA
      await sendLetterEmail({
        to: receiver_email,
        senderName: sender_name,
        receiverName: receiver_name,
        messageType: message_type,
        letterId: letterId,
      })
    }

    return NextResponse.json({ success: true, letterId })
  } catch (error) {
    console.error("Error processing letter:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
