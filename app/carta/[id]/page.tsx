import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { FloralTopLeft, FloralBottomRight, FloralSmall } from "@/components/floral-decorations"
import { LetterButtons } from "@/components/letter-buttons"
import type { Metadata } from "next"

interface LetterRow {
  id: string
  sender_name: string
  receiver_name: string
  message_type: string
}

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
  const rows = await sql`SELECT id, sender_name, receiver_name, message_type FROM letters WHERE id = ${id}`

  if (rows.length === 0) {
    notFound()
  }

  const letter = rows[0] as LetterRow

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12">
      {/* Floral decorations */}
      <FloralTopLeft className="absolute top-0 left-0 w-44 h-44 md:w-72 md:h-72 opacity-80 pointer-events-none -translate-x-6 -translate-y-6" />
      <FloralBottomRight className="absolute bottom-0 right-0 w-44 h-44 md:w-72 md:h-72 opacity-80 pointer-events-none translate-x-6 translate-y-6" />
      <FloralSmall className="absolute top-24 right-12 w-14 h-14 opacity-40 pointer-events-none animate-float hidden md:block" />
      <FloralSmall className="absolute bottom-20 left-8 w-12 h-12 opacity-30 pointer-events-none animate-float hidden md:block" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-2xl p-8 md:p-14 text-center animate-fade-in-up">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-block bg-secondary text-foreground px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase">
              Dia 14: San Valentin
            </span>
          </div>

          {/* Greeting */}
          <h1 className="font-handwritten text-3xl md:text-4xl text-primary mb-3 animate-fade-in-up">
            Hola, {letter.receiver_name}
          </h1>

          {/* Message */}
          <p className="text-muted-foreground uppercase tracking-wider text-sm md:text-base mb-10 animate-fade-in-up animate-delay-100">
            {letter.sender_name} tiene algo importante que preguntarte...
          </p>

          {/* Question */}
          <div className="mb-12 animate-fade-in-up animate-delay-200">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-foreground leading-tight">
              {letter.message_type.startsWith("Queres") ? (
                <>
                  {"Queres ser mi"}
                  <br />
                  <span className="text-primary italic underline decoration-accent decoration-2 underline-offset-8">
                    {letter.message_type.includes("Valentin") ? "San Valentin?" : "novia?"}
                  </span>
                </>
              ) : (
                <span className="text-primary italic">{letter.message_type}</span>
              )}
            </h2>
          </div>

          {/* Buttons */}
          <div className="animate-fade-in-up animate-delay-300">
            <LetterButtons letterId={letter.id} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Hecho con amor para San Valentin
          </p>
          <a
            href="https://www.instagram.com/liammdev"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-pink-500 hover:text-pink-600 underline underline-offset-2 transition-colors"
          >
            Desarrollado por @LiammDev
          </a>
        </footer>
      </div>
    </main>
  )
}
