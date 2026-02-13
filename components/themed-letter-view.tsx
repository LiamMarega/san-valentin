"use client"

import React from "react"
import { motion } from "framer-motion"
import { Heart, Sparkles, Star, Send, Music, Pause } from "lucide-react"
import type { LetterData } from "@/lib/types"
import type { ThemeId } from "@/constants/themes"
import { getThemeById } from "@/constants/themes"
import { LetterButtons } from "@/components/letter-buttons"

// =============================================================================
// Props
// =============================================================================
interface ThemedLetterViewProps {
  letter: LetterData
}

// =============================================================================
// Main — delegates to per-theme renderer
// =============================================================================
export function ThemedLetterView({ letter }: ThemedLetterViewProps) {
  const themeId = (letter.theme || "classic") as ThemeId
  const theme = getThemeById(themeId)

  const renderers: Record<ThemeId, React.FC<ThemedLetterViewProps>> = {
    classic: ClassicLetterView,
    scrapbook: ScrapbookLetterView,
    editorial: EditorialLetterView,
    midnight: MidnightLetterView,
    romantic_pro: RomanticProLetterView,
  }

  const Renderer = renderers[theme.id] ?? ClassicLetterView

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${theme.wrapperClass} w-full`}
    >
      <Renderer letter={letter} />
      {/* Background music */}
      {letter.music_url && <MusicPlayer src={letter.music_url} />}
    </motion.div>
  )
}

// =============================================================================
// Music Player (floating)
// =============================================================================
function MusicPlayer({ src }: { src: string }) {
  const [playing, setPlaying] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement>(null)

  function toggle() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop />
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 flex items-center justify-center hover:scale-110 transition-transform"
        aria-label={playing ? "Pausar música" : "Reproducir música"}
      >
        {playing ? (
          <Pause className="w-5 h-5 text-gray-700" />
        ) : (
          <Music className="w-5 h-5 text-gray-700" />
        )}
      </button>
    </>
  )
}

// =============================================================================
// Shared: question display helper
// =============================================================================
function QuestionDisplay({
  messageType,
  className = "",
  accentClass = "text-primary italic",
}: {
  messageType: string
  className?: string
  accentClass?: string
}) {
  if (messageType.startsWith("Queres")) {
    return (
      <h2 className={className}>
        {"Queres ser mi"}
        <br />
        <span className={accentClass}>
          {messageType.includes("Valentin") ? "San Valentin?" : "novia?"}
        </span>
      </h2>
    )
  }
  return <h2 className={`${className} ${accentClass}`}>{messageType}</h2>
}

// =============================================================================
// 1. CLÁSICO ROMÁNTICO
// =============================================================================
function ClassicLetterView({ letter }: ThemedLetterViewProps) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#F4E4E4" }}>
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-64 h-64 pointer-events-none opacity-30">
        <svg className="w-full h-full fill-[#D4A5A5]" viewBox="0 0 200 200">
          <path d="M45.7,-76.4C58.9,-69.3,69.1,-55.6,76.3,-41.3C83.5,-26.9,87.6,-11.9,85.2,1.9C82.8,15.7,73.9,28.3,63.6,38.9C53.3,49.5,41.6,58.1,29.1,64.2C16.6,70.3,3.3,73.9,-8.9,71.2C-21.1,68.5,-32.2,59.5,-43.3,50.1C-54.4,40.7,-65.5,30.9,-71.3,18.4C-77.1,5.9,-77.6,-9.3,-71.4,-21.8C-65.2,-34.3,-52.3,-44.1,-39.8,-51.5C-27.3,-58.9,-15.2,-63.9,0.5,-64.7C16.2,-65.5,32.4,-62.1,45.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Letter paper */}
          <div className="flex-1 relative bg-[#FDFBF7] rounded-sm shadow-paper p-8 md:p-12 transform lg:rotate-1">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 pointer-events-none rounded-sm" />

            <div className="relative z-10 text-center mb-8">
              <Heart className="w-6 h-6 text-[#D4A5A5] mx-auto mb-2" fill="currentColor" />
              <h1 className="font-serif font-bold text-3xl md:text-4xl text-[#8D5B4C] tracking-tight">
                Hola, {letter.receiver_name}
              </h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                14 de Febrero, {new Date().getFullYear()}
              </p>
            </div>

            <div className="relative z-10">
              <p className="text-[#8D5B4C]/60 uppercase tracking-wider text-sm mb-6 text-center">
                {letter.sender_name} tiene algo importante que preguntarte...
              </p>

              {/* Custom content */}
              {letter.custom_content && (
                <div
                  className="font-handwritten text-xl md:text-2xl text-[#2C3E50] leading-[2rem] mb-8"
                  style={{
                    backgroundImage: "linear-gradient(transparent 95%, #E5E5E5 95%)",
                    backgroundSize: "100% 2rem",
                  }}
                >
                  {letter.custom_content}
                  <br /><br />
                  Siempre tuyo,<br />
                  {letter.sender_name}
                </div>
              )}

              {/* Question */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-10"
              >
                <QuestionDisplay
                  messageType={letter.message_type}
                  className="font-serif text-4xl md:text-6xl font-bold text-[#2C3E50] leading-tight text-center"
                  accentClass="text-[#8D5B4C] italic underline decoration-[#D4A5A5] decoration-2 underline-offset-8"
                />
              </motion.div>

              {/* Buttons */}
              <div className="text-center">
                <LetterButtons letterId={letter.id} themeId="classic" />
              </div>
            </div>

            {/* Stamp */}
            <div className="absolute bottom-6 right-6 opacity-50">
              <svg width="60" height="60" viewBox="0 0 100 100" className="fill-[#8D5B4C]/20">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeDasharray="4 2" strokeWidth="1" />
                <text x="50" y="55" textAnchor="middle" fontSize="11" fill="currentColor" fontFamily="serif">CON AMOR</text>
              </svg>
            </div>
          </div>

          {/* Photo polaroid (if uploaded) */}
          {letter.photo_url && (
            <div className="relative bg-white p-4 pb-16 shadow-lg transform -rotate-2 max-w-[250px] mx-auto lg:mx-0">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-14 z-20">
                <svg className="w-full h-full drop-shadow-md" viewBox="0 0 50 100">
                  <path d="M15,10 L15,70 C15,85 35,85 35,70 L35,20 C35,10 20,10 20,20 L20,60" fill="none" stroke="#C5A059" strokeLinecap="round" strokeWidth="4" />
                </svg>
              </div>
              <div className="aspect-[4/5] overflow-hidden">
                <img src={letter.photo_url} alt="Momento especial" className="w-full h-full object-cover" />
              </div>
              <p className="absolute bottom-4 left-0 right-0 text-center font-handwritten text-xl text-gray-700">
                Nuestro mejor momento ❤️
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-sm text-[#8D5B4C]/60">
            Hecho con amor para San Valentín por{" "}
            <a href="https://www.instagram.com/liammdev/" target="_blank" rel="noopener noreferrer" className="font-medium text-[#8D5B4C] hover:underline">@LiammDev</a>
          </p>
        </footer>
      </div>
    </main>
  )
}

// =============================================================================
// 2. SCRAPBOOK KAWAII
// =============================================================================
function ScrapbookLetterView({ letter }: ThemedLetterViewProps) {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundColor: "#AEC6CF",
        backgroundImage: "radial-gradient(#FFB7C5 20%, transparent 20%), radial-gradient(#ffffff 20%, transparent 20%)",
        backgroundSize: "50px 50px",
        backgroundPosition: "0 0, 25px 25px",
      }}
    >
      {/* Clouds */}
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="fixed top-8 left-8 text-white/80 pointer-events-none">
        <svg width="100" height="60" viewBox="0 0 80 50" fill="currentColor"><ellipse cx="40" cy="30" rx="35" ry="18" /><ellipse cx="20" cy="22" rx="18" ry="14" /><ellipse cx="55" cy="20" rx="20" ry="12" /></svg>
      </motion.div>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="fixed bottom-16 right-8 text-white/70 pointer-events-none">
        <svg width="120" height="70" viewBox="0 0 80 50" fill="currentColor"><ellipse cx="40" cy="30" rx="35" ry="18" /><ellipse cx="20" cy="22" rx="18" ry="14" /><ellipse cx="55" cy="20" rx="20" ry="12" /></svg>
      </motion.div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Card */}
        <div className="bg-[#FFF9FB] rounded-[40px] border-4 border-[#FFB7C5] shadow-[0_10px_0_0_rgba(93,84,164,0.1)] p-6 md:p-10 text-center relative overflow-visible">
          {/* Kawaii bear */}
          <div className="flex justify-center -mt-16 mb-4">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
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

          {/* Badge */}
          <span className="inline-block bg-gradient-to-r from-[#AEC6CF] to-purple-300 text-white px-6 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs shadow-md transform rotate-2 mb-4">
            <Sparkles className="w-3 h-3 inline mr-1" /> ¡Carta especial! <Sparkles className="w-3 h-3 inline ml-1" />
          </span>

          {/* Greeting */}
          <h1 className="font-handwritten font-bold text-3xl md:text-4xl text-[#5D54A4] mb-3">
            Hola, {letter.receiver_name}
          </h1>
          <p className="text-gray-500 text-sm mb-4 bg-white/50 py-1 px-4 rounded-full inline-block">
            {letter.sender_name} tiene algo importante que preguntarte...
          </p>

          {/* Custom content */}
          {letter.custom_content && (
            <div className="font-handwritten text-lg text-[#5D54A4]/80 mb-6 max-w-lg mx-auto leading-relaxed bg-white/40 rounded-2xl p-4">
              {letter.custom_content}
            </div>
          )}

          {/* Photo */}
          {letter.photo_url && (
            <div className="mb-6 relative inline-block">
              <div className="relative w-48 h-48 mx-auto">
                <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-full h-full bg-[#FFB7C5] rounded-full overflow-hidden border-4 border-white shadow-[0_8px_0_0_#F19C98]">
                  <img src={letter.photo_url} alt="Momento especial" className="w-full h-full object-cover" />
                </motion.div>
                <div className="absolute -bottom-1 -right-3 bg-white rounded-full p-0.5 border-2 border-[#FDFD96] shadow-sm">
                  <Star className="w-5 h-5 text-[#FDFD96]" fill="currentColor" />
                </div>
              </div>
            </div>
          )}

          {/* Question */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <QuestionDisplay
              messageType={letter.message_type}
              className="font-handwritten text-4xl md:text-5xl font-bold text-[#5D54A4] leading-tight"
              accentClass="text-[#FFB7C5] italic"
            />
          </motion.div>

          {/* Buttons */}
          <LetterButtons letterId={letter.id} themeId="scrapbook" />

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-[#FFB7C5]/30">
            <p className="text-xs text-gray-400 flex flex-wrap items-center justify-center gap-1">
              Hecho con <Heart className="w-3 h-3 text-[#FFB7C5] animate-pulse" fill="currentColor" /> para San Valentín por{" "}
              <a href="https://www.instagram.com/liammdev/" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-500 hover:text-[#FFB7C5] hover:underline">@LiammDev</a>
            </p>
            <div className="h-1 mt-3 bg-gradient-to-r from-[#FFB7C5] via-[#FDFD96] to-[#AEC6CF] rounded-full" />
          </div>
        </div>
      </div>
    </main>
  )
}

// =============================================================================
// 3. EDITORIAL MINIMALISTA (NEWSPAPER STYLE)
// =============================================================================
function EditorialLetterView({ letter }: ThemedLetterViewProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="min-h-screen bg-[#F9F7F1] text-[#1A1A1A] font-serif antialiased flex flex-col items-center py-12 px-4 md:px-8">
      {/* Texture overlay */}
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]" />

      <div className="relative z-10 w-full max-w-5xl bg-[#F9F7F1] shadow-2xl p-6 md:p-12 border-t-8 border-double border-[#1A1A1A]">

        {/* Masthead */}
        <header className="border-b-4 border-[#1A1A1A] mb-8 pb-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-[1px] bg-[#1A1A1A] flex-grow" />
            <span className="text-xs uppercase tracking-[0.3em] font-sans font-bold">EST. 2024</span>
            <div className="h-[1px] bg-[#1A1A1A] flex-grow" />
          </div>
          <h1 className="font-serif text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none transform scale-y-110 mb-4">
            The Love Chronicle
          </h1>
          <div className="flex justify-between items-center border-t-2 border-b-2 border-[#1A1A1A] py-2 mt-4 text-xs md:text-sm font-sans font-bold uppercase tracking-wider">
            <span>Vol. 14 • No. 02</span>
            <span>{today}</span>
            <span>Final Edition</span>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Main Story Column */}
          <article className="lg:col-span-8 flex flex-col gap-6">
            {/* Headline */}
            <div className="text-center lg:text-left mb-4">
              <h2 className="font-serif text-4xl md:text-6xl font-black leading-[0.9] uppercase italic mb-4">
                <QuestionDisplay
                  messageType={letter.message_type}
                  className=""
                  accentClass="text-[#CC7A6F]"
                />
              </h2>
              <div className="w-full h-1 bg-[#1A1A1A] mb-2" />
              <div className="flex justify-between font-sans text-xs font-bold uppercase tracking-wide text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="block w-2 h-2 bg-[#CC7A6F] rounded-full" />
                  Breaking News via {letter.sender_name}
                </span>
                <span>Read Time: Forever</span>
              </div>
            </div>

            {/* Photo (if exists) - Newspaper Style */}
            {letter.photo_url && (
              <figure className="relative mb-6 grayscale hover:grayscale-0 transition-all duration-700">
                <img
                  src={letter.photo_url}
                  alt="Evidence"
                  className="w-full h-auto border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]"
                />
                <figcaption className="text-[10px] font-sans font-bold uppercase tracking-wider mt-2 text-right text-gray-500">
                  Fig 1. Irrefutable proof of happiness
                </figcaption>
              </figure>
            )}

            {/* Body Text - Multi-column */}
            {letter.custom_content && (
              <div className="columns-1 md:columns-2 gap-8 text-justify font-serif text-base md:text-lg leading-relaxed border-t border-b border-[#1A1A1A]/20 py-6">
                <p className="first-letter:float-left first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:mt-[-8px] first-letter:font-serif">
                  {letter.custom_content}
                </p>
                <p className="mt-4 indent-8">
                  Experts agree that this level of affection is unprecedented. The sheer magnitude of feelings expressed in this document suggests a bond of historic proportions. Readers are advised to cherish this moment.
                </p>
              </div>
            )}

            <div className="flex justify-center mt-8">
              <LetterButtons letterId={letter.id} themeId="editorial" />
            </div>
          </article>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 flex flex-col gap-8 border-l border-[#1A1A1A] pl-0 lg:pl-8 pt-8 lg:pt-0">
            {/* "AD" / Sidebar Item */}
            <div className="border-2 border-[#1A1A1A] p-4 text-center">
              <h3 className="font-sans font-black uppercase text-xl mb-2">Notice</h3>
              <div className="w-12 h-1 bg-[#1A1A1A] mx-auto mb-4" />
              <p className="font-serif italic text-sm mb-4">
                "Love is not just looking at each other, it's looking in the same direction."
              </p>
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#CC7A6F]">
                — Saint-Exupéry
              </span>
            </div>

            {/* Sender Stamp */}
            <div className="text-center mt-auto">
              <div className="inline-block border-4 border-double border-[#1A1A1A] rounded-full p-8 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 bg-[#F9F7F1] px-2 text-[#CC7A6F] font-black font-sans uppercase text-xl whitespace-nowrap">
                  Official
                </div>
                <p className="font-serif font-bold uppercase tracking-widest text-xs">
                  Sent with Love<br />
                  By {letter.sender_name}
                </p>
              </div>
            </div>
          </aside>

        </div>

        {/* Footer */}
        <footer className="w-full py-8 text-center border-t-4 border-[#1A1A1A] mt-12 flex flex-col items-center gap-2">
          <div className="flex gap-4 text-2xl">✻ ✻ ✻</div>
          <p className="font-serif italic text-gray-500 text-sm">
            Printed in the heart, published for the soul.
          </p>
        </footer>
      </div>
    </main>
  )
}

// =============================================================================
// 4. MEDIANOCHE
// =============================================================================
function MidnightLetterView({ letter }: ThemedLetterViewProps) {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-white"
      style={{
        background: "#1A0B1A",
        backgroundImage: "radial-gradient(circle at 10% 20%, rgba(45,20,44,0.8) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(61,28,59,0.8) 0%, transparent 40%)",
      }}
    >
      {/* Glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF007F]/10 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: "2s" }} />

      {/* Sparkles */}
      <div className="absolute top-[20%] right-[20%] text-[#E0BFB8] opacity-20 animate-pulse pointer-events-none">✦</div>
      <div className="absolute bottom-[30%] left-[10%] text-[#E0BFB8] opacity-20 animate-pulse text-xl pointer-events-none" style={{ animationDelay: "1.5s" }}>✦</div>
      <div className="absolute top-[10%] left-[50%] text-[#E0BFB8] opacity-10 animate-pulse pointer-events-none">✦</div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Glass card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(45,20,44,0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5)",
          }}
        >
          {/* Nav */}
          <div className="p-6 flex justify-between items-center border-b border-white/5">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#FF007F] animate-pulse" fill="currentColor" />
              <span className="text-[#E0BFB8] text-xs uppercase tracking-widest font-medium opacity-80">Midnight Romance</span>
            </div>
            <div className="hidden md:flex space-x-8">
              {["Inicio", "Nuestra Historia", "Momentos"].map((item) => (
                <span key={item} className="text-[#E0BFB8]/70 text-xs tracking-widest uppercase font-semibold">{item}</span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 md:px-12 py-12 text-center">
            {/* Badge */}
            <div className="mb-8">
              <span
                className="inline-block px-4 py-1 rounded-full border border-[#FF007F]/30 bg-[#FF007F]/10 text-[#FF007F] text-xs tracking-[0.2em] uppercase font-bold"
                style={{ boxShadow: "0 0 10px rgba(255,0,127,0.3)" }}
              >
                Para Ti, {letter.receiver_name}
              </span>
            </div>

            {/* Greeting */}
            <p className="text-[#E0BFB8]/60 text-sm uppercase tracking-widest mb-6">
              {letter.sender_name} tiene algo importante que preguntarte...
            </p>

            {/* Custom content */}
            {letter.custom_content && (
              <p className="text-gray-300 font-sans font-light text-base max-w-lg mx-auto leading-relaxed mb-8">
                {letter.custom_content}
              </p>
            )}

            {/* Photo grid */}
            {letter.photo_url && (
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl border border-white/5 bg-white/5 mb-8 max-w-2xl mx-auto">
                <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                  <img src={letter.photo_url} alt="Momento" className="w-full h-full object-cover filter sepia-[0.3] contrast-125" />
                </div>
                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-white/20 scale-105 z-10 shadow-neon">
                  <img src={letter.photo_url} alt="Nosotros" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                  <img src={letter.photo_url} alt="Recuerdo" className="w-full h-full object-cover filter sepia-[0.3] contrast-125" />
                </div>
              </div>
            )}

            {/* Question */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-10"
            >
              <QuestionDisplay
                messageType={letter.message_type}
                className="font-serif text-4xl md:text-6xl font-medium leading-tight"
                accentClass="italic text-[#E0BFB8]"
              />
            </motion.div>

            {/* Buttons */}
            <LetterButtons letterId={letter.id} themeId="midnight" />
          </div>

          {/* Footer */}
          <div className="py-6 text-center border-t border-white/5 bg-black/20">
            <p className="text-xs text-white/40 tracking-wider flex flex-wrap items-center justify-center gap-1">
              HECHO CON <Heart className="w-3 h-3 text-[#FF007F] animate-pulse" fill="currentColor" /> BAJO LA LUNA POR{" "}
              <a href="https://www.instagram.com/liammdev/" target="_blank" rel="noopener noreferrer" className="font-medium text-white/60 hover:text-[#FF007F] hover:underline">@LiammDev</a>
            </p>
          </div>
        </div>
      </div>

      {/* Side lines */}
      <div className="hidden lg:block absolute top-1/2 left-10 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      <div className="hidden lg:block absolute top-1/2 right-10 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
    </main>
  )
}

// =============================================================================
// 5. ROMÁNTICO PRO (PREMIUM)
// =============================================================================
function RomanticProLetterView({ letter }: ThemedLetterViewProps) {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundColor: "#F8EFE4",
        backgroundImage: "url('https://www.transparenttextures.com/patterns/linen.png')",
      }}
    >
      {/* Rain of Hearts (Background) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: "100vh", opacity: [0, 1, 0] }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
            className="absolute text-[#E29595]/30"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
          >
            ❤
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Main Card */}
          <div className="flex-1 relative">
            {/* Handcrafted edge effect */}
            <div className="absolute inset-0 bg-[#DBC7B5] transform translate-y-2 translate-x-2 rounded-lg" />

            <div className="relative bg-[#FFF9F2] p-8 md:p-12 rounded-lg shadow-xl border border-[#DBC7B5] overflow-hidden">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#C14E4E]/20 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#C14E4E]/20 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#C14E4E]/20 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#C14E4E]/20 rounded-br-lg" />

              <div className="text-center relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F4E4E4] mb-6">
                  <Heart className="w-6 h-6 text-[#C14E4E]" fill="currentColor" />
                </div>

                <h1 className="font-serif font-bold text-3xl md:text-5xl text-[#3D2B1F] mb-2 tracking-wide">
                  Querida, {letter.receiver_name}
                </h1>

                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="h-px w-12 bg-[#C14E4E]/30" />
                  <span className="text-xs font-serif text-[#C14E4E] uppercase tracking-widest">
                    Una carta especial
                  </span>
                  <div className="h-px w-12 bg-[#C14E4E]/30" />
                </div>

                <p className="font-sans text-[#3D2B1F]/60 text-sm uppercase tracking-wider mb-8">
                  {letter.sender_name} ha escrito esto para ti...
                </p>

                {/* Custom Content */}
                {letter.custom_content && (
                  <div className="relative mb-10 text-left bg-white/50 p-6 rounded-lg border border-[#DBC7B5]/30">
                    <Sparkles className="absolute -top-3 -right-3 text-[#C14E4E]/40 w-6 h-6" />
                    <div className="font-handwritten text-xl md:text-2xl text-[#3D2B1F] leading-loose">
                      {letter.custom_content}
                    </div>
                  </div>
                )}

                {/* Question */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mb-12 py-8 border-y border-[#DBC7B5]/30"
                >
                  <QuestionDisplay
                    messageType={letter.message_type}
                    className="font-serif text-4xl md:text-6xl font-black text-[#C14E4E] leading-none"
                    accentClass="block text-2xl md:text-3xl font-light text-[#3D2B1F] mt-2 italic"
                  />
                </motion.div>

                {/* Buttons */}
                <LetterButtons letterId={letter.id} themeId="romantic_pro" />
              </div>
            </div>
          </div>

          {/* Photo (Floats on desktop, stacks on mobile) */}
          {letter.photo_url && (
            <div className="w-64 relative transform hover:rotate-2 transition-transform duration-500">
              <div className="absolute inset-0 bg-[#3D2B1F] transform translate-y-3 translate-x-3" />
              <div className="relative bg-white p-3 pb-12 shadow-2xl border border-[#DBC7B5]">
                <div className="aspect-[3/4] overflow-hidden bg-[#F8EFE4]">
                  <img
                    src={letter.photo_url}
                    alt="Nosotros"
                    className="w-full h-full object-cover filter contrast-[1.1] sepia-[0.2]"
                  />
                </div>
                <div className="absolute bottom-4 left-0 w-full text-center">
                  <span className="font-handwritten text-2xl text-[#3D2B1F]">Forever</span>
                </div>
                {/* Tape effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/30 backdrop-blur-sm transform -rotate-2 border-l border-r border-white/40 opacity-80" />
              </div>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center">
          <p className="font-serif italic text-[#3D2B1F]/40 text-sm">
            &quot;El amor no se mira, se siente.&quot; — Pablo Neruda
          </p>
        </footer>
      </div>
    </main>
  )
}
