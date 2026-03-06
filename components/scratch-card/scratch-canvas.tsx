"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getScratchThemeById, type ScratchThemeId } from "@/constants/scratch-themes"

interface ScratchCanvasProps {
  width?: number
  height?: number
  theme: ScratchThemeId
  brushSize?: number
  revealThreshold?: number
  onScratchProgress?: (percentage: number) => void
  onReveal?: () => void
  children: React.ReactNode
  disabled?: boolean
}

export function ScratchCanvas({
  width = 320,
  height = 400,
  theme,
  brushSize = 40,
  revealThreshold = 60,
  onScratchProgress,
  onReveal,
  children,
  disabled = false,
}: ScratchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [scratchPercentage, setScratchPercentage] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const themeConfig = getScratchThemeById(theme)

  // Initialize canvas with cover
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Create gradient cover
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, themeConfig.colors.coverGradient[0])
    gradient.addColorStop(1, themeConfig.colors.coverGradient[1])

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Add pattern overlay
    const patternImg = new Image()
    patternImg.crossOrigin = "anonymous"
    
    // Create pattern from data URL
    const patternUrl = themeConfig.coverPattern.replace('url("', '').replace('")', '')
    patternImg.src = patternUrl
    
    patternImg.onload = () => {
      const pattern = ctx.createPattern(patternImg, "repeat")
      if (pattern) {
        ctx.fillStyle = pattern
        ctx.fillRect(0, 0, width, height)
      }
    }

    // Add scratch hint text
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.font = "bold 18px system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Raspa aqui", width / 2, height / 2 - 20)
    
    ctx.font = "14px system-ui, sans-serif"
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.fillText("para descubrir tu mensaje", width / 2, height / 2 + 10)

    // Draw decorative elements based on theme
    drawThemeDecorations(ctx, width, height, themeConfig.brushStyle)
  }, [width, height, themeConfig])

  // Draw theme-specific decorations
  function drawThemeDecorations(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    style: string
  ) {
    ctx.save()
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)"

    if (style === "hearts") {
      // Draw small hearts
      for (let i = 0; i < 12; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        drawHeart(ctx, x, y, 12 + Math.random() * 8)
      }
    } else if (style === "sparkle") {
      // Draw sparkles/stars
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        drawStar(ctx, x, y, 4 + Math.random() * 4, 4)
      }
    }

    ctx.restore()
  }

  function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath()
    ctx.moveTo(x, y + size / 4)
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4)
    ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size)
    ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4)
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4)
    ctx.fill()
  }

  function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, points: number) {
    ctx.beginPath()
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? r : r / 2
      const angle = (i * Math.PI) / points - Math.PI / 2
      const px = x + radius * Math.cos(angle)
      const py = y + radius * Math.sin(angle)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }

  // Calculate scratch percentage
  const calculateScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return 0

    const ctx = canvas.getContext("2d")
    if (!ctx) return 0

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let transparentPixels = 0
    const totalPixels = pixels.length / 4

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++
    }

    return Math.round((transparentPixels / totalPixels) * 100)
  }, [])

  // Scratch function
  const scratch = useCallback(
    (x: number, y: number) => {
      if (disabled || isRevealed) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.globalCompositeOperation = "destination-out"

      if (lastPointRef.current) {
        // Draw line from last point for smooth scratching
        ctx.beginPath()
        ctx.lineWidth = brushSize
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      // Draw circle at current point
      ctx.beginPath()
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
      ctx.fill()

      lastPointRef.current = { x, y }

      // Haptic feedback on mobile
      if ("vibrate" in navigator && !hasStarted) {
        navigator.vibrate(10)
        setHasStarted(true)
      }
    },
    [brushSize, disabled, isRevealed, hasStarted]
  )

  // Get coordinates from event
  const getCoordinates = (
    e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ("touches" in e) {
      const touch = e.touches[0]
      if (!touch) return null
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  // Event handlers
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || isRevealed) return
    e.preventDefault()
    setIsScratching(true)
    const coords = getCoordinates(e)
    if (coords) scratch(coords.x, coords.y)
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching || disabled || isRevealed) return
    e.preventDefault()
    const coords = getCoordinates(e)
    if (coords) scratch(coords.x, coords.y)
  }

  const handleEnd = () => {
    if (!isScratching) return
    setIsScratching(false)
    lastPointRef.current = null

    // Calculate and update percentage
    const percentage = calculateScratchPercentage()
    setScratchPercentage(percentage)
    onScratchProgress?.(percentage)

    // Check if revealed
    if (percentage >= revealThreshold && !isRevealed) {
      setIsRevealed(true)
      onReveal?.()
      
      // Haptic feedback for reveal
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    }
  }

  // Global mouse/touch events for better UX
  useEffect(() => {
    const handleGlobalEnd = () => {
      if (isScratching) {
        handleEnd()
      }
    }

    window.addEventListener("mouseup", handleGlobalEnd)
    window.addEventListener("touchend", handleGlobalEnd)

    return () => {
      window.removeEventListener("mouseup", handleGlobalEnd)
      window.removeEventListener("touchend", handleGlobalEnd)
    }
  }, [isScratching])

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden shadow-2xl"
      style={{ width, height }}
    >
      {/* Hidden message layer */}
      <div
        className="absolute inset-0 flex items-center justify-center p-6"
        style={{ backgroundColor: themeConfig.colors.card }}
      >
        {children}
      </div>

      {/* Scratch canvas layer */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 cursor-crosshair touch-none"
            style={{ width: "100%", height: "100%" }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      {!isRevealed && scratchPercentage > 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white text-xs font-medium">
            {scratchPercentage}% raspado
          </span>
        </div>
      )}

      {/* Scratch hint animation */}
      {!hasStarted && !disabled && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-16 h-16 rounded-full border-4 border-white/50 border-dashed" />
        </motion.div>
      )}
    </div>
  )
}
