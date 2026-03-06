// =============================================================================
// Scratch Card Theme Configuration
// =============================================================================
// Each theme defines the visual identity for scratch cards: colors, patterns,
// and effects. Follows the same pattern as the letter themes.
// =============================================================================

export type ScratchThemeId = 
  | "corazones" 
  | "estrellas" 
  | "flores" 
  | "galaxia" 
  | "vintage" 
  | "minimalista"

export interface ScratchThemeConfig {
  id: ScratchThemeId
  name: string
  description: string
  isLocked: boolean
  preview: {
    /** Tailwind background classes for theme card preview */
    cardBg: string
    /** Accent color class */
    accent: string
  }
  colors: {
    /** Cover layer gradient colors */
    coverGradient: [string, string]
    /** Particle/confetti colors */
    particles: string[]
    /** Background color */
    background: string
    /** Card background */
    card: string
    /** Text color */
    text: string
    /** Primary accent */
    primary: string
    /** Secondary accent */
    secondary: string
  }
  /** Pattern SVG or CSS pattern for the scratch cover */
  coverPattern: string
  /** Brush texture style */
  brushStyle: 'soft' | 'sparkle' | 'hearts'
}

// ---------------------------------------------------------------------------
// Scratch Theme Definitions
// ---------------------------------------------------------------------------
export const SCRATCH_THEMES: ScratchThemeConfig[] = [
  // 1. Corazones (Hearts) - Default free theme
  {
    id: "corazones",
    name: "Corazones",
    description: "Lluvia de corazones sobre un fondo rosa cálido",
    isLocked: false,
    preview: {
      cardBg: "bg-gradient-to-br from-rose-400 to-pink-500",
      accent: "text-rose-100",
    },
    colors: {
      coverGradient: ["#FB7185", "#EC4899"],
      particles: ["#FCA5A5", "#FECDD3", "#FFF1F2", "#FB7185"],
      background: "#FFF1F2",
      card: "#FFFFFF",
      text: "#881337",
      primary: "#E11D48",
      secondary: "#FECDD3",
    },
    coverPattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 35c-2.5-2.5-6.5-2.5-9 0s-2.5 6.5 0 9c2.5 2.5 9 7 9 7s6.5-4.5 9-7c2.5-2.5 2.5-6.5 0-9s-6.5-2.5-9 0' fill='%23ffffff20' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    brushStyle: 'hearts',
  },

  // 2. Estrellas (Stars)
  {
    id: "estrellas",
    name: "Estrellas",
    description: "Estrellas brillantes en un cielo dorado",
    isLocked: false,
    preview: {
      cardBg: "bg-gradient-to-br from-amber-400 to-orange-500",
      accent: "text-amber-100",
    },
    colors: {
      coverGradient: ["#FBBF24", "#F97316"],
      particles: ["#FEF3C7", "#FDE68A", "#FBBF24", "#FFFFFF"],
      background: "#FFFBEB",
      card: "#FFFFFF",
      text: "#78350F",
      primary: "#D97706",
      secondary: "#FDE68A",
    },
    coverPattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5l3.09 9.51h10l-8.09 5.88 3.09 9.51L30 24l-8.09 5.9 3.09-9.51-8.09-5.88h10L30 5z' fill='%23ffffff25' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    brushStyle: 'sparkle',
  },

  // 3. Flores (Flowers)
  {
    id: "flores",
    name: "Flores",
    description: "Jardín de flores en tonos lavanda y rosa",
    isLocked: true,
    preview: {
      cardBg: "bg-gradient-to-br from-purple-400 to-pink-400",
      accent: "text-purple-100",
    },
    colors: {
      coverGradient: ["#A78BFA", "#F472B6"],
      particles: ["#DDD6FE", "#FBCFE8", "#F5D0FE", "#FFFFFF"],
      background: "#FAF5FF",
      card: "#FFFFFF",
      text: "#581C87",
      primary: "#9333EA",
      secondary: "#F5D0FE",
    },
    coverPattern: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='8' fill='%23ffffff20'/%3E%3Ccircle cx='40' cy='25' r='6' fill='%23ffffff15'/%3E%3Ccircle cx='40' cy='55' r='6' fill='%23ffffff15'/%3E%3Ccircle cx='25' cy='40' r='6' fill='%23ffffff15'/%3E%3Ccircle cx='55' cy='40' r='6' fill='%23ffffff15'/%3E%3C/svg%3E")`,
    brushStyle: 'soft',
  },

  // 4. Galaxia (Galaxy/Cosmic)
  {
    id: "galaxia",
    name: "Galaxia",
    description: "Amor cósmico entre estrellas y nebulosas",
    isLocked: true,
    preview: {
      cardBg: "bg-gradient-to-br from-indigo-600 to-purple-800",
      accent: "text-indigo-200",
    },
    colors: {
      coverGradient: ["#4F46E5", "#7C3AED"],
      particles: ["#C7D2FE", "#A5B4FC", "#818CF8", "#FFFFFF"],
      background: "#1E1B4B",
      card: "#312E81",
      text: "#E0E7FF",
      primary: "#818CF8",
      secondary: "#4338CA",
    },
    coverPattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%23ffffff40'/%3E%3Ccircle cx='80' cy='30' r='1' fill='%23ffffff30'/%3E%3Ccircle cx='50' cy='70' r='2' fill='%23ffffff50'/%3E%3Ccircle cx='30' cy='80' r='1' fill='%23ffffff25'/%3E%3Ccircle cx='70' cy='60' r='1.5' fill='%23ffffff35'/%3E%3Ccircle cx='10' cy='50' r='1' fill='%23ffffff20'/%3E%3Ccircle cx='90' cy='90' r='1.5' fill='%23ffffff30'/%3E%3C/svg%3E")`,
    brushStyle: 'sparkle',
  },

  // 5. Vintage
  {
    id: "vintage",
    name: "Vintage",
    description: "Estilo clásico con tonos sepia y elegancia atemporal",
    isLocked: true,
    preview: {
      cardBg: "bg-gradient-to-br from-amber-200 to-orange-300",
      accent: "text-amber-800",
    },
    colors: {
      coverGradient: ["#D4A574", "#C9956C"],
      particles: ["#FEF3C7", "#F5E6D3", "#E8D5C4", "#FFFFFF"],
      background: "#FEF7ED",
      card: "#FFFBF5",
      text: "#78350F",
      primary: "#B45309",
      secondary: "#FDE68A",
    },
    coverPattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0V0zm30 30v30h30V30H30zm0-30v30h30V0H30zM0 30v30h30V30H0zM0 0v30h30V0H0z' fill='none' stroke='%23ffffff10' stroke-width='1'/%3E%3C/svg%3E")`,
    brushStyle: 'soft',
  },

  // 6. Minimalista
  {
    id: "minimalista",
    name: "Minimalista",
    description: "Diseño limpio y moderno con elegancia simple",
    isLocked: false,
    preview: {
      cardBg: "bg-gradient-to-br from-slate-400 to-slate-600",
      accent: "text-slate-100",
    },
    colors: {
      coverGradient: ["#64748B", "#475569"],
      particles: ["#F1F5F9", "#E2E8F0", "#CBD5E1", "#FFFFFF"],
      background: "#F8FAFC",
      card: "#FFFFFF",
      text: "#1E293B",
      primary: "#475569",
      secondary: "#E2E8F0",
    },
    coverPattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23ffffff08' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
    brushStyle: 'soft',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function getScratchThemeById(id: ScratchThemeId): ScratchThemeConfig {
  return SCRATCH_THEMES.find((t) => t.id === id) ?? SCRATCH_THEMES[0]
}

export function isScratchThemeLocked(id: ScratchThemeId): boolean {
  return getScratchThemeById(id).isLocked
}

export function getFreeScratchThemes(): ScratchThemeConfig[] {
  return SCRATCH_THEMES.filter((t) => !t.isLocked)
}

export function getPremiumScratchThemes(): ScratchThemeConfig[] {
  return SCRATCH_THEMES.filter((t) => t.isLocked)
}
