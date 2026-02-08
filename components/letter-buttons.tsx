"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, HeartCrack } from "lucide-react"
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

  const noTexts = [
    "No (es broma)",
    "¿Estás segura?",
    "Pensalo bien...",
    "¡Dale, decí que sí!",
    "¡No me hagas esto!",
    "¿Por favor?",
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
    setIsShaking(true)
    setNoCount((prev) => Math.min(prev + 1, noTexts.length - 1))
    setTimeout(() => setIsShaking(false), 500)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
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
          "inline-flex items-center justify-center gap-2 font-medium py-3 px-6 transition-all",
          NO_STYLES[themeId],
          isShaking && "animate-shake"
        )}
      >
        <HeartCrack className="w-4 h-4" />
        {noTexts[noCount]}
      </button>
    </div>
  )
}
