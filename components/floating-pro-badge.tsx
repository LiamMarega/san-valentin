"use client"
import { useState, useEffect } from "react"
import { Sparkles, X } from "lucide-react"

export function FloatingProBadge() {
    const [visible, setVisible] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 5000) // show after 5s
        return () => clearTimeout(timer)
    }, [])

    if (!visible || dismissed) return null

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80 animate-fade-in-up">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 relative">
                <button
                    onClick={() => setDismissed(true)}
                    className="absolute top-2 right-2 text-white/60 hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>
                <div className="bg-white/20 rounded-full p-2 shrink-0">
                    <Sparkles className="w-6 h-6 text-amber-200" />
                </div>
                <div>
                    <p className="font-bold text-sm">¡Temas Pro por solo $1!</p>
                    <p className="text-xs text-white/80">
                        Hacé que tu carta sea inolvidable ✨
                    </p>
                </div>
            </div>
        </div>
    )
}
