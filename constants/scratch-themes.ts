// =============================================================================
// Scratch Card Theme Configuration - FREEMIUM MODEL
// =============================================================================
// Premium themes feature: dynamic backgrounds, SVG overlays, breathing effects,
// and metallic chrome finishes. Free theme is clean and functional.
// =============================================================================

export type ScratchThemeId = 
  | "basico"           // FREE - Clean, simple
  | "aurora"           // PREMIUM - Northern lights animation
  | "galaxia"          // PREMIUM - Cosmic particles
  | "rosas"            // PREMIUM - Floating rose petals
  | "fuego"            // PREMIUM - Warm flame effect
  | "diamante"         // PREMIUM - Luxury diamond sparkle

export type ThemeTier = "free" | "premium"

export interface ScratchThemeConfig {
  id: ScratchThemeId
  name: string
  description: string
  tier: ThemeTier
  price: number // 0 for free
  preview: {
    cardBg: string
    accent: string
    gradient?: string
  }
  colors: {
    coverGradient: [string, string, string] // Three stops for chrome effect
    particles: string[]
    background: string
    card: string
    text: string
    primary: string
    secondary: string
    glow: string // For breathing/glow effects
  }
  // Premium features
  animation?: {
    type: "aurora" | "particles" | "petals" | "flames" | "sparkle" | "none"
    speed: "slow" | "medium" | "fast"
    intensity: number // 0-1
  }
  // Chrome/metallic scratch surface
  chrome: {
    enabled: boolean
    highlights: [string, string, string, string] // Gradient stops for metallic look
    angle: number // Gradient angle in degrees
    shimmer: boolean // Animated shimmer effect
  }
  // SVG overlay pattern
  svgOverlay?: string
  // Scratch brush style
  brushStyle: "soft" | "sparkle" | "hearts" | "stars"
}

// ---------------------------------------------------------------------------
// Premium SVG Overlays - High-quality vector decorations
// ---------------------------------------------------------------------------
const SVG_OVERLAYS = {
  ornate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 5C25 5 5 25 5 50s20 45 45 45 45-20 45-45S75 5 50 5zm0 80c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="50" r="25" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/></svg>`,
  diamonds: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M30 5l8 25-8 25-8-25z" fill="rgba(255,255,255,0.06)"/><path d="M5 30l25-8 25 8-25 8z" fill="rgba(255,255,255,0.04)"/></svg>`,
  hearts: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M30 50s-15-10-15-20c0-5 4-10 10-10 3 0 5 2 5 2s2-2 5-2c6 0 10 5 10 10 0 10-15 20-15 20z" fill="rgba(255,255,255,0.08)"/></svg>`,
  stars: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M30 5l4 12h13l-10 8 4 12-11-8-11 8 4-12-10-8h13z" fill="rgba(255,255,255,0.07)"/></svg>`,
  roses: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><circle cx="40" cy="40" r="8" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="28" r="6" fill="rgba(255,255,255,0.07)"/><circle cx="40" cy="52" r="6" fill="rgba(255,255,255,0.07)"/><circle cx="28" cy="40" r="6" fill="rgba(255,255,255,0.07)"/><circle cx="52" cy="40" r="6" fill="rgba(255,255,255,0.07)"/><circle cx="30" cy="30" r="5" fill="rgba(255,255,255,0.05)"/><circle cx="50" cy="30" r="5" fill="rgba(255,255,255,0.05)"/><circle cx="30" cy="50" r="5" fill="rgba(255,255,255,0.05)"/><circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.05)"/></svg>`,
}

