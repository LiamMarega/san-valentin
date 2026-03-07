"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Check, Crown, Lock } from "lucide-react"
import { SCRATCH_THEMES, type ScratchThemeId } from "@/constants/scratch-themes"
import { cn } from "@/lib/utils"

// =============================================================================
// Premium Theme Selector
// =============================================================================
// Dramatically showcases the difference between Free and Premium themes
// with animated previews, visual hierarchy, and clear value proposition.
// =============================================================================

interface ThemeSelectorProps {
  selectedTheme: ScratchThemeId
  onSelectTheme: (theme: ScratchThemeId) => void
  showPremiumBadge?: boolean
}

// Premium Theme Card with animated preview
function PremiumThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: (typeof SCRATCH_THEMES)[number]
  isSelected: boolean
  onSelect: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-xl border-2 p-2.5 transition-all text-left w-full overflow-hidden",
        isSelected
          ? "border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg ring-2 ring-amber-200/50"
          : "border-amber-200/60 hover:border-amber-300 bg-white hover:shadow-lg"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated preview */}
      <div
        className={cn(
          "w-full aspect-[3/4] rounded-lg flex items-center justify-center relative overflow-hidden",
        )}
        style={{
          background: theme.preview.gradient || theme.preview.cardBg.replace("bg-", ""),
        }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.coverGradient[0]}, ${theme.colors.coverGradient[1]}, ${theme.colors.coverGradient[2]})`,
          }}
        />
        
        {/* Shimmer effect on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Chrome/metallic shine overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
          }}
        />

        {/* Selection state */}
        {isSelected ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative z-10 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center"
          >
            <Check className="w-5 h-5 text-amber-500" />
          </motion.div>
        ) : (
          <div className="relative z-10 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <Crown className="w-4 h-4 text-white drop-shadow" />
          </div>
        )}

        {/* Floating particles animation */}
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/60"
          animate={{
            y: [0, -5, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-3 left-2 w-1.5 h-1.5 rounded-full bg-white/50"
          animate={{
            y: [0, -3, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* Theme name */}
      <span className={cn(
        "text-[11px] font-bold leading-tight text-center truncate w-full",
        isSelected ? "text-amber-700" : "text-slate-700"
      )}>
        {theme.name}
      </span>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          layoutId="premium-theme-indicator"
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-amber-400"
        />
      )}
    </motion.button>
  )
}

// Free Theme Card - Simpler, less flashy
function FreeThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: (typeof SCRATCH_THEMES)[number]
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all text-left w-full",
        isSelected
          ? "border-slate-400 bg-slate-50 shadow-md ring-2 ring-slate-200"
          : "border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm"
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Static preview */}
      <div
        className={cn(
          "w-full aspect-[3/4] rounded-lg flex items-center justify-center relative overflow-hidden",
          theme.preview.cardBg
        )}
      >
        {/* Simple gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/5" />
        
        {isSelected ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative z-10 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-slate-600" />
          </motion.div>
        ) : (
          <div className="relative z-10 w-7 h-7 rounded-full bg-white/30 backdrop-blur-sm" />
        )}
      </div>

      <span className={cn(
        "text-xs font-semibold leading-tight text-center",
        isSelected ? "text-slate-700" : "text-slate-600"
      )}>
        {theme.name}
      </span>

      {/* Free badge */}
      <span className="absolute top-1.5 right-1.5 text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
        GRATIS
      </span>
    </motion.button>
  )
}

export function ScratchThemeSelector({
  selectedTheme,
  onSelectTheme,
  showPremiumBadge = true,
}: ThemeSelectorProps) {
  const freeThemes = SCRATCH_THEMES.filter((t) => t.tier === "free")
  const premiumThemes = SCRATCH_THEMES.filter((t) => t.tier === "premium")
  const selectedThemeData = SCRATCH_THEMES.find((t) => t.id === selectedTheme)

  return (
    <div className="flex flex-col gap-5">
      {/* Premium themes section - Featured prominently */}
      {showPremiumBadge && premiumThemes.length > 0 && (
        <div className="relative">
          {/* Premium section header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-full">
                <Crown className="w-3.5 h-3.5" />
                <span className="text-xs font-bold uppercase tracking-wide">Premium</span>
              </div>
              <span className="text-xs text-slate-500">Efectos exclusivos</span>
            </div>
            <span className="text-sm font-bold text-amber-600">$2.99 USD</span>
          </div>

          {/* Premium themes grid with glowing border */}
          <div 
            className="p-3 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50"
            style={{
              boxShadow: "0 4px 20px -5px rgba(251, 191, 36, 0.3)",
            }}
          >
            <div className="grid grid-cols-5 gap-2">
              {premiumThemes.map((theme) => (
                <PremiumThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedTheme === theme.id}
                  onSelect={() => onSelectTheme(theme.id)}
                />
              ))}
            </div>

            {/* Premium features list */}
            <div className="mt-3 pt-3 border-t border-amber-100 grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
                <Sparkles className="w-3 h-3" />
                <span>Fondos animados</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
                <Sparkles className="w-3 h-3" />
                <span>Efecto cromo metalico</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
                <Sparkles className="w-3 h-3" />
                <span>Brillo al raspar</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
                <Sparkles className="w-3 h-3" />
                <span>Vibracion tactil</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free themes section - Less prominent */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
          <span>Opcion Gratuita</span>
          <span className="flex-1 h-px bg-slate-200" />
        </p>
        <div className="grid grid-cols-3 gap-3">
          {freeThemes.map((theme) => (
            <FreeThemeCard
              key={theme.id}
              theme={theme}
              isSelected={selectedTheme === theme.id}
              onSelect={() => onSelectTheme(theme.id)}
            />
          ))}
        </div>
      </div>

      {/* Selected theme description */}
      <motion.div
        key={selectedTheme}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "text-center p-3 rounded-xl",
          selectedThemeData?.tier === "premium" 
            ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100"
            : "bg-slate-50 border border-slate-100"
        )}
      >
        <p className={cn(
          "text-sm font-medium",
          selectedThemeData?.tier === "premium" ? "text-amber-800" : "text-slate-600"
        )}>
          {selectedThemeData?.name}
        </p>
        <p className={cn(
          "text-xs mt-0.5",
          selectedThemeData?.tier === "premium" ? "text-amber-600" : "text-slate-500"
        )}>
          {selectedThemeData?.description}
        </p>
      </motion.div>
    </div>
  )
}
