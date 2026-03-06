"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Sparkles } from "lucide-react"
import { getScratchThemeById, type ScratchThemeId } from "@/constants/scratch-themes"

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  velocityX: number
  velocityY: number
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

    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 12,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 30,
        velocityY: -15 - Math.random() * 25,
      })
    }

    setParticles(newParticles)

    // Show content after particle burst
    const timer = setTimeout(() => setShowContent(true), 400)

    // Play music if available
    if (musicUrl && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, user needs to interact
      })
    }

    return () => clearTimeout(timer)
  }, [isRevealed, themeConfig.colors.particles, musicUrl])

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
              top: `${particle.y + particle.velocityY + 120}%`,
              rotate: particle.rotation + 720,
              scale: [0, 1, 1, 0.5, 0],
            }}
            transition={{
              duration: 2.5,
              ease: "easeOut",
            }}
            style={{
              width: particle.size,
              height: particle.size,
            }}
          >
            {particle.id % 3 === 0 ? (
              <Heart
                className="w-full h-full"
                fill={particle.color}
                color={particle.color}
              />
            ) : particle.id % 3 === 1 ? (
              <Sparkles
                className="w-full h-full"
                color={particle.color}
              />
            ) : (
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
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-4 p-6 text-center max-w-full"
          >
            {/* Photo */}
            {photoUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={photoUrl}
                    alt="Foto especial"
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                </motion.div>
              </motion.div>
            )}

            {/* From sender */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-medium"
              style={{ color: themeConfig.colors.primary }}
            >
              De: {senderName}
            </motion.p>

            {/* Main message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <p
                className="text-xl font-bold leading-relaxed max-w-[280px]"
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
                transition={{ delay: 0.6 }}
                className="text-sm italic max-w-[260px]"
                style={{ color: themeConfig.colors.primary }}
              >
                &quot;{revealMessage}&quot;
              </motion.p>
            )}

            {/* Decorative hearts */}
            <motion.div
              className="flex gap-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={themeConfig.colors.primary}
                    color={themeConfig.colors.primary}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        style={{
          background: `radial-gradient(circle at center, ${themeConfig.colors.primary}40 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}
