"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, HeartCrack } from "lucide-react"

export function LetterButtons({ letterId }: { letterId: string }) {
  const router = useRouter()
  const [isShaking, setIsShaking] = useState(false)
  const [noCount, setNoCount] = useState(0)

  const noTexts = [
    "No (es broma)",
    "Estas segura?",
    "Pensalo bien...",
    "Dale, di que si!",
    "No me hagas esto!",
    "Por favor?",
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
        className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-4 px-10 rounded-xl shadow-lg hover:opacity-90 hover:shadow-xl transition-all text-lg"
      >
        <Heart className="w-5 h-5" fill="currentColor" />
        {"Si, Claro que si!"}
      </button>
      <button
        type="button"
        onClick={handleNo}
        className={`inline-flex items-center justify-center gap-2 text-muted-foreground font-medium py-3 px-6 rounded-xl hover:bg-secondary transition-all ${isShaking ? "animate-shake" : ""}`}
      >
        <HeartCrack className="w-4 h-4" />
        {noTexts[noCount]}
      </button>
    </div>
  )
}
