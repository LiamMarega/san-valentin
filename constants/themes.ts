// =============================================================================
// Theme Configuration for Digital Gift Platform
// =============================================================================
// Each theme defines its visual identity: colors, fonts, decorative elements,
// and feature-flag locking state. To add a new theme, append to THEMES array.
// =============================================================================

export type ThemeId = "classic" | "editorial" | "midnight" | "scrapbook" | "romantic_pro"

export type RelationshipType = "pareja" | "amigo" | "familia" | "otro"

export interface ThemeConfig {
  id: ThemeId
  name: string
  description: string
  isLocked: boolean
  preview: {
    /** Tailwind background classes for the theme card preview */
    cardBg: string
    /** Accent color class */
    accent: string
  }
  colors: {
    background: string
    card: string
    cardForeground: string
    primary: string
    primaryForeground: string
    secondary: string
    accent: string
    muted: string
    border: string
  }
  fonts: {
    /** Display / heading font class */
    heading: string
    /** Body / paragraph font class */
    body: string
    /** Handwritten / special font class */
    special: string
  }
  /** CSS class applied to the root wrapper to activate theme-specific styles */
  wrapperClass: string
}

// ---------------------------------------------------------------------------
// Feature Flags — control which features are premium-locked
// ---------------------------------------------------------------------------
export interface FeatureFlags {
  uploadPhoto: boolean
  changeMusic: boolean
  /** Themes whose isLocked === true are also gated */
}

export const FEATURE_FLAGS: FeatureFlags = {
  uploadPhoto: true, // locked
  changeMusic: true, // locked
}

// ---------------------------------------------------------------------------
// Relationship options
// ---------------------------------------------------------------------------
export const RELATIONSHIP_OPTIONS: { value: RelationshipType; label: string; emoji: string }[] = [
  { value: "pareja", label: "Pareja", emoji: "💕" },
  { value: "amigo", label: "Amigo/a", emoji: "🤝" },
  { value: "familia", label: "Familia", emoji: "👨‍👩‍👧" },
  { value: "otro", label: "Otro", emoji: "✨" },
]

// ---------------------------------------------------------------------------
// Theme Definitions
// ---------------------------------------------------------------------------
export const THEMES: ThemeConfig[] = [
  // 0. Romantic Pro (Premium Paper Letter)
  {
    id: "romantic_pro",
    name: "Romántico Pro",
    description: "Estética vintage premium con papel texturizado, bordes artesanales y una lluvia de corazones",
    isLocked: true,
    preview: {
      cardBg: "bg-[#FFF9F2]",
      accent: "text-[#C14E4E]",
    },
    colors: {
      background: "#F8EFE4",
      card: "#FFF9F2",
      cardForeground: "#3D2B1F",
      primary: "#C14E4E",
      primaryForeground: "#FFFFFF",
      secondary: "#F4E4E4",
      accent: "#E29595",
      muted: "#D4C3A3",
      border: "#DBC7B5",
    },
    fonts: {
      heading: "font-serif",
      body: "font-sans",
      special: "font-handwritten",
    },
    wrapperClass: "theme-romantic-pro",
  },

  // 1. Clásico Romántico  (design #1 — warm paper letter)
  {
    id: "classic",
    name: "Clásico Romántico",
    description: "Carta elegante sobre papel crema con tipografía manuscrita",
    isLocked: false,
    preview: {
      cardBg: "bg-[#FDFBF7]",
      accent: "text-[#8D5B4C]",
    },
    colors: {
      background: "#F4E4E4",
      card: "#FDFBF7",
      cardForeground: "#2C3E50",
      primary: "#8D5B4C",
      primaryForeground: "#FFFFFF",
      secondary: "#F4E4E4",
      accent: "#D4A5A5",
      muted: "#C5A059",
      border: "#E5D5C5",
    },
    fonts: {
      heading: "font-serif",      // Playfair Display
      body: "font-sans",          // Inter / Lato
      special: "font-handwritten", // Dancing Script / Caveat
    },
    wrapperClass: "theme-classic",
  },

  // 2. Kawaii (design #5 — pastel kawaii with polka dots)
  // NOTE: This ships unlocked as the "second free theme"
  {
    id: "scrapbook",
    name: "Scrapbook Kawaii",
    description: "Estilo cuaderno con garabatos, stickers y colores pastel",
    isLocked: true,
    preview: {
      cardBg: "bg-[#AEC6CF]",
      accent: "text-[#5D54A4]",
    },
    colors: {
      background: "#AEC6CF",
      card: "#FFF9FB",
      cardForeground: "#5D54A4",
      primary: "#5D54A4",
      primaryForeground: "#FFFFFF",
      secondary: "#FFB7C5",
      accent: "#FDFD96",
      muted: "#AEC6CF",
      border: "#FFB7C5",
    },
    fonts: {
      heading: "font-handwritten",  // Caveat
      body: "font-sans",
      special: "font-handwritten",
    },
    wrapperClass: "theme-scrapbook",
  },

  // 3. Editorial Minimalista (design #2 — black/white editorial)
  {
    id: "editorial",
    name: "Editorial Minimalista",
    description: "Diseño limpio con tipografía serif y espacios amplios",
    isLocked: true,
    preview: {
      cardBg: "bg-white",
      accent: "text-[#CC7A6F]",
    },
    colors: {
      background: "#FFFFFF",
      card: "#FAFAFA",
      cardForeground: "#1A1A1A",
      primary: "#CC7A6F",
      primaryForeground: "#FFFFFF",
      secondary: "#FAFAFA",
      accent: "#CC7A6F",
      muted: "#999999",
      border: "#E5E5E5",
    },
    fonts: {
      heading: "font-serif",
      body: "font-sans",
      special: "font-serif italic",
    },
    wrapperClass: "theme-editorial",
  },

  // 4. Medianoche (design #3 — dark plum with neon pink)
  {
    id: "midnight",
    name: "Medianoche",
    description: "Atmósfera nocturna con acentos neón y cristal esmerilado",
    isLocked: true,
    preview: {
      cardBg: "bg-[#1A0B1A]",
      accent: "text-[#FF007F]",
    },
    colors: {
      background: "#1A0B1A",
      card: "rgba(45,20,44,0.25)",
      cardForeground: "#FFFFFF",
      primary: "#FF007F",
      primaryForeground: "#FFFFFF",
      secondary: "#2D142C",
      accent: "#FF69B4",
      muted: "#E0BFB8",
      border: "rgba(255,255,255,0.08)",
    },
    fonts: {
      heading: "font-serif",
      body: "font-sans",
      special: "font-serif italic",
    },
    wrapperClass: "theme-midnight",
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function getThemeById(id: ThemeId): ThemeConfig {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

export function isThemeLocked(id: ThemeId): boolean {
  return getThemeById(id).isLocked
}

export function isFeatureLocked(feature: keyof FeatureFlags): boolean {
  return FEATURE_FLAGS[feature]
}
