import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { ThemedLetterView } from "@/components/themed-letter-view"
import type { LetterData } from "@/lib/types"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const rows = await sql`SELECT receiver_name, sender_name FROM letters WHERE id = ${id}`
  if (rows.length === 0) return { title: "Carta no encontrada" }
  return {
    title: `Carta para ${rows[0].receiver_name} - Carta Secreta`,
    description: `${rows[0].sender_name} tiene algo especial para vos.`,
  }
}

export default async function CartaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const rows = await sql`
    SELECT 
      id, sender_name, receiver_name, receiver_email, message_type, response,
      COALESCE(theme, 'classic') as theme,
      custom_content,
      COALESCE(relationship_type, 'pareja') as relationship_type,
      photo_url,
      music_url,
      COALESCE(is_premium, false) as is_premium,
      COALESCE(payment_status, 'free') as payment_status,
      mp_payment_id
    FROM letters 
    WHERE id = ${id}
  `

  if (rows.length === 0) {
    notFound()
  }

  const letter = rows[0] as LetterData

  // Proteger cartas premium que no se han pagado
  if (letter.is_premium && letter.payment_status !== "paid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">💌</div>
          <h1 className="text-2xl font-bold text-rose-800 mb-2">Carta Premium</h1>
          <p className="text-rose-600">
            Esta carta está esperando confirmación de pago. Una vez completado, estará disponible.
          </p>
        </div>
      </div>
    )
  }

  return <ThemedLetterView letter={letter} />
}
