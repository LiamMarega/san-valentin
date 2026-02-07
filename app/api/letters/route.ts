import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendLetterEmail } from "@/lib/email"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sender_name, receiver_name, receiver_email, message_type, scheduled_at, timezone } = body
    
    // Generar un ID único para la carta
    const letterId = uuidv4()
    
    let finalScheduledAt = null
    let status = 'pending' // Por defecto pendiente

    // Manejo de Fechas con Timezone
    if (scheduled_at && timezone) {
      // Postgres necesita saber que este string corresponde a esa zona horaria
      // La lógica aquí es guardar en UTC en la base de datos
      // scheduled_at viene como "2024-02-14T14:30:00" (hora local del usuario)
      
      // Creamos la query para insertar con timezone
      await sql`
        INSERT INTO letters (
          id, sender_name, receiver_name, receiver_email, message_type, 
          status, timezone, scheduled_at, created_at
        ) VALUES (
          ${letterId}, ${sender_name}, ${receiver_name}, ${receiver_email}, ${message_type},
          'pending', ${timezone}, 
          (${scheduled_at}::timestamp AT TIME ZONE ${timezone}), 
          NOW()
        )
      `
    } else {
      // ENVIO INMEDIATO (Sin programar)
      await sql`
        INSERT INTO letters (
          id, sender_name, receiver_name, receiver_email, message_type, 
          status, created_at
        ) VALUES (
          ${letterId}, ${sender_name}, ${receiver_name}, ${receiver_email}, ${message_type},
          'sent', NOW()
        )
      `
      
      // Enviamos el email YA
      await sendLetterEmail({
        to: receiver_email,
        senderName: sender_name,
        receiverName: receiver_name,
        messageType: message_type,
        letterId: letterId
      })
    }

    return NextResponse.json({ success: true, letterId })
    
  } catch (error) {
    console.error("Error processing letter:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
