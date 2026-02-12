import Link from "next/link"
import { Instagram } from "lucide-react"

export function FundingBanner() {
    return (
        <div className="w-full bg-secondary py-2 px-4 text-center border-b border-border relative z-50">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-primary font-medium text-sm">
                <span>Este proyecto está autofinanciado por <strong>@liammdev</strong></span>
                <span className="hidden sm:inline">•</span>
                <Link
                    href="https://www.instagram.com/liammdev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:underline transition-colors decoration-2 underline-offset-4"
                >
                    <Instagram className="w-4 h-4" />
                    ¡Sígueme en Instagram!
                </Link>
            </div>
        </div>
    )
}
