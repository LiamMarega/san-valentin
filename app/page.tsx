"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LetterForm } from "@/components/letter-form"
import { FloralTopLeft, FloralBottomRight, FloralSmall } from "@/components/floral-decorations"
import { Heart, Sparkles } from "lucide-react"
import { initAnalytics, trackEvent } from "@/lib/firebase"

export default function Home() {
  const [visitorCount, setVisitorCount] = useState(14)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Inicializar con un número aleatorio entre 5 y 20
    setVisitorCount(Math.floor(Math.random() * (20 - 5 + 1)) + 5)

    // Inicializa analytics para la sesión y registra la vista de la home
    initAnalytics()
    trackEvent("page_view", {
      page: "home",
      path: typeof window !== "undefined" ? window.location.pathname : "/",
    })

    // Cambiar cada 3 minutos
    const interval = setInterval(() => {
      setVisitorCount(Math.floor(Math.random() * (20 - 5 + 1)) + 5)
    }, 180000)

    return () => clearInterval(interval)
  }, [])
  return (
    <main className="min-h-screen relative overflow-x-hidden flex flex-col items-center justify-center px-4 py-12">
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
          <p className="text-muted-foreground text-center text-base md:text-lg leading-relaxed text-pretty max-w-xl mx-auto mb-6">
            Personaliza tu carta con diferentes estilos, elige a quién va dirigida y previsualizala en vivo.
          </p>

          {/* Social proof + urgency badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            {/* Social proof */}
            <div className="flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-2">
              <Heart className="w-4 h-4 text-primary" fill="currentColor" />
              <span className="text-sm font-medium text-foreground">
                +300 cartas enviadas
              </span>
            </div>

            {/* Urgency */}
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-sm font-medium text-red-700">
                {mounted ? visitorCount : 14} personas creando ahora
              </span>
            </div>
          </div>
        </div>

        {/* Form + Preview */}
        <div className="animate-fade-in-up animate-delay-200">
          <LetterForm />
        </div>

        {/* Comparación Free vs Pro */}
        <section className="mt-20 mb-16">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-center text-foreground mb-2">
            Hacé que tu carta sea inolvidable
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            Por el precio de un café, tu carta pasa de linda a extraordinaria
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="border border-border rounded-2xl p-6 bg-card">
              <h3 className="font-semibold text-lg mb-1">Gratis</h3>
              <p className="text-2xl font-bold mb-4">$0</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">✅ 2 temas básicos</li>
                <li className="flex items-center gap-2">✅ Envío por email</li>
                <li className="flex items-center gap-2">✅ Programar envío</li>
                <li className="flex items-center gap-2 opacity-40">❌ Temas exclusivos</li>
                <li className="flex items-center gap-2 opacity-40">❌ Animaciones premium</li>
                <li className="flex items-center gap-2 opacity-40">❌ Diseño que destaca</li>
              </ul>
            </div>

            {/* Pro */}
            <div className="border-2 border-amber-300 rounded-2xl p-6 bg-gradient-to-br from-amber-50 to-orange-50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                ⭐ RECOMENDADO
              </div>
              <h3 className="font-semibold text-lg mb-1 text-amber-800">Pro</h3>
              <p className="text-2xl font-bold mb-4 text-amber-900">
                $1 <span className="text-sm font-normal text-amber-600">USD</span>
              </p>
              <ul className="space-y-3 text-sm text-amber-800">
                <li className="flex items-center gap-2">✅ Todo lo gratis incluido</li>
                <li className="flex items-center gap-2">✅ Temas exclusivos premium</li>
                <li className="flex items-center gap-2">✅ Animaciones especiales</li>
                <li className="flex items-center gap-2">✅ Diseño que tu persona especial recordará</li>
                <li className="flex items-center gap-2">✅ Sin límite de envíos</li>
                <li className="flex items-center gap-2">✅ Apoyas un proyecto independiente 💛</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-semibold text-center text-foreground mb-8">
            Lo que dicen quienes ya enviaron su carta 💬
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                text: "Mi novia lloró de emoción cuando la leyó. El tema Medianoche es HERMOSO.",
                emoji: "😍"
              },
              {
                text: "Gastamos más en chicles. Por $1 USD le hice el regalo más lindo del día.",
                emoji: "💌"
              },
              {
                text: "Lo programé para las 00:00 del 14 de febrero. Fue lo primero que vio al despertar.",
                emoji: "🎯"
              },
            ].map((t, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="text-3xl mb-3">{t.emoji}</div>
                <p className="text-sm text-foreground italic mb-3">&ldquo;{t.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </section>

        {/* Instagram CTA */}
        <section className="mb-16 max-w-xl mx-auto">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">📸</div>
            <h3 className="font-semibold text-lg text-foreground mb-2">
              ¿Te gustó? ¡Seguime en Instagram!
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comparto más proyectos creativos, tutoriales y regalos digitales gratis
            </p>
            <a
              href="https://www.instagram.com/liammdev/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              Seguir a @liammdev
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-border mt-8">
          <div className="container mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-4">
              © 2026 ValentineDayLetter by{" "}
              <Link
                href="https://www.instagram.com/liammdev/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                @LiammDev
              </Link>
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
              <Link href="/pricing" className="hover:underline">Precios</Link>
              <Link href="/terms" className="hover:underline">Terms &amp; Conditions</Link>
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link href="/refund" className="hover:underline">Refund Policy</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
