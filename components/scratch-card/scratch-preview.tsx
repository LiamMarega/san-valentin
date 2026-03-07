"use client"

import { motion } from "framer-motion"
import { Heart, Crown } from "lucide-react"
import { getScratchThemeById, type ScratchThemeId } from "@/constants/scratch-themes"

// =============================================================================
// Scratch Card Preview Component
// =============================================================================
// Shows a preview of how the scratch card will look, including premium chrome
// effects and visual indicators for premium themes.
// =============================================================================

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
  const isPremium = themeConfig.tier === "premium"

  const dimensions = {
    sm: { width: 160, height: 200 },
    md: { width: 240, height: 300 },
    lg: { width: 320, height: 400 },
  }

  const { width, height } = dimensions[size]

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ 
        width, 
        height,
        boxShadow: isPremium 
          ? `0 10px 40px -10px ${themeConfig.colors.glow}50, 0 4px 6px -2px rgba(0, 0, 0, 0.1)`
          : "0 10px 25px -10px rgba(0, 0, 0, 0.2)",
      }}
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

      {/* Cover layer with chrome effect for premium */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 1 }}
        style={{
          background: isPremium && themeConfig.chrome.enabled
            ? `linear-gradient(${themeConfig.chrome.angle}deg, 
                ${themeConfig.chrome.highlights[0]}, 
                ${themeConfig.chrome.highlights[1]} 30%, 
                ${themeConfig.chrome.highlights[2]} 50%,
                ${themeConfig.chrome.highlights[1]} 70%,
                ${themeConfig.chrome.highlights[3]})`
            : `linear-gradient(135deg, ${themeConfig.colors.coverGradient[0]}, ${themeConfig.colors.coverGradient[1]}, ${themeConfig.colors.coverGradient[2]})`,
        }}
      >
        {/* Shimmer effect for premium */}
        {isPremium && themeConfig.chrome.shimmer && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                105deg,
                transparent 40%,
                rgba(255, 255, 255, 0.3) 45%,
                rgba(255, 255, 255, 0.5) 50%,
                rgba(255, 255, 255, 0.3) 55%,
                transparent 60%
              )`,
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["200% 0", "-200% 0"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2,
            }}
          />
        )}

        {/* Subtle inner border for 3D effect */}
        <div 
          className="absolute inset-1 rounded-xl pointer-events-none"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          {/* Premium badge */}
          {isPremium && (
            <div className="flex items-center justify-center gap-1 mb-2">
              <Crown className="w-3 h-3 text-white/80" />
              <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider">
                Premium
              </span>
            </div>
          )}
          
          <p className="text-white font-medium text-xs mb-1 opacity-80">
            Para: {receiverName}
          </p>
          <p className="text-white font-bold drop-shadow" style={{ fontSize: size === "sm" ? "0.875rem" : "1rem" }}>
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
          <div 
            className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center"
            style={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
          >
            <Heart className="w-5 h-5 text-white/60" />
          </div>
        </motion.div>
      </motion.div>

      {/* Outer glow for premium */}
      {isPremium && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            boxShadow: `inset 0 0 30px ${themeConfig.colors.glow}20`,
          }}
        />
      )}
    </div>
  )
}
