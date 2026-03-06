"use client"

import { motion } from "framer-motion"
import { Sparkles, Check } from "lucide-react"
import { SCRATCH_THEMES, type ScratchThemeId } from "@/constants/scratch-themes"
import { cn } from "@/lib/utils"

interface ThemeSelectorProps {
  selectedTheme: ScratchThemeId
  onSelectTheme: (theme: ScratchThemeId) => void
  showPremiumBadge?: boolean
}

function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: (typeof SCRATCH_THEMES)[number]
  isSelected: boolean
  onSelect: () => void
}) {
  const locked = theme.isLocked

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all text-left w-full",
        isSelected
          ? "border-rose-500 bg-rose-50 shadow-lg ring-2 ring-rose-200"
          : locked
            ? "border-amber-200 hover:border-amber-400 bg-white hover:shadow-md"
            : "border-slate-200 hover:border-rose-300 bg-white hover:shadow-md"
      )}
    >
      {/* Color preview */}
      <div
        className={cn(
          "w-full aspect-[4/3] rounded-lg flex items-center justify-center text-lg font-bold relative overflow-hidden",
          theme.preview.cardBg
        )}
      >
        {/* Pattern overlay simulation */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3)_0%,transparent_70%)]" />
        
        {isSelected ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
          >
            <Check className="w-5 h-5 text-rose-500" />
          </motion.div>
        ) : locked ? (
          <Sparkles className="w-6 h-6 text-white drop-shadow-lg" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm" />
        )}
      </div>

      <span className={cn(
        "text-xs font-semibold leading-tight text-center",
        isSelected ? "text-rose-700" : "text-slate-700"
      )}>
        {theme.name}
      </span>

      {locked && (
        <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 uppercase">
          <Sparkles className="w-2.5 h-2.5" /> Pro
        </span>
      )}

      {isSelected && (
        <motion.div
          layoutId="scratch-theme-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-500"
        />
      )}
    </button>
  )
}

export function ScratchThemeSelector({
  selectedTheme,
  onSelectTheme,
  showPremiumBadge = true,
}: ThemeSelectorProps) {
  const freeThemes = SCRATCH_THEMES.filter((t) => !t.isLocked)
  const premiumThemes = SCRATCH_THEMES.filter((t) => t.isLocked)

  return (
    <div className="flex flex-col gap-4">
      {/* Premium themes section */}
      {showPremiumBadge && premiumThemes.length > 0 && (
        <div className="relative p-4 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/80 to-orange-50/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Premium - Solo $2.99 USD
            </p>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
              Mas elegidos
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {premiumThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isSelected={selectedTheme === theme.id}
                onSelect={() => onSelectTheme(theme.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Free themes section */}
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
          Gratis
        </p>
        <div className="grid grid-cols-3 gap-2">
          {freeThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isSelected={selectedTheme === theme.id}
              onSelect={() => onSelectTheme(theme.id)}
            />
          ))}
        </div>
      </div>

      {/* Selected theme description */}
      <p className="text-xs text-slate-500 text-center">
        {SCRATCH_THEMES.find((t) => t.id === selectedTheme)?.description}
      </p>
    </div>
  )
}
