import Link from "next/link"
import { Sparkles } from "lucide-react"

export function FundingBanner() {
    return (
        <div className="sticky top-0 w-full bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-md py-2 px-4 text-center border-b border-amber-200 z-50">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-amber-800 font-medium text-sm">
                <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Temas Premium disponibles — <strong>solo $1 USD</strong> — hacé que tu carta sea ÚNICA
                </span>
                <span className="hidden sm:inline opacity-30">|</span>
                <a
                    href="https://www.instagram.com/liammdev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-amber-900 font-bold hover:underline"
                >
                    📸 @liammdev
                </a>
            </div>
        </div>
    )
}
