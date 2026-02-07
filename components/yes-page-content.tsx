"use client"

import { Heart } from "lucide-react"

export function YesPageContent({ senderName }: { senderName: string }) {
  return (
    <>
      {/* Celebration icon */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center animate-float">
          <Heart className="w-12 h-12 text-primary" fill="currentColor" />
        </div>
      </div>

      {/* Title */}
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
        {"Sabia que dirias que si!"}
      </h1>

      {/* Message */}
      <p className="text-muted-foreground text-xl md:text-2xl leading-relaxed">
        {senderName} va a estar muy feliz.
      </p>
    </>
  )
}
