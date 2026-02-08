"use client"

import React from "react"
import { motion } from "framer-motion"
import { Heart, Star, Sparkles, Send, Music, ImagePlus, Lock } from "lucide-react"
import type { ThemeId } from "@/constants/themes"
import { getThemeById, isFeatureLocked } from "@/constants/themes"

// =============================================================================
// Props
// =============================================================================
export interface LetterTemplateProps {
  themeId: ThemeId
  senderName: string
  receiverName: string
  messageType: string
  customContent: string
  relationshipType: string
  /** When true the template renders in compact "preview card" mode */
  compact?: boolean
}

// =============================================================================
// Main Component — delegates to per-theme renderer
// =============================================================================
export function LetterTemplate(props: LetterTemplateProps) {
  const theme = getThemeById(props.themeId)

  const renderers: Record<ThemeId, React.FC<LetterTemplateProps>> = {
    classic: ClassicTemplate,
    editorial: EditorialTemplate,
    midnight: MidnightTemplate,
    scrapbook: ScrapbookTemplate,
  }

  const Renderer = renderers[theme.id]

  return (
    <motion.div
      key={theme.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className={`${theme.wrapperClass} w-full`}
    >
      <Renderer {...props} />
    </motion.div>
  )
}

// =============================================================================
// Shared atoms
// =============================================================================
function LockedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
      <Lock className="w-3 h-3" /> Premium
    </span>
  )
}

function PremiumOverlay({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-black/5 backdrop-blur-[1px] cursor-not-allowed">
      <Lock className="w-5 h-5 text-gray-400 mb-1" />
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  )
}

