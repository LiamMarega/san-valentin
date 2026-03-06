"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { getScratchThemeById, type ScratchThemeId } from "@/constants/scratch-themes"

interface ScratchPreviewProps {
  theme: ScratchThemeId
  senderName: string
  receiverName: string
  message: string
  size?: "sm" | "md" | "lg"
}

export function ScratchPreview({
  theme,
  senderName,
  receiverName,
  message,
  size = "md",
}: ScratchPreviewProps) {
  const themeConfig = getScratchThemeById(theme)

  const dimensions = {
    sm: { width: 160, height: 200 },
    md: { width: 240, height: 300 },
    lg: { width: 320, height: 400 },
  }

  const { width, height } = dimensions[size]

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xl"
      style={{ width, height }}
    >
      {/* Background/message layer */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
        style={{ backgroundColor: themeConfig.colors.card }}
      >
        <p
          className="text-xs font-medium mb-2"
          style={{ color: themeConfig.colors.primary }}
        >
          De: {senderName}
        </p>
        <p
          className="font-semibold leading-snug"
          style={{
            color: themeConfig.colors.text,
            fontSize: size === "sm" ? "0.75rem" : size === "md" ? "0.875rem" : "1rem",
          }}
        >
          {message.length > 80 ? `${message.slice(0, 80)}...` : message}
        </p>
        <div className="flex gap-1 mt-3">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className="w-3 h-3"
              fill={themeConfig.colors.primary}
              color={themeConfig.colors.primary}
            />
          ))}
        </div>
      </div>

      {/* Cover layer */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 1 }}
        style={{
          background: `linear-gradient(135deg, ${themeConfig.colors.coverGradient[0]}, ${themeConfig.colors.coverGradient[1]})`,
        }}
      >
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: themeConfig.coverPattern }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <p className="text-white font-medium text-xs mb-1 opacity-80">
            Para: {receiverName}
          </p>
          <p className="text-white font-bold" style={{ fontSize: size === "sm" ? "0.875rem" : "1rem" }}>
            Tienes un mensaje secreto
          </p>
          <p className="text-white/70 text-xs mt-2">
            Raspa para descubrir
          </p>
        </div>

        {/* Animated indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          animate={{
            y: [0, -5, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-white/40 border-dashed flex items-center justify-center">
            <Heart className="w-5 h-5 text-white/60" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
