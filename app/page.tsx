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
      <div className="relative z-10 w-full max-w-lg">
        {/* Logo / Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shadow-sm">
            <Heart className="w-7 h-7 text-primary" fill="currentColor" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-10 animate-fade-in-up">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-block bg-secondary text-foreground px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase">
              San Valentin
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center leading-tight text-balance mb-4">
            Alguien especial merece una pregunta especial
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-center text-base md:text-lg leading-relaxed mb-8 text-pretty">
            Crea una carta digital y enviala por email para hacer una pregunta que nunca olvidara.
          </p>

          {/* Form */}
          <LetterForm />
        </div>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Hecho con amor para San Valentin
          </p>
        </footer>
      </div>
    </main>
  )
}
