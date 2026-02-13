"use client"

import React from "react"
import { motion } from "framer-motion"
import { Heart, Sparkles, Star, Send, Music, Pause } from "lucide-react"
import type { LetterData } from "@/lib/types"
import type { ThemeId } from "@/constants/themes"
import { getThemeById } from "@/constants/themes"
import { HeartConfetti } from "@/components/heart-confetti"

// =============================================================================
// Props
// =============================================================================
interface ThemedCelebrationProps {
  letter: LetterData
}

// =============================================================================
// Main — delegates to per-theme celebration
// =============================================================================
export function ThemedCelebration({ letter }: ThemedCelebrationProps) {
  const themeId = (letter.theme || "classic") as ThemeId
  const theme = getThemeById(themeId)

  const renderers: Record<ThemeId, React.FC<ThemedCelebrationProps>> = {
    classic: ClassicCelebration,
    scrapbook: ScrapbookCelebration,
    editorial: EditorialCelebration,
    midnight: MidnightCelebration,
    romantic_pro: RomanticProCelebration,
  }

  const Renderer = renderers[theme.id] ?? ClassicCelebration

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${theme.wrapperClass} w-full`}
    >
      <Renderer letter={letter} />
      {letter.music_url && <MusicPlayer src={letter.music_url} />}
    </motion.div>
  )
}

// =============================================================================
// Music Player (shared)
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
        {playing ? <Pause className="w-5 h-5 text-gray-700" /> : <Music className="w-5 h-5 text-gray-700" />}
      </button>
    </>
  )
}

// =============================================================================
// CTA — Create your own
// =============================================================================
function CreateOwnCTA({ textColor = "text-muted-foreground", btnClass = "bg-primary text-primary-foreground" }: { textColor?: string; btnClass?: string }) {
  return (
    <div className="mt-10 pt-6 border-t border-current/10">
      <p className={`${textColor} text-sm mb-3`}>{"¿Querés crear tu propia carta?"}</p>
      <a
        href="/"
        className={`inline-flex items-center justify-center gap-2 font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-all shadow-lg ${btnClass}`}
      >
        Crear mi carta
      </a>
    </div>
  )
}

// =============================================================================
// 1. CLÁSICO ROMÁNTICO — Celebration
// =============================================================================
function ClassicCelebration({ letter }: ThemedCelebrationProps) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: "#F4E4E4" }}>
      <HeartConfetti />

      {/* Blobs */}
      <div className="fixed top-0 left-0 w-64 h-64 pointer-events-none opacity-30">
        <svg className="w-full h-full fill-[#D4A5A5]" viewBox="0 0 200 200">
          <path d="M45.7,-76.4C58.9,-69.3,69.1,-55.6,76.3,-41.3C83.5,-26.9,87.6,-11.9,85.2,1.9C82.8,15.7,73.9,28.3,63.6,38.9C53.3,49.5,41.6,58.1,29.1,64.2C16.6,70.3,3.3,73.9,-8.9,71.2C-21.1,68.5,-32.2,59.5,-43.3,50.1C-54.4,40.7,-65.5,30.9,-71.3,18.4C-77.1,5.9,-77.6,-9.3,-71.4,-21.8C-65.2,-34.3,-52.3,-44.1,-39.8,-51.5C-27.3,-58.9,-15.2,-63.9,0.5,-64.7C16.2,-65.5,32.4,-62.1,45.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-[#FDFBF7] rounded-sm shadow-paper p-8 md:p-14 text-center relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 pointer-events-none rounded-sm" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-block bg-[#F4E4E4] text-[#8D5B4C] px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase">
                ¡Es oficial!
              </span>
            </div>

            {/* Heart icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="w-24 h-24 rounded-full bg-[#F4E4E4] flex items-center justify-center animate-float">
                <Heart className="w-12 h-12 text-[#8D5B4C]" fill="currentColor" />
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#8D5B4C] mb-4 leading-tight">
              {"¡Sabía que dirías que sí!"}
            </h1>

            {/* Message */}
            <p className="font-handwritten text-xl md:text-2xl text-[#2C3E50]/70 leading-relaxed">
              {letter.sender_name} va a estar muy feliz.
            </p>

            {/* Photo */}
            {letter.photo_url && (
              <div className="mt-8 inline-block">
                <div className="bg-white p-3 shadow-md transform -rotate-2 max-w-[200px]">
                  <img src={letter.photo_url} alt="Celebración" className="w-full aspect-square object-cover" />
                  <p className="font-handwritten text-lg text-gray-600 text-center mt-2">¡Qué emoción! ❤️</p>
                </div>
              </div>
            )}

            <CreateOwnCTA textColor="text-[#8D5B4C]/60" btnClass="bg-[#8D5B4C] text-white" />
          </div>

          {/* Stamp */}
          <div className="absolute bottom-6 right-6 opacity-40">
            <svg width="60" height="60" viewBox="0 0 100 100" className="fill-[#8D5B4C]/20">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
              <text x="50" y="55" textAnchor="middle" fontSize="11" fill="currentColor" fontFamily="serif">CON AMOR</text>
            </svg>
          </div>
        </div>

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
// 2. SCRAPBOOK KAWAII — Celebration
// =============================================================================
function ScrapbookCelebration({ letter }: ThemedCelebrationProps) {
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
      <HeartConfetti />

      {/* Clouds */}
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="fixed top-8 left-8 text-white/80 pointer-events-none">
        <svg width="100" height="60" viewBox="0 0 80 50" fill="currentColor"><ellipse cx="40" cy="30" rx="35" ry="18" /><ellipse cx="20" cy="22" rx="18" ry="14" /><ellipse cx="55" cy="20" rx="20" ry="12" /></svg>
      </motion.div>

      <div className="relative z-10 w-full max-w-3xl">
        <div className="bg-[#FFF9FB] rounded-[40px] border-4 border-[#FFB7C5] shadow-[0_10px_0_0_rgba(93,84,164,0.1)] p-6 md:p-10 text-center relative overflow-visible">
          {/* Bear */}
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
            <Sparkles className="w-3 h-3 inline mr-1" /> ¡Es oficial! <Sparkles className="w-3 h-3 inline ml-1" />
          </span>

          {/* Celebration icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-32 h-32 bg-[#FFB7C5] rounded-full flex items-center justify-center shadow-[0_8px_0_0_#F19C98] border-4 border-white">
                <Send className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-3 bg-white rounded-full p-0.5 border-2 border-[#FDFD96] shadow-sm">
                <Star className="w-5 h-5 text-[#FDFD96]" fill="currentColor" />
              </div>
            </div>
          </motion.div>

          <h1 className="font-handwritten font-bold text-4xl md:text-5xl text-[#5D54A4] mb-2 leading-tight">
            💖 ¡Sabía que dirías<br />que sí!
          </h1>

          <p className="text-gray-500 text-lg mb-4 bg-white/50 py-1 px-4 rounded-full inline-block">
            {letter.sender_name} va a estar muy feliz (≧◡≦)
          </p>

          {/* Photo */}
          {letter.photo_url && (
            <div className="mb-6">
              <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-40 h-40 mx-auto bg-[#FFB7C5] rounded-full overflow-hidden border-4 border-white shadow-[0_8px_0_0_#F19C98]">
                <img src={letter.photo_url} alt="Celebración" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          )}

          <CreateOwnCTA textColor="text-gray-400" btnClass="bg-[#5D54A4] text-white rounded-3xl shadow-[0_6px_0_0_#3e376e] border-2 border-white" />

          <div className="mt-6 pt-4 border-t border-[#FFB7C5]/30">
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
// 3. EDITORIAL MINIMALISTA (NEWSPAPER STYLE) — Celebration
// =============================================================================
function EditorialCelebration({ letter }: ThemedCelebrationProps) {
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

      <div className="relative z-10 w-full max-w-3xl bg-[#F9F7F1] shadow-2xl p-6 md:p-12 border-t-8 border-double border-[#1A1A1A] text-center">

        {/* Masthead */}
        <header className="border-b-4 border-[#1A1A1A] mb-8 pb-4">
          <h1 className="font-serif text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none transform scale-y-110 mb-2">
            The Love Chronicle
          </h1>
          <div className="flex justify-between items-center border-t-2 border-b-2 border-[#1A1A1A] py-2 mt-2 text-xs md:text-sm font-sans font-bold uppercase tracking-wider">
            <span>Special Edition</span>
            <span>{today}</span>
            <span>Breaking News</span>
          </div>
        </header>

        {/* Main Headline */}
        <div className="mb-8">
          <h2 className="font-serif text-6xl md:text-8xl font-black uppercase leading-[0.8] mb-4">
            SHE SAID<br /><span className="italic text-[#CC7A6F]">YES!</span>
          </h2>
          <div className="w-full h-2 bg-[#1A1A1A] mb-1" />
          <div className="w-full h-0.5 bg-[#1A1A1A]" />
          <p className="mt-2 font-sans font-bold uppercase tracking-widest text-sm md:text-base">
            Celebrations Erupt Worldwide • Experts Baffled by Levels of Joy
          </p>
        </div>

        {/* Photo / Content */}
        <div className="mb-8">
          {letter.photo_url ? (
            <figure className="relative grayscale hover:grayscale-0 transition-all duration-700">
              <img
                src={letter.photo_url}
                alt="Celebration"
                className="w-full h-auto border-4 border-[#1A1A1A]"
              />
              <figcaption className="text-xs font-sans font-bold uppercase tracking-wider mt-2 text-left italic">
                Image: The happy couple spotted moments after the announcement.
              </figcaption>
            </figure>
          ) : (
            <div className="border-4 border-[#1A1A1A] p-8">
              <Heart className="w-24 h-24 text-[#CC7A6F] mx-auto animate-pulse" fill="currentColor" />
              <p className="mt-4 font-serif text-xl italic">
                "{letter.sender_name} is reportedly 'over the moon' following the acceptance."
              </p>
            </div>
          )}
        </div>

        <p className="font-serif text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto">
          In a developing story that has captured hearts everywhere, the proposal was accepted with enthusiasm. Sources close to <strong>{letter.sender_name}</strong> confirm that this is indeed the start of a beautiful chapter.
        </p>

        <CreateOwnCTA textColor="text-gray-500 font-sans font-bold uppercase tracking-widest" btnClass="bg-[#1A1A1A] text-[#F9F7F1] hover:bg-[#CC7A6F] hover:text-[#1A1A1A] transition-colors border-2 border-[#1A1A1A]" />

        {/* Footer */}
        <footer className="mt-12 pt-4 border-t-2 border-[#1A1A1A]">
          <p className="font-serif italic text-xs">
            Printed with love • The Love Chronicle Inc.
          </p>
        </footer>

      </div>
    </main>
  )
}

// =============================================================================
// 4. MEDIANOCHE — Celebration
// =============================================================================
function MidnightCelebration({ letter }: ThemedCelebrationProps) {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-white"
      style={{
        background: "#1A0B1A",
        backgroundImage: "radial-gradient(circle at 10% 20%, rgba(45,20,44,0.8) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(61,28,59,0.8) 0%, transparent 40%)",
      }}
    >
      <HeartConfetti />

      {/* Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF007F]/10 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: "2s" }} />

      <div className="absolute top-[20%] right-[20%] text-[#E0BFB8] opacity-20 animate-pulse pointer-events-none">✦</div>
      <div className="absolute bottom-[30%] left-[10%] text-[#E0BFB8] opacity-20 animate-pulse text-xl pointer-events-none">✦</div>

      <div className="relative z-10 w-full max-w-3xl">
        <div
          className="rounded-2xl overflow-hidden text-center"
          style={{
            background: "rgba(45,20,44,0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5)",
          }}
        >
          <div className="px-6 md:px-12 py-12">
            {/* Badge */}
            <div className="mb-6">
              <span
                className="inline-block px-4 py-1 rounded-full border border-[#FF007F]/30 bg-[#FF007F]/10 text-[#FF007F] text-xs tracking-[0.2em] uppercase font-bold"
                style={{ boxShadow: "0 0 10px rgba(255,0,127,0.3)" }}
              >
                ¡Es oficial!
              </span>
            </div>

            {/* Heart */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="w-24 h-24 rounded-full bg-[#FF007F]/20 flex items-center justify-center animate-float border border-[#FF007F]/30">
                <Heart className="w-12 h-12 text-[#FF007F]" fill="currentColor" style={{ filter: "drop-shadow(0 0 8px rgba(255,0,127,0.6))" }} />
              </div>
            </motion.div>

            <h1
              className="font-serif font-medium text-4xl md:text-5xl mb-4 leading-tight"
              style={{ textShadow: "0 0 10px rgba(255,0,127,0.3)" }}
            >
              ¡Sabía que dirías<br />
              <span className="italic text-[#E0BFB8] font-light">que sí!</span>
            </h1>

            <p className="text-gray-300 font-sans text-lg">{letter.sender_name} va a estar muy feliz.</p>

            {letter.photo_url && (
              <div className="my-8 grid grid-cols-3 gap-3 p-3 rounded-xl border border-white/5 bg-white/5 max-w-md mx-auto">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`aspect-[3/4] rounded-lg overflow-hidden ${i === 1 ? "border border-white/20 scale-105 z-10 shadow-neon" : "shadow-lg"}`}>
                    <img src={letter.photo_url!} alt="Celebración" className={`w-full h-full object-cover ${i !== 1 ? "filter sepia-[0.3] contrast-125" : ""}`} />
                  </div>
                ))}
              </div>
            )}

            <CreateOwnCTA
              textColor="text-white/40"
              btnClass="bg-gradient-to-r from-[#FF007F] to-purple-600 text-white rounded-full"
            />
          </div>

          <div className="py-6 text-center border-t border-white/5 bg-black/20">
            <p className="text-xs text-white/40 tracking-wider flex flex-wrap items-center justify-center gap-1">
              HECHO CON <Heart className="w-3 h-3 text-[#FF007F] animate-pulse" fill="currentColor" /> BAJO LA LUNA POR{" "}
              <a href="https://www.instagram.com/liammdev/" target="_blank" rel="noopener noreferrer" className="font-medium text-white/60 hover:text-[#FF007F] hover:underline">@LiammDev</a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute top-1/2 left-10 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      <div className="hidden lg:block absolute top-1/2 right-10 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
    </main>
  )
}

// =============================================================================
// 5. ROMÁNTICO PRO (PREMIUM) — Celebration
// =============================================================================
function RomanticProCelebration({ letter }: ThemedCelebrationProps) {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundColor: "#F8EFE4",
        backgroundImage: "url('https://www.transparenttextures.com/patterns/linen.png')",
      }}
    >
      <HeartConfetti />

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C14E4E]/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E29595]/5 rounded-full blur-3xl pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-2xl text-center">

        {/* Main Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-[#FFF9F2] p-8 md:p-14 rounded-t-full rounded-b-[1000px] shadow-2xl border-[8px] border-double border-[#DBC7B5] relative overflow-hidden"
        >
          {/* Inner border */}
          <div className="absolute inset-4 rounded-t-full rounded-b-[1000px] border border-[#C14E4E]/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-[#C14E4E] blur-xl opacity-20" />
              <div className="w-24 h-24 bg-[#C14E4E] rounded-full flex items-center justify-center shadow-lg text-white">
                <Heart className="w-12 h-12" fill="currentColor" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 text-[#E29595] w-8 h-8 animate-pulse" />
            </motion.div>

            <span className="font-serif text-[#C14E4E] text-sm tracking-[0.3em] uppercase mb-4 block">
              ¡She Said Yes!
            </span>

            <h1 className="font-serif font-black text-4xl md:text-6xl text-[#3D2B1F] mb-6 leading-none">
              ¡Dijo que <span className="text-[#C14E4E] italic font-light">Sí!</span>
            </h1>

            <p className="font-handwritten text-2xl text-[#3D2B1F]/70 mb-8 max-w-md">
              {letter.sender_name} estallará de felicidad al saberlo.
            </p>

            {letter.photo_url && (
              <div className="mb-8 relative max-w-xs mx-auto transform -rotate-3">
                <div className="absolute inset-0 bg-[#3D2B1F] transform translate-y-2 translate-x-2 rounded-sm" />
                <div className="relative bg-white p-2 pb-8 shadow-lg border border-[#DBC7B5] rounded-sm">
                  <img
                    src={letter.photo_url}
                    alt="Celebration"
                    className="w-full aspect-square object-cover filter contrast-[1.05] sepia-[0.1]"
                  />
                  <p className="absolute bottom-2 inset-x-0 font-handwritten text-lg text-center text-gray-500">Love u</p>
                </div>
              </div>
            )}

            <CreateOwnCTA textColor="text-[#3D2B1F]/40" btnClass="bg-[#C14E4E] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all" />

          </div>
        </motion.div>

        <div className="mt-8">
          <p className="font-serif text-[#3D2B1F]/40 italic text-sm">
            Made with eternal love for <a href="https://www.instagram.com/liammdev/" className="underline decoration-[#C14E4E]/30 hover:text-[#C14E4E]">@LiammDev</a>
          </p>
        </div>

      </div>
    </main>
  )
}
