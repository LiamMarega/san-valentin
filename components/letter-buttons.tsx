"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, HeartCrack, Lock } from "lucide-react"
import type { ThemeId } from "@/constants/themes"
import { cn } from "@/lib/utils"

// =============================================================================
// Theme-aware button styles
// =============================================================================
const YES_STYLES: Record<ThemeId, string> = {
  classic:
    "bg-[#8D5B4C] text-white hover:bg-[#72463A] rounded-xl shadow-lg",
  scrapbook:
    "bg-[#5D54A4] text-white hover:bg-[#4a4282] rounded-3xl shadow-[0_6px_0_0_#3e376e] active:shadow-none active:translate-y-[6px] border-2 border-white",
  editorial:
    "bg-[#1A1A1A] text-white hover:bg-[#CC7A6F] px-8 py-3 text-xs uppercase tracking-[0.2em]",
  midnight:
    "bg-gradient-to-r from-[#FF007F] to-purple-600 text-white rounded-full shadow-[0_0_10px_rgba(255,0,127,0.5)]",
}

const NO_STYLES: Record<ThemeId, string> = {
  classic:
    "text-[#8D5B4C]/60 hover:bg-[#F4E4E4] rounded-xl",
  scrapbook:
    "text-[#5D54A4]/60 hover:bg-[#FFB7C5]/20 rounded-3xl",
  editorial:
    "text-gray-400 hover:text-gray-600 text-xs uppercase tracking-[0.15em]",
  midnight:
    "text-[#E0BFB8]/60 hover:text-white hover:bg-white/5 rounded-full",
}

export function LetterButtons({
  letterId,
  themeId = "classic",
}: {
  letterId: string
  themeId?: ThemeId
}) {
  const router = useRouter()
  const [isShaking, setIsShaking] = useState(false)
  const [noCount, setNoCount] = useState(0)
   const [clickCount, setClickCount] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [isFloating, setIsFloating] = useState(false)
  const [randomPosition, setRandomPosition] = useState<{ top: number; left: number }>({
    top: 50,
    left: 50,
  })

  const noTexts = [
    "No",
    "¿Estás segura?",
    "Pensalo bien...",
    "¡Dale, decí que sí!",
    "¡No me hagas esto!",
    "¿Por favor?",
    "¿Segura, segura?",
    "Mirá bien la cartita...",
    "Te va a gustar, prometo",
    "No seas mala conmigo",
    "Un sí no hace daño",
    "Pensá en los besitos",
    "Ya casi ponés que sí",
    "No rompas mi corazoncito",
    "Te estoy mirando...",
    "Nicole, sos increíble",
    "Aceptá mi amorcito",
    "No me dejes en visto",
    "Apretá el botón rosa",
    "Decí que sí, va",
    "No seas tímida",
    "Mi corazón late por vos",
    "Me puse nervioso escribiendo esto",
    "Una oportunidad, solo una",
    "No me canceles así",
    "Pensá en todo lo lindo juntos",
    "Spoiler: la respuesta correcta es sí",
    "El botón de sí se ve más lindo",
    "Tu sonrisa vale un sí",
    "No me hagas rogar tanto",
    "Mi mamá ya te quiere",
    "Los gatos votan que sí",
    "Este botón sufre cada click",
    "Tu nombre y el mío combinan",
    "Seríamos una linda pareja",
    "No seas fría conmigo",
    "Mi cora ya dijo que sí",
    "¿Y si probamos a ver qué pasa?",
    "Te prometo muchas risas",
    "Te prometo muchos abrazos",
    "Te prometo chocolates",
    "Voy a escribirte más cartas",
    "Me esforcé mucho en esto",
    "Ya le conté a los amigos",
    "Los planetas se alinean si decís que sí",
    "Esta es una señal del destino",
    "Últimas chances de decir que sí...",
    "Ok, ya me duele el botón",
    "¿De verdad vas a seguir tocando no?",
    "En serio, pensalo una vez más",
  ]

  async function handleYes() {
    await fetch(`/api/letters/${letterId}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response: "si" }),
    })
    router.push(`/carta/${letterId}/si`)
  }

  function handleNo() {
    if (isLocked) return

    setIsShaking(true)
    setClickCount((prev) => {
      const next = prev + 1

      if (next >= 10 && !isLocked) {
        // Posición aleatoria dentro de la card (en porcentajes)
        const top = 15 + Math.random() * 70 // entre 15% y 85%
        const left = 15 + Math.random() * 70 // entre 15% y 85%
        setRandomPosition({ top, left })
        setIsFloating(true)
      }

      return next
    })

    setNoCount((prev) => {
      const next = prev + 1

      if (next >= noTexts.length - 1) {
        // Mostramos el último texto y bloqueamos el botón
        setIsLocked(true)
        setIsFloating(false)
        setRandomPosition({ top: 50, left: 50 })
        return noTexts.length - 1
      }

      return next
    })

    setTimeout(() => setIsShaking(false), 500)
  }

  const noButtonDisabledClasses = isLocked
    ? "opacity-60 cursor-not-allowed pointer-events-none border border-dashed border-[#5D54A4]/40"
    : ""

  const noButtonStyle = isFloating && !isLocked
    ? ({
        position: "absolute",
        top: `${randomPosition.top}%`,
        left: `${randomPosition.left}%`,
        transform: "translate(-50%, -50%)",
      } as const)
    : undefined

  return (
    <div className="relative flex flex-col sm:flex-row items-center gap-4 justify-center">
      <button
        type="button"
        onClick={handleYes}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-bold py-4 px-10 transition-all text-lg",
          YES_STYLES[themeId]
        )}
      >
        <Heart className="w-5 h-5" fill="currentColor" />
        {"¡Sí, claro que sí!"}
      </button>
      <button
        type="button"
        onClick={handleNo}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-medium py-3 px-6 transition-all",
          NO_STYLES[themeId],
          isShaking && "animate-shake",
          noButtonDisabledClasses
        )}
        style={noButtonStyle}
      >
        {isLocked && (
          <span className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
            <Lock className="w-3 h-3 text-[#5D54A4]" />
          </span>
        )}
        <HeartCrack className="w-4 h-4" />
        {isLocked ? "No acepto un NO" : noTexts[noCount]}
      </button>
    </div>
  )
}
