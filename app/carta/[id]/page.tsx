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
      id, sender_name, receiver_name, message_type, response,
      COALESCE(theme, 'classic') as theme,
      custom_content,
      COALESCE(relationship_type, 'pareja') as relationship_type,
      photo_url,
      music_url
    FROM letters 
    WHERE id = ${id}
  `

  if (rows.length === 0) {
    notFound()
  }

  const letter = rows[0] as LetterData

  return <ThemedLetterView letter={letter} />
}
