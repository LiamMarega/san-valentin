"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getScratchThemeById, type ScratchThemeId } from "@/constants/scratch-themes"

// =============================================================================
// Premium Scratch Canvas Component
// =============================================================================
// Features:
// - Chrome/metallic scratch surface with light reflection simulation
// - Continuous haptic feedback during scratching (friction-like)
// - SVG overlay patterns for premium themes
// - 60fps optimized scratching with smooth brush strokes
// =============================================================================

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

// Haptic feedback utility - subtle friction-like vibration
function triggerHaptic(type: "scratch" | "reveal" | "start") {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return
  
  switch (type) {
    case "scratch":
      // Very subtle, friction-like vibration (5ms)
      navigator.vibrate(5)
      break
    case "start":
      // Slightly longer for first touch
      navigator.vibrate(15)
      break
    case "reveal":
      // Celebration pattern
      navigator.vibrate([50, 30, 50, 30, 100])
      break
  }
}

export function ScratchCanvas({
  width = 320,
  height = 400,
  theme,
  brushSize = 45,
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
  const [showShimmer, setShowShimmer] = useState(true)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const hapticIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const themeConfig = getScratchThemeById(theme)

  // Initialize canvas with chrome/metallic cover
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    // Draw the scratch surface
    drawChromeLayer(ctx, width, height)
  }, [width, height, themeConfig])

  // Draw chrome/metallic layer
  function drawChromeLayer(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.clearRect(0, 0, w, h)

    if (themeConfig.chrome.enabled) {
      // Create metallic chrome gradient at 45 degrees
      const angle = (themeConfig.chrome.angle * Math.PI) / 180
      const gradientLength = Math.sqrt(w * w + h * h)
      const centerX = w / 2
      const centerY = h / 2
      
      const x1 = centerX - (gradientLength / 2) * Math.cos(angle)
      const y1 = centerY - (gradientLength / 2) * Math.sin(angle)
      const x2 = centerX + (gradientLength / 2) * Math.cos(angle)
      const y2 = centerY + (gradientLength / 2) * Math.sin(angle)

      const chromeGradient = ctx.createLinearGradient(x1, y1, x2, y2)
      
      // Chrome highlight stops for metallic effect
      chromeGradient.addColorStop(0, themeConfig.chrome.highlights[0])
      chromeGradient.addColorStop(0.3, themeConfig.chrome.highlights[1])
      chromeGradient.addColorStop(0.5, themeConfig.chrome.highlights[2])
      chromeGradient.addColorStop(0.7, themeConfig.chrome.highlights[1])
      chromeGradient.addColorStop(1, themeConfig.chrome.highlights[3])

      ctx.fillStyle = chromeGradient
      ctx.fillRect(0, 0, w, h)

      // Add subtle noise texture for realism
      addNoiseTexture(ctx, w, h, 0.03)
    } else {
      // Basic gradient for free theme
      const gradient = ctx.createLinearGradient(0, 0, w, h)
      gradient.addColorStop(0, themeConfig.colors.coverGradient[0])
      gradient.addColorStop(0.5, themeConfig.colors.coverGradient[1])
      gradient.addColorStop(1, themeConfig.colors.coverGradient[2])
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)
    }

    // Draw SVG overlay pattern for premium themes
    if (themeConfig.svgOverlay && themeConfig.tier === "premium") {
      drawSvgPattern(ctx, w, h, themeConfig.svgOverlay)
    }

    // Add subtle inner border for 3D effect
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.lineWidth = 2
    ctx.strokeRect(4, 4, w - 8, h - 8)
    
    // Add outer shadow effect via inner darker border
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
    ctx.lineWidth = 1
    ctx.strokeRect(1, 1, w - 2, h - 2)

    // Draw scratch hint
    drawScratchHint(ctx, w, h)
    
    // Draw decorative elements based on brush style
    drawThemeDecorations(ctx, w, h, themeConfig.brushStyle)
  }

  // Add subtle noise texture for metallic realism
  function addNoiseTexture(ctx: CanvasRenderingContext2D, w: number, h: number, opacity: number) {
    const imageData = ctx.getImageData(0, 0, w, h)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 255 * opacity
      data[i] = Math.min(255, Math.max(0, data[i] + noise))
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
    }
    
    ctx.putImageData(imageData, 0, 0)
  }

  // Draw SVG pattern overlay
  function drawSvgPattern(ctx: CanvasRenderingContext2D, w: number, h: number, svgString: string) {
    const img = new Image()
    const blob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    
    img.onload = () => {
      ctx.globalAlpha = 0.5
      const pattern = ctx.createPattern(img, "repeat")
      if (pattern) {
        ctx.fillStyle = pattern
        ctx.fillRect(0, 0, w, h)
      }
      ctx.globalAlpha = 1
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  // Draw scratch hint text
  function drawScratchHint(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save()
    
    // Add text shadow for depth
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
    ctx.shadowBlur = 4
    ctx.shadowOffsetY = 2
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
    ctx.font = "bold 20px system-ui, -apple-system, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Raspa aqui", w / 2, h / 2 - 25)
    
    ctx.shadowBlur = 2
    ctx.font = "15px system-ui, -apple-system, sans-serif"
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.fillText("para descubrir tu mensaje", w / 2, h / 2 + 5)
    
    // Draw coin/scratch icon hint
    ctx.beginPath()
    ctx.arc(w / 2, h / 2 + 45, 18, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
    ctx.lineWidth = 2
    ctx.setLineDash([4, 4])
    ctx.stroke()
    ctx.setLineDash([])
    
    // Finger/scratch icon in center
    ctx.font = "16px system-ui"
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
    ctx.fillText("👆", w / 2, h / 2 + 47)
    
    ctx.restore()
  }

  // Draw theme-specific decorations
  function drawThemeDecorations(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    style: string
  ) {
    ctx.save()
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)"

    if (style === "hearts") {
      for (let i = 0; i < 10; i++) {
        const x = 20 + Math.random() * (w - 40)
        const y = 20 + Math.random() * (h - 40)
        if (Math.abs(x - w/2) > 60 || Math.abs(y - h/2) > 80) {
          drawHeart(ctx, x, y, 10 + Math.random() * 8)
        }
      }
    } else if (style === "sparkle" || style === "stars") {
      for (let i = 0; i < 12; i++) {
        const x = 20 + Math.random() * (w - 40)
        const y = 20 + Math.random() * (h - 40)
        if (Math.abs(x - w/2) > 60 || Math.abs(y - h/2) > 80) {
          drawStar(ctx, x, y, 4 + Math.random() * 4, 4)
        }
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

    const dpr = window.devicePixelRatio || 1
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let transparentPixels = 0
    const totalPixels = pixels.length / 4

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++
    }

    return Math.round((transparentPixels / totalPixels) * 100)
  }, [])

  // Scratch function with haptic feedback
  const scratch = useCallback(
    (x: number, y: number) => {
      if (disabled || isRevealed) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      ctx.save()
      ctx.scale(dpr, dpr)

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

      ctx.restore()
      lastPointRef.current = { x, y }

      // First scratch haptic
      if (!hasStarted) {
        triggerHaptic("start")
        setHasStarted(true)
        setShowShimmer(false)
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
    const scaleX = width / rect.width
    const scaleY = height / rect.height

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
    
    // Start continuous haptic feedback
    if (hapticIntervalRef.current) clearInterval(hapticIntervalRef.current)
    hapticIntervalRef.current = setInterval(() => {
      if (isScratching) triggerHaptic("scratch")
    }, 50) // Subtle vibration every 50ms while scratching
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching || disabled || isRevealed) return
    e.preventDefault()
    const coords = getCoordinates(e)
    if (coords) scratch(coords.x, coords.y)
  }

  const handleEnd = useCallback(() => {
    if (!isScratching) return
    setIsScratching(false)
    lastPointRef.current = null
    
    // Stop haptic interval
    if (hapticIntervalRef.current) {
      clearInterval(hapticIntervalRef.current)
      hapticIntervalRef.current = null
    }

    // Calculate and update percentage
    const percentage = calculateScratchPercentage()
    setScratchPercentage(percentage)
    onScratchProgress?.(percentage)

    // Check if revealed
    if (percentage >= revealThreshold && !isRevealed) {
      setIsRevealed(true)
      triggerHaptic("reveal")
      onReveal?.()
    }
  }, [isScratching, calculateScratchPercentage, revealThreshold, isRevealed, onScratchProgress, onReveal])

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
      if (hapticIntervalRef.current) clearInterval(hapticIntervalRef.current)
    }
  }, [isScratching, handleEnd])

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden"
      style={{ 
        width, 
        height,
        // 3D physical presence with box shadow
        boxShadow: themeConfig.tier === "premium" 
          ? `0 10px 40px -10px ${themeConfig.colors.glow}60, 
             0 4px 6px -2px rgba(0, 0, 0, 0.1),
             inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : "0 10px 30px -10px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
      }}
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
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <canvas
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
            />
            
            {/* Shimmer effect for premium themes */}
            {themeConfig.chrome.shimmer && showShimmer && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
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
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 3,
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      {!isRevealed && scratchPercentage > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-1.5"
        >
          <span className="text-white text-xs font-semibold">
            {scratchPercentage}% raspado
          </span>
        </motion.div>
      )}

      {/* Pulsing scratch hint animation */}
      {!hasStarted && !disabled && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ marginTop: 40 }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div 
            className="w-14 h-14 rounded-full border-[3px] border-dashed"
            style={{ borderColor: "rgba(255, 255, 255, 0.6)" }}
          />
        </motion.div>
      )}

      {/* Semi-transparent border for 3D effect */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      />
    </div>
  )
}