// =============================================================================
// 1. CLÁSICO ROMÁNTICO
// =============================================================================
function ClassicTemplate({
  senderName,
  receiverName,
  messageType,
  customContent,
  compact,
}: LetterTemplateProps) {
  const displayName = receiverName || "Mi Amor"
  const displaySender = senderName || "Tu enamorado/a"
  const displayMessage = messageType || "¿Querés ser mi San Valentín?"
  const displayContent =
    customContent ||
    "Cada día que pasa me doy cuenta de lo afortunado que soy de tenerte en mi vida. Eres mi inspiración, mi alegría y mi paz."

  return (
    <div className={`relative rounded-sm overflow-hidden ${compact ? "scale-[0.6] origin-top-left" : ""}`}>
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

      <div className="relative z-10 bg-[#FDFBF7] p-6 md:p-10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="text-center mb-6">
          <Heart className="w-5 h-5 text-[#D4A5A5] mx-auto mb-2" fill="currentColor" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#8D5B4C] tracking-tight">
            Querido {displayName},
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
            14 de Febrero, {new Date().getFullYear()}
          </p>
        </div>

        {/* Handwritten lines content */}
        <div
          className="font-handwritten text-xl md:text-2xl text-[#2C3E50] leading-[2rem] min-h-[120px]"
          style={{
            backgroundImage: "linear-gradient(transparent 95%, #E5E5E5 95%)",
            backgroundSize: "100% 2rem",
          }}
        >
          {displayContent}
          <br /><br />
          Siempre tuyo,<br />
          {displaySender}
        </div>

        {/* Stamp */}
        <div className="absolute bottom-6 right-6 opacity-60">
          <svg width="60" height="60" viewBox="0 0 100 100" className="fill-[#8D5B4C]/20">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeDasharray="4 2" strokeWidth="1" />
            <text x="50" y="55" textAnchor="middle" fontSize="11" fill="currentColor" fontFamily="serif">
              CON AMOR
            </text>
          </svg>
        </div>

        {/* Question callout */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="mt-6 text-center border-t border-[#E5D5C5] pt-6"
        >
          <p className="font-serif text-2xl md:text-3xl font-bold text-[#8D5B4C]">
            {displayMessage}
          </p>
        </motion.div>

        {/* Photo upload placeholder */}
        <div className="mt-6 relative">
          <div className="bg-white p-3 shadow-md max-w-[200px] mx-auto transform -rotate-2">
            <div className="aspect-[4/5] bg-gray-100 flex flex-col items-center justify-center text-gray-400 gap-1">
              <ImagePlus className="w-8 h-8" />
              <span className="text-xs uppercase tracking-wide">Subir foto</span>
            </div>
            <p className="font-handwritten text-lg text-gray-600 text-center mt-2">
              Nuestro mejor momento ❤️
            </p>
          </div>
          {isFeatureLocked("uploadPhoto") && <PremiumOverlay label="Subir Foto — Premium" />}
        </div>

        {/* Music */}
        <div className="mt-4 relative">
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 py-2 border border-[#E5D5C5] rounded-lg text-sm text-[#8D5B4C] opacity-60"
          >
            <Music className="w-4 h-4" /> Cambiar Música
          </button>
          {isFeatureLocked("changeMusic") && <PremiumOverlay label="Música — Premium" />}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// 2. EDITORIAL MINIMALISTA
// =============================================================================
function EditorialTemplate({
  senderName,
  receiverName,
  messageType,
  customContent,
}: LetterTemplateProps) {
  const displayName = receiverName || "Beloved"
  const displaySender = senderName || "Yours"
  const displayMessage = messageType || "A timeless sentiment"
  const displayContent =
    customContent ||
    "Curate a timeless digital sentiment for your beloved. Simplicity is the ultimate sophistication."

  return (
    <div className="bg-white text-[#1A1A1A] font-sans antialiased">
      {/* Minimal nav */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100">
        <span className="text-[10px] uppercase tracking-[0.2em] font-light text-gray-400">
          Valentine&apos;s Editorial
        </span>
        <div className="flex space-x-8">
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#CC7A6F]">Compose</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center py-10 px-6">
        <h1 className="font-serif font-light text-4xl md:text-5xl tracking-tight text-[#1A1A1A] italic mb-3">
          The Love Note
        </h1>
        <p className="font-sans font-light text-xs text-gray-400 uppercase tracking-[0.2em]">
          For {displayName}
        </p>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 pb-10 items-start">
        {/* Left steps */}
        <div className="md:col-span-4 md:text-right space-y-6">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-[#CC7A6F] font-medium">
              Step 01
            </span>
            <h3 className="font-serif text-xl text-[#1A1A1A]">Visual Narrative</h3>
            <p className="font-sans font-extralight text-xs text-gray-500 leading-relaxed mt-1">
              Minimalism speaks volumes.
            </p>
          </div>
          <div className="hidden md:block w-px h-12 bg-gray-200 ml-auto" />
          <div className="opacity-40">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
              Step 02
            </span>
            <h3 className="font-serif text-xl text-[#1A1A1A]">The Dedication</h3>
          </div>
        </div>

        {/* Center — upload portrait */}
        <div className="md:col-span-4 flex justify-center relative">
          <div className="w-full max-w-[280px] aspect-square bg-[#FAFAFA] border border-gray-200 flex flex-col items-center justify-center relative group">
            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-2 h-2 border-l border-t border-gray-300" />
            <div className="absolute top-3 right-3 w-2 h-2 border-r border-t border-gray-300" />
            <div className="absolute bottom-3 left-3 w-2 h-2 border-l border-b border-gray-300" />
            <div className="absolute bottom-3 right-3 w-2 h-2 border-r border-b border-gray-300" />

            <ImagePlus className="w-8 h-8 text-gray-300 mb-3" />
            <span className="font-serif text-lg text-gray-400 italic">Upload Portrait</span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-gray-300 mt-1">Max 5MB</span>
          </div>
          {isFeatureLocked("uploadPhoto") && <PremiumOverlay label="Upload — Premium" />}
        </div>

        {/* Right — content */}
        <div className="md:col-span-4 space-y-6">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1 font-medium">
              Recipient
            </span>
            <p className="text-lg font-serif text-[#1A1A1A] border-b border-gray-200 pb-1">
              {displayName}
            </p>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1 font-medium">
              Message
            </span>
            <p className="text-sm font-sans font-light text-gray-600 leading-relaxed">
              {displayContent}
            </p>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="font-serif text-xl text-[#1A1A1A] italic">{displayMessage}</p>
            <p className="text-xs text-gray-400 mt-1">— {displaySender}</p>
          </div>
        </div>
      </div>

      {/* Footer quote */}
      <div className="py-6 text-center border-t border-gray-100">
        <p className="font-serif italic text-gray-300 text-sm">
          &ldquo;Simplicity is the ultimate sophistication.&rdquo;
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// 3. MEDIANOCHE
// =============================================================================
function MidnightTemplate({
  senderName,
  receiverName,
  messageType,
  customContent,
}: LetterTemplateProps) {
  const displayName = receiverName || "Mi Amor"
  const displaySender = senderName || "Tu enamorado/a"
  const displayMessage = messageType || "¿Querés ser mi San Valentín?"
  const displayContent =
    customContent ||
    "Cada estrella me recuerda el brillo de tus ojos. Este espacio es un pequeño rincón de nuestro universo compartido."

  return (
    <div
      className="relative rounded-2xl overflow-hidden text-white"
      style={{
        background: "#1A0B1A",
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(45,20,44,0.8) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(61,28,59,0.8) 0%, transparent 40%)",
      }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF007F]/10 rounded-full blur-[80px] animate-float pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[80px] animate-float pointer-events-none" style={{ animationDelay: "2s" }} />

      {/* Sparkle particles */}
      <div className="absolute top-[20%] right-[20%] text-[#E0BFB8] opacity-20 animate-pulse text-xs pointer-events-none">✦</div>
      <div className="absolute bottom-[30%] left-[10%] text-[#E0BFB8] opacity-20 animate-pulse text-xl pointer-events-none" style={{ animationDelay: "1.5s" }}>✦</div>

      {/* Glass card */}
      <div
        className="relative z-10 m-4 md:m-8 rounded-xl p-6 md:p-10"
        style={{
          background: "rgba(45,20,44,0.25)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5)",
        }}
      >
        {/* Nav */}
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#FF007F] animate-pulse" fill="currentColor" />
            <span className="text-[#E0BFB8] text-xs uppercase tracking-widest font-medium opacity-80">
              Midnight Romance
            </span>
          </div>
        </div>

        {/* Badge */}
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1 rounded-full border border-[#FF007F]/30 bg-[#FF007F]/10 text-[#FF007F] text-xs tracking-[0.2em] uppercase font-bold"
            style={{ boxShadow: "0 0 10px rgba(255,0,127,0.3)" }}
          >
            Para Ti, {displayName}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-serif font-medium text-3xl md:text-5xl text-center mb-4 leading-tight tracking-tight"
          style={{ textShadow: "0 0 10px rgba(255,0,127,0.3)" }}
        >
          En la quietud de<br />
          <span className="italic text-[#E0BFB8] font-light">esta noche...</span>
        </h1>

        {/* Content */}
        <p className="text-center text-gray-300 font-sans font-light text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-8">
          {displayContent}
        </p>

        {/* Photo grid */}
        <div className="relative grid grid-cols-3 gap-3 p-3 rounded-xl border border-white/5 bg-white/5 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`aspect-[3/4] rounded-lg overflow-hidden bg-[#2D142C] flex items-center justify-center ${
                i === 1 ? "border border-white/20 scale-105 z-10 shadow-[0_0_10px_rgba(255,0,127,0.5)]" : ""
              }`}
            >
              <ImagePlus className="w-6 h-6 text-white/30" />
            </div>
          ))}
          {isFeatureLocked("uploadPhoto") && <PremiumOverlay label="Fotos — Premium" />}
        </div>

        {/* Question */}
        <div className="text-center mb-6">
          <p className="font-serif text-2xl md:text-3xl text-white" style={{ textShadow: "0 0 10px rgba(255,0,127,0.3)" }}>
            {displayMessage}
          </p>
          <p className="text-xs text-[#E0BFB8] mt-2">— {displaySender}</p>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <div className="relative px-8 py-3 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF007F] to-purple-600 opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF007F] to-purple-600 blur-lg opacity-40" />
            <span className="relative flex items-center gap-2 text-white font-bold tracking-widest text-xs uppercase z-10">
              <Heart className="w-4 h-4" /> Abrir Mi Carta
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-white/5 bg-black/20">
        <p className="text-xs text-white/40 tracking-wider flex items-center justify-center gap-1">
          HECHO CON <Heart className="w-3 h-3 text-[#FF007F] animate-pulse" fill="currentColor" /> BAJO LA LUNA
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// 4. SCRAPBOOK KAWAII
// =============================================================================
function ScrapbookTemplate({
  senderName,
  receiverName,
  messageType,
  customContent,
}: LetterTemplateProps) {
  const displayName = receiverName || "Juan"
  const displaySender = senderName || "Tu enamorado/a"
  const displayMessage = messageType || "¿Querés ser mi San Valentín?"
  const displayContent = customContent || `${displayName} va a estar muy feliz (≧◡≦)`

  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#AEC6CF",
        backgroundImage:
          "radial-gradient(#FFB7C5 20%, transparent 20%), radial-gradient(#ffffff 20%, transparent 20%)",
        backgroundSize: "50px 50px",
        backgroundPosition: "0 0, 25px 25px",
      }}
    >
      {/* Floating clouds */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 left-4 text-white/80 pointer-events-none"
      >
        <svg width="80" height="50" viewBox="0 0 80 50" fill="currentColor">
          <ellipse cx="40" cy="30" rx="35" ry="18" />
          <ellipse cx="20" cy="22" rx="18" ry="14" />
          <ellipse cx="55" cy="20" rx="20" ry="12" />
        </svg>
      </motion.div>

      {/* Main card */}
      <div className="relative z-10 m-4 md:m-8 bg-[#FFF9FB] rounded-[40px] border-4 border-[#FFB7C5] shadow-[0_10px_0_0_rgba(93,84,164,0.1)] p-6 md:p-10">
        {/* Kawaii bear */}
        <div className="flex justify-center -mt-16 mb-4">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <svg width="80" height="80" viewBox="0 0 100 100">
              <circle cx="50" cy="60" r="40" fill="#FFF" stroke="#5D54A4" strokeWidth="3" />
              <circle cx="20" cy="30" r="15" fill="#FFF" stroke="#5D54A4" strokeWidth="3" />
              <circle cx="80" cy="30" r="15" fill="#FFF" stroke="#5D54A4" strokeWidth="3" />
              <circle cx="20" cy="30" r="8" fill="#FFB7C5" />
              <circle cx="80" cy="30" r="8" fill="#FFB7C5" />
              <circle cx="50" cy="60" r="39" fill="#FFF" stroke="none" />
              <circle cx="35" cy="55" r="4" fill="#333" />
              <circle cx="65" cy="55" r="4" fill="#333" />
              <circle cx="25" cy="65" r="5" fill="#FFB7C5" opacity="0.6" />
              <circle cx="75" cy="65" r="5" fill="#FFB7C5" opacity="0.6" />
              <path d="M45 65 Q50 70 55 65" fill="none" stroke="#333" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </motion.div>
        </div>

        {/* Nav */}
        <div className="flex justify-between items-center mb-6">
          <Heart className="w-6 h-6 text-[#FFB7C5] animate-pulse" fill="currentColor" />
          <div className="flex space-x-3 bg-white/80 py-1.5 px-4 rounded-full border-2 border-[#AEC6CF]/30 text-sm">
            <span className="text-[#5D54A4] font-bold">Inicio</span>
            <span className="text-[#5D54A4]">Galería</span>
            <span className="text-[#5D54A4]">Mensajes</span>
          </div>
        </div>

        {/* Badge */}
        <div className="text-center mb-4">
          <span className="inline-block bg-gradient-to-r from-[#AEC6CF] to-purple-300 text-white px-6 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs shadow-md transform rotate-2">
            <Sparkles className="w-3 h-3 inline mr-1" /> ¡Es oficial! <Sparkles className="w-3 h-3 inline ml-1" />
          </span>
        </div>

        {/* Title */}
        <h1 className="font-handwritten font-bold text-4xl md:text-5xl text-[#5D54A4] text-center mb-2 leading-tight">
          💖 ¡Sabía que dirías<br />que sí!
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-500 text-base md:text-lg mb-6 bg-white/50 py-1 px-4 rounded-full inline-block mx-auto w-fit">
          {displayContent}
        </p>

        {/* Celebration icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Wings */}
            <div className="absolute top-2 -left-10 opacity-80">
              <svg fill="#FFF" height="50" stroke="#AEC6CF" strokeWidth="2" viewBox="0 0 100 100" width="50">
                <path d="M90 50 Q70 20 40 40 Q10 10 10 50 Q10 90 40 80 Q70 90 90 50 Z" />
              </svg>
            </div>
            <div className="absolute top-2 -right-10 opacity-80 scale-x-[-1]">
              <svg fill="#FFF" height="50" stroke="#AEC6CF" strokeWidth="2" viewBox="0 0 100 100" width="50">
                <path d="M90 50 Q70 20 40 40 Q10 10 10 50 Q10 90 40 80 Q70 90 90 50 Z" />
              </svg>
            </div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 bg-[#FFB7C5] rounded-full flex items-center justify-center shadow-[0_8px_0_0_#F19C98] border-4 border-white"
            >
              <Send className="w-12 h-12 text-white" />
            </motion.div>
            <div className="absolute -bottom-1 -right-3 bg-white rounded-full p-0.5 border-2 border-[#FDFD96] shadow-sm">
              <Star className="w-5 h-5 text-[#FDFD96]" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-6">
          <p className="font-handwritten text-2xl text-[#5D54A4] font-bold">{displayMessage}</p>
          <p className="text-xs text-gray-400 mt-1">— {displaySender}</p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button className="bg-[#5D54A4] hover:bg-[#4a4282] text-white font-bold py-3 px-8 rounded-3xl shadow-[0_6px_0_0_#3e376e] active:shadow-none active:translate-y-[6px] transition-all flex items-center gap-2 text-base border-2 border-white">
            <Send className="w-4 h-4" />
            Enviar Mensaje a {displayName}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-[#FFB7C5]/30">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-[#FFB7C5] animate-pulse" fill="currentColor" /> para San Valentín
          </p>
          {/* Rainbow bar */}
          <div className="h-1 mt-3 bg-gradient-to-r from-[#FFB7C5] via-[#FDFD96] to-[#AEC6CF] rounded-full" />
        </div>
      </div>
    </div>
  )
}
