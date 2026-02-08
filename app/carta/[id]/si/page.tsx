import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { ThemedCelebration } from "@/components/themed-celebration"
import type { LetterData } from "@/lib/types"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const rows = await sql`SELECT sender_name FROM letters WHERE id = ${id}`
  if (rows.length === 0) return { title: "Carta no encontrada" }
  return {
    title: `¡Dijo que sí! - Carta Secreta`,
    description: `${rows[0].sender_name} va a estar muy feliz.`,
  }
}

export default async function SiPage({ params }: { params: Promise<{ id: string }> }) {
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

  return <ThemedCelebration letter={letter} />
}
