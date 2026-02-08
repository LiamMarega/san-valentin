import Link from "next/link"
import { FloralTopLeft, FloralBottomRight, FloralSmall } from "@/components/floral-decorations"
import { Heart, CheckCircle, PenLine, Home, CalendarClock } from "lucide-react"

const MONTHS_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

function formatScheduledDate(dateStr: string, timeStr: string): { date: string; time: string } {
  const [y, m, d] = dateStr.split("-").map(Number)
  const date = `${d} de ${MONTHS_ES[m - 1]} de ${y}`
  const time = timeStr.length >= 5 ? timeStr.slice(0, 5) : timeStr
  return { date, time }
}

export const metadata = {
  title: "Carta enviada - Carta Secreta",
}

type SentPageProps = { searchParams: Promise<{ scheduled?: string; date?: string; time?: string }> }

export default async function SentPage({ searchParams }: SentPageProps) {
  const params = await searchParams
  const isScheduled = params.scheduled === "1" && params.date && params.time
  const { date: formattedDate, time: formattedTime } = isScheduled && params.date && params.time
    ? formatScheduledDate(params.date, params.time)
    : { date: "", time: "" }

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12">
      {/* Floral decorations */}
      <FloralTopLeft className="absolute top-0 left-0 w-40 h-40 md:w-64 md:h-64 opacity-70 pointer-events-none -translate-x-8 -translate-y-8" />
      <FloralBottomRight className="absolute bottom-0 right-0 w-40 h-40 md:w-64 md:h-64 opacity-70 pointer-events-none translate-x-8 translate-y-8" />
      <FloralSmall className="absolute top-16 right-8 w-14 h-14 opacity-40 pointer-events-none animate-float hidden md:block" />
      <FloralSmall className="absolute bottom-24 left-12 w-10 h-10 opacity-30 pointer-events-none animate-float hidden md:block" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 text-center animate-fade-in-up">
          {/* Heart icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary" fill="currentColor" />
            </div>
          </div>

          {/* Check badge */}
          <div className="flex justify-center mb-4">
            {isScheduled ? (
              <CalendarClock className="w-6 h-6 text-primary" />
            ) : (
              <CheckCircle className="w-6 h-6 text-primary" />
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
            {isScheduled ? "Carta programada" : "Carta enviada!"}
          </h1>

          {/* Message */}
          {isScheduled ? (
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              La carta fue programada para el {formattedDate} a las {formattedTime}.
            </p>
          ) : (
            <>
              <p className="text-muted-foreground text-lg leading-relaxed mb-2">
                La carta ya esta en camino.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                Ahora solo queda esperar a que el amor florezca...
              </p>
            </>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-medium py-3 px-6 rounded-lg hover:bg-secondary transition-all"
            >
              <PenLine className="w-4 h-4" />
              Crear otra carta
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all shadow-lg"
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Hecho con amor para San Valentín por{" "}
            <a
              href="https://www.instagram.com/liammdev/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-pink-500 hover:text-pink-600 hover:underline underline-offset-2 transition-colors"
            >
              @LiammDev
            </a>
            {" · "}
            <Link href="/terms" className="text-muted-foreground hover:text-foreground hover:underline underline-offset-2 transition-colors">
              Términos y Condiciones
            </Link>
          </p>
        </footer>
      </div>
    </main>
  )
}
