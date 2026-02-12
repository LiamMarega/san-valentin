import Link from "next/link"
import { Instagram } from "lucide-react"

export function FundingBanner() {
    return (
        <div className="sticky top-0 w-full bg-secondary/80 backdrop-blur-md py-2 px-4 text-center border-b border-primary/20 z-50 animate-fade-in-down">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-primary font-medium text-sm">
                <span className="drop-shadow-[0_0_8px_rgba(199,106,91,0.3)]">
                    Este proyecto está autofinanciado por <Link
                        href="https://www.instagram.com/liammdev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary/90 hover:text-primary transition-colors active:scale-95 inline-block group"
                    >
                        <strong className="relative">
                            @liammdev
                            <span className="absolute inset-0 -z-10 blur-xl bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors"></span>
                        </strong>
                    </Link>
                </span>
                <span className="hidden sm:inline opacity-50">•</span>
                <Link
                    href="https://www.instagram.com/liammdev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:underline transition-all hover:scale-105 decoration-2 underline-offset-4 active:scale-95"
                >
                    <Instagram className="w-4 h-4" />
                    ¡Sígueme en Instagram!
                </Link>
            </div>
        </div>
    )
}