// ---------------------------------------------------------------------------
// Scratch Theme Definitions
// ---------------------------------------------------------------------------
export const SCRATCH_THEMES: ScratchThemeConfig[] = [
  // ===========================================================================
  // FREE THEME - Clean, functional, but basic
  // ===========================================================================
  {
    id: "basico",
    name: "Basico",
    description: "Simple y elegante - perfecto para empezar",
    tier: "free",
    price: 0,
    preview: {
      cardBg: "bg-gradient-to-br from-slate-400 to-slate-500",
      accent: "text-slate-100",
    },
    colors: {
      coverGradient: ["#94A3B8", "#64748B", "#475569"],
      particles: ["#F1F5F9", "#E2E8F0", "#CBD5E1", "#FFFFFF"],
      background: "#F8FAFC",
      card: "#FFFFFF",
      text: "#1E293B",
      primary: "#475569",
      secondary: "#E2E8F0",
      glow: "#94A3B8",
    },
    animation: {
      type: "none",
      speed: "slow",
      intensity: 0,
    },
    chrome: {
      enabled: false,
      highlights: ["#CBD5E1", "#94A3B8", "#64748B", "#475569"],
      angle: 135,
      shimmer: false,
    },
    brushStyle: "soft",
  },

  // ===========================================================================
  // PREMIUM THEMES - The "100x" Visual Improvement
  // ===========================================================================

  // Aurora Borealis - Flowing northern lights
  {
    id: "aurora",
    name: "Aurora Boreal",
    description: "Luces del norte danzando en el cielo artico",
    tier: "premium",
    price: 2.99,
    preview: {
      cardBg: "bg-gradient-to-br from-emerald-400 via-cyan-500 to-purple-600",
      accent: "text-emerald-100",
      gradient: "linear-gradient(135deg, #10B981, #06B6D4, #8B5CF6)",
    },
    colors: {
      coverGradient: ["#10B981", "#06B6D4", "#8B5CF6"],
      particles: ["#A7F3D0", "#67E8F9", "#C4B5FD", "#FFFFFF"],
      background: "#0F172A",
      card: "#1E293B",
      text: "#F0FDF4",
      primary: "#34D399",
      secondary: "#164E63",
      glow: "#06B6D4",
    },
    animation: {
      type: "aurora",
      speed: "slow",
      intensity: 0.8,
    },
    chrome: {
      enabled: true,
      highlights: ["#FFFFFF", "#A7F3D0", "#06B6D4", "#8B5CF6"],
      angle: 45,
      shimmer: true,
    },
    svgOverlay: SVG_OVERLAYS.ornate,
    brushStyle: "sparkle",
  },

  // Galaxia Cosmica - Space particles and nebulae
  {
    id: "galaxia",
    name: "Galaxia Cosmica",
    description: "Viaja por las estrellas y nebulosas del universo",
    tier: "premium",
    price: 2.99,
    preview: {
      cardBg: "bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600",
      accent: "text-indigo-200",
      gradient: "linear-gradient(135deg, #4F46E5, #7C3AED, #DB2777)",
    },
    colors: {
      coverGradient: ["#4F46E5", "#7C3AED", "#DB2777"],
      particles: ["#C7D2FE", "#DDD6FE", "#FBCFE8", "#FFFFFF"],
      background: "#0C0A1D",
      card: "#1E1B4B",
      text: "#E0E7FF",
      primary: "#A78BFA",
      secondary: "#312E81",
      glow: "#8B5CF6",
    },
    animation: {
      type: "particles",
      speed: "slow",
      intensity: 0.9,
    },
    chrome: {
      enabled: true,
      highlights: ["#FFFFFF", "#C7D2FE", "#A78BFA", "#7C3AED"],
      angle: 45,
      shimmer: true,
    },
    svgOverlay: SVG_OVERLAYS.stars,
    brushStyle: "sparkle",
  },

  // Rosas de Amor - Floating rose petals
  {
    id: "rosas",
    name: "Rosas de Amor",
    description: "Petalos de rosa cayendo en un jardin romantico",
    tier: "premium",
    price: 2.99,
    preview: {
      cardBg: "bg-gradient-to-br from-rose-400 via-pink-500 to-red-500",
      accent: "text-rose-100",
      gradient: "linear-gradient(135deg, #FB7185, #EC4899, #EF4444)",
    },
    colors: {
      coverGradient: ["#FB7185", "#EC4899", "#EF4444"],
      particles: ["#FECDD3", "#FBCFE8", "#FEE2E2", "#FFFFFF"],
      background: "#FFF1F2",
      card: "#FFFFFF",
      text: "#881337",
      primary: "#E11D48",
      secondary: "#FCE7F3",
      glow: "#F43F5E",
    },
    animation: {
      type: "petals",
      speed: "medium",
      intensity: 0.7,
    },
    chrome: {
      enabled: true,
      highlights: ["#FFFFFF", "#FECDD3", "#FB7185", "#E11D48"],
      angle: 45,
      shimmer: true,
    },
    svgOverlay: SVG_OVERLAYS.roses,
    brushStyle: "hearts",
  },

  // Fuego Pasion - Warm flame effect
  {
    id: "fuego",
    name: "Fuego y Pasion",
    description: "Llamas ardientes que representan el amor eterno",
    tier: "premium",
    price: 2.99,
    preview: {
      cardBg: "bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500",
      accent: "text-orange-100",
      gradient: "linear-gradient(135deg, #F97316, #EF4444, #EAB308)",
    },
    colors: {
      coverGradient: ["#F97316", "#EF4444", "#EAB308"],
      particles: ["#FED7AA", "#FECACA", "#FEF08A", "#FFFFFF"],
      background: "#1C1917",
      card: "#292524",
      text: "#FEF3C7",
      primary: "#F97316",
      secondary: "#44403C",
      glow: "#EA580C",
    },
    animation: {
      type: "flames",
      speed: "medium",
      intensity: 0.8,
    },
    chrome: {
      enabled: true,
      highlights: ["#FFFFFF", "#FED7AA", "#F97316", "#EA580C"],
      angle: 45,
      shimmer: true,
    },
    svgOverlay: SVG_OVERLAYS.diamonds,
    brushStyle: "sparkle",
  },

  // Diamante Lujo - Luxury diamond sparkle
  {
    id: "diamante",
    name: "Diamante de Lujo",
    description: "Brillo y elegancia dignos de la realeza",
    tier: "premium",
    price: 2.99,
    preview: {
      cardBg: "bg-gradient-to-br from-slate-200 via-white to-slate-300",
      accent: "text-slate-700",
      gradient: "linear-gradient(135deg, #E2E8F0, #FFFFFF, #CBD5E1)",
    },
    colors: {
      coverGradient: ["#E2E8F0", "#FFFFFF", "#CBD5E1"],
      particles: ["#FFFFFF", "#F1F5F9", "#E2E8F0", "#94A3B8"],
      background: "#0F172A",
      card: "#1E293B",
      text: "#F1F5F9",
      primary: "#94A3B8",
      secondary: "#334155",
      glow: "#F1F5F9",
    },
    animation: {
      type: "sparkle",
      speed: "fast",
      intensity: 1,
    },
    chrome: {
      enabled: true,
      highlights: ["#FFFFFF", "#F8FAFC", "#E2E8F0", "#94A3B8"],
      angle: 45,
      shimmer: true,
    },
    svgOverlay: SVG_OVERLAYS.diamonds,
    brushStyle: "sparkle",
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function getScratchThemeById(id: ScratchThemeId): ScratchThemeConfig {
  return SCRATCH_THEMES.find((t) => t.id === id) ?? SCRATCH_THEMES[0]
}

export function isScratchThemeLocked(id: ScratchThemeId): boolean {
  return getScratchThemeById(id).tier === "premium"
}

export function getFreeScratchThemes(): ScratchThemeConfig[] {
  return SCRATCH_THEMES.filter((t) => t.tier === "free")
}

export function getPremiumScratchThemes(): ScratchThemeConfig[] {
  return SCRATCH_THEMES.filter((t) => t.tier === "premium")
}

export function getScratchThemePrice(id: ScratchThemeId): number {
  return getScratchThemeById(id).price
}
