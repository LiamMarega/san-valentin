"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Sparkles, Star } from "lucide-react"
import { getScratchThemeById, type ScratchThemeId } from "@/constants/scratch-themes"

// =============================================================================
// Premium Reveal Animation
// =============================================================================
// Celebrates the scratch card reveal with theme-appropriate confetti,
// smooth content transitions, and optional audio playback.
// =============================================================================

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  velocityX: number
  velocityY: number
  type: "heart" | "sparkle" | "star" | "square"
}

interface RevealAnimationProps {
  isRevealed: boolean
  theme: ScratchThemeId
  photoUrl?: string | null
  musicUrl?: string | null
  senderName: string
  message: string
  revealMessage?: string | null
}

export function RevealAnimation({
  isRevealed,
  theme,
  photoUrl,
  musicUrl,
  senderName,
  message,
  revealMessage,
}: RevealAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [showContent, setShowContent] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const themeConfig = getScratchThemeById(theme)

  // Generate confetti particles on reveal
  useEffect(() => {
    if (!isRevealed) return

    const colors = themeConfig.colors.particles
    const newParticles: Particle[] = []
    const particleCount = themeConfig.tier === "premium" ? 80 : 40

    for (let i = 0; i < particleCount; i++) {
      const types: Particle["type"][] = ["heart", "sparkle", "star", "square"]
      newParticles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 30,
        y: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 14,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 40,
        velocityY: -20 - Math.random() * 30,
        type: types[i % types.length],
      })
    }

    setParticles(newParticles)

    // Show content after particle burst
    const timer = setTimeout(() => setShowContent(true), 350)

    // Play music if available
    if (musicUrl && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, user needs to interact
      })
    }

    return () => clearTimeout(timer)
  }, [isRevealed, themeConfig.colors.particles, themeConfig.tier, musicUrl])

  if (!isRevealed) return null

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
      {/* Audio element for music */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop className="hidden" />
      )}

      {/* Confetti particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            initial={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              rotate: particle.rotation,
              scale: 0,
            }}
            animate={{
              left: `${particle.x + particle.velocityX}%`,
              top: `${particle.y + particle.velocityY + 140}%`,
              rotate: particle.rotation + 720,
              scale: [0, 1.2, 1, 0.8, 0],
            }}
            transition={{
              duration: 2.8,
              ease: "easeOut",
            }}
            style={{
              width: particle.size,
              height: particle.size,
            }}
          >
            {particle.type === "heart" && (
              <Heart
                className="w-full h-full"
                fill={particle.color}
                color={particle.color}
              />
            )}
            {particle.type === "sparkle" && (
              <Sparkles
                className="w-full h-full"
                color={particle.color}
              />
            )}
            {particle.type === "star" && (
              <Star
                className="w-full h-full"
                fill={particle.color}
                color={particle.color}
              />
            )}
            {particle.type === "square" && (
              <div
                className="w-full h-full rounded-sm"
                style={{ backgroundColor: particle.color }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center gap-4 p-6 text-center max-w-full"
          >
            {/* Photo */}
            {photoUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease: "backOut" }}
                className="relative"
              >
                <div 
                  className="w-24 h-24 rounded-full overflow-hidden border-4 shadow-xl"
                  style={{ borderColor: themeConfig.colors.primary }}
                >
                  <img
                    src={photoUrl}
                    alt="Foto especial"
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart 
                    className="w-7 h-7 drop-shadow-lg" 
                    fill={themeConfig.colors.primary}
                    color={themeConfig.colors.primary}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* From sender */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-sm font-semibold"
              style={{ color: themeConfig.colors.primary }}
            >
              De: {senderName}
            </motion.p>

            {/* Main message */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="relative"
            >
              {/* Glow effect behind text for premium */}
              {themeConfig.tier === "premium" && (
                <div 
                  className="absolute inset-0 blur-2xl opacity-30"
                  style={{ backgroundColor: themeConfig.colors.glow }}
                />
              )}
              <p
                className="relative text-xl font-bold leading-relaxed max-w-[280px]"
                style={{ color: themeConfig.colors.text }}
              >
                {message}
              </p>
            </motion.div>

            {/* Reveal message */}
            {revealMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm italic max-w-[260px]"
                style={{ color: themeConfig.colors.primary }}
              >
                &quot;{revealMessage}&quot;
              </motion.p>
            )}

            {/* Decorative hearts with staggered animation */}
            <motion.div
              className="flex gap-3 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={themeConfig.colors.particles[i % themeConfig.colors.particles.length]}
                    color={themeConfig.colors.particles[i % themeConfig.colors.particles.length]}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background glow effect - More dramatic for premium */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: themeConfig.tier === "premium" ? 0.4 : 0.25 }}
        transition={{ duration: 1 }}
        style={{
          background: `radial-gradient(circle at center, ${themeConfig.colors.glow}50 0%, transparent 60%)`,
        }}
      />

      {/* Secondary pulse glow for premium */}
      {themeConfig.tier === "premium" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: `radial-gradient(circle at center, ${themeConfig.colors.primary}30 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  )
}
