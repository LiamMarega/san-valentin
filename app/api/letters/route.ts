import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendLetterEmail } from "@/lib/email"
import { v4 as uuidv4 } from "uuid"
import { isThemeLocked } from "@/constants/themes"
import type { ThemeId } from "@/constants/themes"

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

    // Determinar si es premium basándose en el tema
    const is_premium = isThemeLocked(theme as ThemeId)
    // Estado de pago: si es premium -> pending, si no -> free
    const payment_status = is_premium ? "pending" : "free"

    // Generar un ID único para la carta
    const letterId = uuidv4()

    // Manejo de Fechas con Timezone
    if (scheduled_at && timezone) {
      await sql`
        INSERT INTO letters (
          id, sender_name, receiver_name, receiver_email, message_type,
          status, timezone, scheduled_at, created_at,
          theme, custom_content, relationship_type, photo_url, music_url,
          is_premium, payment_status
        ) VALUES (
          ${letterId}, ${sender_name}, ${receiver_name}, ${receiver_email}, ${message_type},
          'pending', ${timezone},
          (${scheduled_at}::timestamp AT TIME ZONE ${timezone}),
          NOW(),
          ${theme}, ${custom_content}, ${relationship_type}, ${photo_url}, ${music_url},
          ${is_premium}, ${payment_status}
        )
      `
    } else {
      // ENVIO INMEDIATO (Sin programar) o pendiente de pago
      const status = is_premium ? "pending_payment" : "sent"

      await sql`
        INSERT INTO letters (
          id, sender_name, receiver_name, receiver_email, message_type,
          status, created_at,
          theme, custom_content, relationship_type, photo_url, music_url,
          is_premium, payment_status
        ) VALUES (
          ${letterId}, ${sender_name}, ${receiver_name}, ${receiver_email}, ${message_type},
          ${status}, NOW(),
          ${theme}, ${custom_content}, ${relationship_type}, ${photo_url}, ${music_url},
          ${is_premium}, ${payment_status}
        )
      `

      // Solo enviamos el email si NO es premium (las premium esperan al webhook)
      if (!is_premium) {
        const result = await sendLetterEmail({
          to: receiver_email,
          senderName: sender_name,
          receiverName: receiver_name,
          messageType: message_type,
          letterId: letterId,
        })

        // Guardamos con qué proveedor se envió
        if (result?.provider) {
          await sql`
            UPDATE letters 
            SET email_provider = ${result.provider}
            WHERE id = ${letterId}
          `
        }
      }
    }

    return NextResponse.json({ success: true, letterId, isPremium: is_premium })
  } catch (error) {
    console.error("Error processing letter:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
