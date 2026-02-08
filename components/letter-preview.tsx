"use client"

import React from "react"
import { AnimatePresence } from "framer-motion"
import { LetterTemplate } from "@/components/letter-template"
import type { ThemeId } from "@/constants/themes"

export interface LetterPreviewProps {
  themeId: ThemeId
  senderName: string
  receiverName: string
  messageType: string
  customContent: string
  relationshipType: string
}

export function LetterPreview({
  themeId,
  senderName,
  receiverName,
  messageType,
  customContent,
  relationshipType,
}: LetterPreviewProps) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-card">
      {/* Preview header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b border-border/50">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        </div>
        <span className="text-[10px] text-muted-foreground tracking-wider uppercase ml-2 font-medium">
          Vista previa en vivo
        </span>
      </div>

      {/* Preview content */}
      <div className="max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="wait">
          <LetterTemplate
            key={themeId}
            themeId={themeId}
            senderName={senderName}
            receiverName={receiverName}
            messageType={messageType}
            customContent={customContent}
            relationshipType={relationshipType}
          />
        </AnimatePresence>
      </div>
    </div>
  )
}
