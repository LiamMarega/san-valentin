import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendLetterEmail } from "@/lib/email"

// Importante: Esto evita que la ruta se cachee
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  // Verificación de seguridad (Opcional pero recomendada para CRON)
  // Verifica si el header de autorización coincide (si configuras CRON_SECRET en vercel)
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Buscar cartas pendientes cuya fecha programada ya pasó (o es ahora)
    const lettersToSend = await sql`
      SELECT * FROM letters 
      WHERE status = 'pending' 
      AND scheduled_at IS NOT NULL 
      AND scheduled_at <= NOW()
      LIMIT 50
    `
    // Limitamos a 50 para no saturar la ejecución serverless si hay muchas

    const results = {
      success: 0,
      failed: 0
    }

    // 2. Iterar y enviar
    for (const letter of lettersToSend) {
      try {
        const result = await sendLetterEmail({
          to: letter.receiver_email,
          senderName: letter.sender_name,
          receiverName: letter.receiver_name,
          messageType: letter.message_type,
          letterId: letter.id
        })

        // 3. Marcar como enviada y guardar proveedor
        await sql`
          UPDATE letters 
          SET status = 'sent', 
              sent_at = NOW(),
              email_provider = ${result.provider}
          WHERE id = ${letter.id}
        `
        results.success++
      } catch (err) {
        console.error(`Error sending letter ${letter.id}:`, err)
        // Opcional: Marcar como fallida o incrementar un contador de retries
        await sql`
          UPDATE letters SET status = 'failed' WHERE id = ${letter.id}
        `
        results.failed++
      }
    }

    return NextResponse.json({
      message: "Cron job executed",
      processed: lettersToSend.length,
      ...results
    })

  } catch (error) {
    console.error("Cron Job Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
