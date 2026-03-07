"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import type { ScratchThemeConfig } from "@/constants/scratch-themes"

// =============================================================================
// Animated Backgrounds for Premium Themes
// =============================================================================
// Each premium theme gets a unique, performant animated background that
// creates dramatic visual difference from the basic free theme.
// =============================================================================

interface AnimatedBackgroundProps {
  theme: ScratchThemeConfig
  className?: string
}

// Aurora Borealis Effect - Flowing gradient waves
function AuroraBackground({ theme }: { theme: ScratchThemeConfig }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `linear-gradient(180deg, ${theme.colors.background} 0%, ${theme.colors.secondary} 100%)` 
        }}
      />
      
      {/* Animated aurora layers */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${90 + i * 30}deg, 
              transparent 0%, 
              ${theme.colors.coverGradient[i % 3]}20 30%, 
              ${theme.colors.coverGradient[(i + 1) % 3]}15 50%, 
              ${theme.colors.coverGradient[(i + 2) % 3]}20 70%, 
              transparent 100%
            )`,
            filter: "blur(40px)",
          }}
          animate={{
            x: ["-20%", "20%", "-20%"],
            y: ["-10%", "10%", "-10%"],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
      
      {/* Soft glow overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${theme.colors.glow}30 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}

// Particle Field Effect - Floating cosmic particles
function ParticleBackground({ theme }: { theme: ScratchThemeConfig }) {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
  }>>([])

  useEffect(() => {
    // Generate particles only on client
    const newParticles = [...Array(40)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep space gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `radial-gradient(ellipse at 30% 20%, ${theme.colors.secondary} 0%, ${theme.colors.background} 70%)` 
        }}
      />
      
      {/* Nebula clouds */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 70% 60%, ${theme.colors.coverGradient[2]}20 0%, transparent 50%)`,
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: theme.colors.particles[p.id % theme.colors.particles.length],
            boxShadow: `0 0 ${p.size * 2}px ${theme.colors.glow}`,
          }}
          initial={{ top: `${p.y}%`, opacity: 0 }}
          animate={{
            top: [`${p.y}%`, `${p.y - 30}%`, `${p.y}%`],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

// Floating Petals Effect - Rose petals drifting down
function PetalsBackground({ theme }: { theme: ScratchThemeConfig }) {
  const [petals, setPetals] = useState<Array<{
    id: number
    x: number
    size: number
    duration: number
    delay: number
    rotation: number
  }>>([])

  useEffect(() => {
    const newPetals = [...Array(15)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 12 + Math.random() * 16,
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 5,
      rotation: Math.random() * 360,
    }))
    setPetals(newPetals)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Soft gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.secondary} 100%)` 
        }}
      />
      
      {/* Floating petals */}
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            width: petal.size,
            height: petal.size,
          }}
          initial={{ top: -20, rotate: petal.rotation, opacity: 0 }}
          animate={{
            top: "120%",
            rotate: petal.rotation + 360,
            opacity: [0, 0.8, 0.8, 0],
            x: [0, 30, -20, 10],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: petal.delay,
          }}
        >
          {/* Petal SVG */}
          <svg viewBox="0 0 24 24" fill={theme.colors.particles[petal.id % 3]} className="w-full h-full opacity-60">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${theme.colors.glow}15 0%, transparent 60%)`,
        }}
      />
    </div>
  )
}

// Flame Effect - Warm rising flames
function FlamesBackground({ theme }: { theme: ScratchThemeConfig }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dark gradient base */}
      <div 
        className="absolute inset-0"
        style={{ background: theme.colors.background }}
      />
      
      {/* Animated flame layers */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: `${60 + i * 10}%`,
            background: `linear-gradient(0deg, 
              ${theme.colors.coverGradient[i % 3]}${30 - i * 5} 0%, 
              transparent 100%
            )`,
            filter: `blur(${20 + i * 10}px)`,
            transformOrigin: "bottom center",
          }}
          animate={{
            scaleY: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
      
      {/* Ember particles */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 80%, ${theme.colors.glow}20 0%, transparent 50%)`,
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

// Sparkle/Diamond Effect - Luxury shimmering sparkles
function SparkleBackground({ theme }: { theme: ScratchThemeConfig }) {
  const [sparkles, setSparkles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
  }>>([])

  useEffect(() => {
    const newSparkles = [...Array(25)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 1.5 + Math.random() * 2,
      delay: Math.random() * 3,
    }))
    setSparkles(newSparkles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Luxury gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.secondary} 50%, ${theme.colors.background} 100%)` 
        }}
      />
      
      {/* Diagonal light beams */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(45deg, 
            transparent 0%, 
            ${theme.colors.glow}10 45%, 
            ${theme.colors.glow}20 50%, 
            ${theme.colors.glow}10 55%, 
            transparent 100%
          )`,
        }}
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 2,
        }}
      />
      
      {/* Sparkle points */}
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "easeOut",
            delay: s.delay,
          }}
        >
          {/* 4-point star sparkle */}
          <svg viewBox="0 0 24 24" className="w-full h-full" fill={theme.colors.glow}>
            <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

// Main Animated Background Component
export function AnimatedBackground({ theme, className = "" }: AnimatedBackgroundProps) {
  const animationType = theme.animation?.type || "none"
  
  // Use RepaintBoundary equivalent for performance
  return (
    <div className={`absolute inset-0 ${className}`} style={{ willChange: "transform" }}>
      {animationType === "aurora" && <AuroraBackground theme={theme} />}
      {animationType === "particles" && <ParticleBackground theme={theme} />}
      {animationType === "petals" && <PetalsBackground theme={theme} />}
      {animationType === "flames" && <FlamesBackground theme={theme} />}
      {animationType === "sparkle" && <SparkleBackground theme={theme} />}
      {animationType === "none" && (
        <div 
          className="absolute inset-0"
          style={{ background: theme.colors.background }}
        />
      )}
    </div>
  )
}
