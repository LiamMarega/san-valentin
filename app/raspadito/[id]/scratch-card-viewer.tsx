"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Share2, Copy, Check } from "lucide-react"
import { ScratchCanvas, RevealAnimation } from "@/components/scratch-card"
import { markAsScratched, updateScratchProgress } from "@/lib/scratch-actions"
import { getScratchThemeById } from "@/constants/scratch-themes"
import type { ScratchCard } from "@/lib/types"

interface ScratchCardViewerProps {
  scratchCard: ScratchCard
}

export function ScratchCardViewer({ scratchCard }: ScratchCardViewerProps) {
  const [isRevealed, setIsRevealed] = useState(scratchCard.status === "scratched")
  const [scratchProgress, setScratchProgress] = useState(scratchCard.scratch_percentage)
  const [copied, setCopied] = useState(false)

  const themeConfig = getScratchThemeById(scratchCard.theme)

  const handleScratchProgress = useCallback(
    async (percentage: number) => {
      setScratchProgress(percentage)
      // Update progress in DB (debounced in real app)
      if (percentage % 20 === 0) {
        await updateScratchProgress(scratchCard.id, percentage)
      }
    },
    [scratchCard.id]
  )

  const handleReveal = useCallback(async () => {
    setIsRevealed(true)
    await markAsScratched(scratchCard.id)
  }, [scratchCard.id])

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/raspadito/${scratchCard.id}`
    const shareText = `${scratchCard.sender_name} te envio un raspadito de amor! Raspa para descubrir el mensaje.`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Raspadito de Amor",
          text: shareText,
          url: shareUrl,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="text-rose-500 font-medium mb-2">
          De: {scratchCard.sender_name}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
          {scratchCard.receiver_name}, tienes un mensaje secreto
        </h1>
        {!isRevealed && (
          <p className="text-slate-500 text-sm">
            Raspa la tarjeta para descubrir tu sorpresa
          </p>
        )}
      </motion.div>

      {/* Scratch Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <ScratchCanvas
          width={320}
          height={400}
          theme={scratchCard.theme}
          brushSize={45}
          revealThreshold={60}
          onScratchProgress={handleScratchProgress}
          onReveal={handleReveal}
          disabled={isRevealed}
        >
          {/* Hidden content */}
          <div className="flex flex-col items-center justify-center text-center h-full">
            <RevealAnimation
              isRevealed={isRevealed}
              theme={scratchCard.theme}
              photoUrl={scratchCard.photo_url}
              musicUrl={scratchCard.music_url}
              senderName={scratchCard.sender_name}
              message={scratchCard.hidden_message}
              revealMessage={scratchCard.reveal_message}
            />

            {/* Fallback content if not revealed yet (visible through scratched areas) */}
            {!isRevealed && (
              <div className="p-4">
                <p
                  className="text-xs font-medium mb-2"
                  style={{ color: themeConfig.colors.primary }}
                >
                  De: {scratchCard.sender_name}
                </p>
                <p
                  className="text-lg font-bold leading-relaxed"
                  style={{ color: themeConfig.colors.text }}
                >
                  {scratchCard.hidden_message}
                </p>
                {scratchCard.reveal_message && (
                  <p
                    className="text-sm italic mt-3"
                    style={{ color: themeConfig.colors.primary }}
                  >
                    &quot;{scratchCard.reveal_message}&quot;
                  </p>
                )}
                <div className="flex justify-center gap-1 mt-4">
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      className="w-4 h-4"
                      fill={themeConfig.colors.primary}
                      color={themeConfig.colors.primary}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScratchCanvas>
      </motion.div>

      {/* Actions after reveal */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <p className="text-slate-600 text-sm text-center max-w-xs">
              Comparte este momento especial o crea tu propio raspadito
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copiado!
                  </>
                ) : (
                  <>
                    {navigator.share ? (
                      <Share2 className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    Compartir
                  </>
                )}
              </button>

              <a
                href="/raspadito"
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Crear el mio
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress hint (before reveal) */}
      {!isRevealed && scratchProgress > 0 && scratchProgress < 60 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-slate-500 text-sm"
        >
          Sigue raspando... {Math.round(scratchProgress)}% descubierto
        </motion.p>
      )}

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/10 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
