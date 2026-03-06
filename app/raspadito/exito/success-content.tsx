"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Copy, Check, Share2, Mail, Sparkles, Clock } from "lucide-react"
import { ScratchPreview } from "@/components/scratch-card"
import type { ScratchCard } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SuccessContentProps {
  scratchCard: ScratchCard
  shareUrl: string
  isPending?: boolean
}

export function SuccessContent({ scratchCard, shareUrl, isPending }: SuccessContentProps) {
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Raspadito de amor para ${scratchCard.receiver_name}`,
          text: `${scratchCard.sender_name} te envio un raspadito con un mensaje secreto!`,
          url: shareUrl,
        })
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink()
    }
  }

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `${scratchCard.receiver_name}, te envie un raspadito con un mensaje secreto! Raspalo para descubrirlo: ${shareUrl}`
    )
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3"
              initial={{
                top: -20,
                left: `${Math.random() * 100}%`,
                rotate: 0,
              }}
              animate={{
                top: "110%",
                rotate: 720,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "linear",
              }}
            >
              {i % 3 === 0 ? (
                <Heart className="w-full h-full text-rose-400 fill-rose-400" />
              ) : i % 3 === 1 ? (
                <Sparkles className="w-full h-full text-amber-400" />
              ) : (
                <div className="w-full h-full rounded-sm bg-pink-400" />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            {isPending ? (
              <Clock className="w-8 h-8 text-amber-500" />
            ) : (
              <Check className="w-8 h-8 text-green-500" />
            )}
          </motion.div>

          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {isPending ? "Pago pendiente" : "Raspadito creado!"}
          </h1>
          <p className="text-slate-600">
            {isPending
              ? "Tu pago esta siendo procesado. El raspadito estara disponible pronto."
              : `Tu raspadito para ${scratchCard.receiver_name} esta listo para compartir`}
          </p>
        </div>

        {/* Preview card */}
        <div className="flex justify-center mb-8">
          <ScratchPreview
            theme={scratchCard.theme}
            senderName={scratchCard.sender_name}
            receiverName={scratchCard.receiver_name}
            message={scratchCard.hidden_message}
            size="sm"
          />
        </div>

        {/* Share section */}
        {!isPending && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-rose-500" />
              Comparte el link
            </h2>

            {/* Link input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-600 truncate"
              />
              <button
                onClick={handleCopyLink}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1",
                  copied
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>

            {/* Share buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </button>

              {typeof navigator !== "undefined" && navigator.share && (
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Compartir
                </button>
              )}
            </div>
          </div>
        )}

        {/* Info box */}
        <div className="bg-rose-50 rounded-xl p-4 text-sm text-rose-800">
          <p className="flex items-start gap-2">
            <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              {isPending
                ? "Cuando el pago se confirme, el destinatario recibira un email con el link al raspadito."
                : `${scratchCard.receiver_name} podra raspar la tarjeta para descubrir tu mensaje secreto.`}
            </span>
          </p>
        </div>

        {/* Create another */}
        <div className="mt-8 text-center">
          <a
            href="/raspadito"
            className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600 font-medium"
          >
            <Heart className="w-4 h-4" />
            Crear otro raspadito
          </a>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/20 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
