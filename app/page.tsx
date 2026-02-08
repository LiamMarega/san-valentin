import Link from "next/link"
import { LetterForm } from "@/components/letter-form"
import { FloralTopLeft, FloralBottomRight, FloralSmall } from "@/components/floral-decorations"
import { Heart } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12">
      {/* Floral decorations */}
      <FloralTopLeft className="absolute top-0 left-0 w-48 h-48 md:w-72 md:h-72 opacity-80 pointer-events-none -translate-x-8 -translate-y-8" />
      <FloralBottomRight className="absolute bottom-0 right-0 w-48 h-48 md:w-72 md:h-72 opacity-80 pointer-events-none translate-x-8 translate-y-8" />
      <FloralSmall className="absolute top-20 right-10 w-16 h-16 opacity-50 pointer-events-none animate-float hidden md:block" />
      <FloralSmall className="absolute bottom-32 left-10 w-12 h-12 opacity-40 pointer-events-none animate-float hidden md:block" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-6xl">
        {/* Logo / Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shadow-sm">
            <Heart className="w-7 h-7 text-primary" fill="currentColor" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-block bg-secondary text-foreground px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase">
              Regalos Digitales
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center leading-tight text-balance mb-4">
            Crea un regalo digital único
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-center text-base md:text-lg leading-relaxed text-pretty max-w-xl mx-auto">
            Personaliza tu carta con diferentes estilos, elige a quién va dirigida y previsualizala en vivo.
          </p>
        </div>

        {/* Form + Preview */}
        <div className="animate-fade-in-up animate-delay-200">
          <LetterForm />
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
