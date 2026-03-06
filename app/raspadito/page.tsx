import { Metadata } from "next"
import { Heart, Sparkles } from "lucide-react"
import { ScratchForm } from "@/components/scratch-card"

export const metadata: Metadata = {
  title: "Crear Raspadito de Amor | Valentine's Day Letter",
  description:
    "Crea un raspadito digital con un mensaje secreto para esa persona especial. Sorprendela con una tarjeta interactiva que tiene que raspar para descubrir tu mensaje de amor.",
  openGraph: {
    title: "Crear Raspadito de Amor",
    description: "Sorprende a esa persona especial con un raspadito digital lleno de amor",
  },
}

export default function RaspaditoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-rose-200/30 rounded-full blur-2xl" />
          <div className="absolute top-20 right-20 w-32 h-32 bg-pink-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-amber-200/20 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-12 sm:py-16">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Nuevo: Raspaditos de Amor
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 text-balance">
              Crea un raspadito con tu{" "}
              <span className="text-rose-500">mensaje secreto</span>
            </h1>
            
            <p className="text-slate-600 max-w-md mx-auto text-balance">
              Sorprende a esa persona especial con una tarjeta interactiva. 
              Tendran que raspar para descubrir tu mensaje de amor.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: Heart, text: "Mensaje personalizado" },
              { icon: Sparkles, text: "Temas exclusivos" },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-slate-600 shadow-sm"
              >
                <feature.icon className="w-4 h-4 text-rose-500" />
                {feature.text}
              </div>
            ))}
          </div>

          {/* Form */}
          <ScratchForm />
        </div>
      </div>
    </main>
  )
}
