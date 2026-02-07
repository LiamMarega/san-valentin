import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { FloralTopLeft, FloralBottomRight, FloralSmall } from "@/components/floral-decorations"
import { HeartConfetti } from "@/components/heart-confetti"
import { YesPageContent } from "@/components/yes-page-content"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const rows = await sql`SELECT sender_name FROM letters WHERE id = ${id}`
  if (rows.length === 0) return { title: "Carta no encontrada" }
  return {
    title: `Dijo que si! - Carta Secreta`,
    description: `${rows[0].sender_name} va a estar muy feliz.`,
  }
}

export default async function SiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const rows = await sql`SELECT sender_name, receiver_name FROM letters WHERE id = ${id}`

  if (rows.length === 0) {
    notFound()
  }

  const letter = rows[0]

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12">
      <HeartConfetti />

      {/* Floral decorations */}
      <FloralTopLeft className="absolute top-0 left-0 w-40 h-40 md:w-64 md:h-64 opacity-70 pointer-events-none -translate-x-8 -translate-y-8" />
      <FloralBottomRight className="absolute bottom-0 right-0 w-40 h-40 md:w-64 md:h-64 opacity-70 pointer-events-none translate-x-8 translate-y-8" />
      <FloralSmall className="absolute top-16 right-8 w-14 h-14 opacity-40 pointer-events-none animate-float hidden md:block" />
      <FloralSmall className="absolute bottom-28 left-10 w-10 h-10 opacity-30 pointer-events-none animate-float hidden md:block" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-2xl p-8 md:p-14 text-center animate-fade-in-up">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-block bg-secondary text-foreground px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase">
              Es oficial!
            </span>
          </div>

          <YesPageContent senderName={letter.sender_name} />

          {/* CTA hidden */}
          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-muted-foreground text-sm mb-3">
              {"Queres crear tu propia carta?"}
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-all shadow-lg"
            >
              Crear mi carta
            </a>
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
