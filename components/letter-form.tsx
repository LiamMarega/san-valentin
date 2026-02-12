"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Heart,
  Mail,
  Send,
  Sparkles,
  Calendar,
  Clock,
  Globe,
  Lock,
  Palette,
  Users,
  MessageSquare,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { THEMES, RELATIONSHIP_OPTIONS, getThemeById, isThemeLocked } from "@/constants/themes"
import type { ThemeId, RelationshipType } from "@/constants/themes"
import { LetterPreview } from "@/components/letter-preview"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/firebase"
import { LimitModal } from "@/components/limit-modal"


// =============================================================================
// Theme Selector Card
// =============================================================================
function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: (typeof THEMES)[number]
  isSelected: boolean
  onSelect: () => void
}) {
  const locked = theme.isLocked

  return (
    <button
      type="button"
      onClick={() => onSelect()}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all text-left w-full",
        isSelected
          ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
          : "border-border hover:border-primary/30 bg-card",
        locked && !isSelected && "opacity-60"
      )}
    >
      {/* Color swatch */}
      <div
        className={cn(
          "w-full aspect-[3/2] rounded-lg flex items-center justify-center text-lg font-bold",
          theme.preview.cardBg,
          theme.preview.accent
        )}
      >
        {locked ? <Lock className="w-5 h-5 text-gray-400" /> : <Heart className="w-5 h-5" fill="currentColor" />}
      </div>

      <span className="text-xs font-semibold text-foreground leading-tight text-center">
        {theme.name}
      </span>

      {locked && (
        <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-500 uppercase">
          <Lock className="w-2.5 h-2.5" /> Pro
        </span>
      )}

      {isSelected && !locked && (
        <motion.div
          layoutId="theme-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"
        />
      )}
    </button>
  )
}

// =============================================================================
// Main Form
// =============================================================================
export function LetterForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Theme & preview state
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("classic")
  const [showPreview, setShowPreview] = useState(false)
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false)

  // New fields
  const [relationshipType, setRelationshipType] = useState<RelationshipType>("pareja")
  const [customContent, setCustomContent] = useState("")

  // Scheduling
  const [isScheduled, setIsScheduled] = useState(false)
  const [userTimezone, setUserTimezone] = useState("")

  // Message type
  const [messageType, setMessageType] = useState("")
  const CUSTOM_VALUE = "__custom__"

  // Live preview values
  const [senderName, setSenderName] = useState("")
  const [receiverName, setReceiverName] = useState("")

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    setUserTimezone(tz)

    // Formulario cargado
    trackEvent("letter_form_view", {
      timezone: tz,
    })
  }, [])

  function capitalizeFirstLetter(value: string): string {
    if (!value) return value
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  async function redirectToMercadoPago(letterId: string) {
    try {
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterId }),
      })

      if (!res.ok) {
        throw new Error("Error creating payment preference")
      }

      const { init_point } = await res.json()
      window.location.href = init_point
    } catch {
      setError("Error al iniciar el pago. Intenta de nuevo.")
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Check for free letter limit
    const isFreeTheme = !isThemeLocked(selectedTheme)
    let hasSentLetter = false
    try {
      hasSentLetter = !!window.localStorage.getItem("love_letter_sent")
    } catch (e) {
      console.error("Error accessing localStorage:", e)
    }

    if (isFreeTheme && hasSentLetter) {
      setIsLimitModalOpen(true)
      return
    }

    setIsSubmitting(true)
    setError("")

    // Intento de envío de carta
    trackEvent("letter_submit_attempt")

    const formData = new FormData(e.currentTarget)
    const selectedType = formData.get("message_type") as string
    const message_type =
      selectedType === CUSTOM_VALUE
        ? (formData.get("message_type_custom") as string)?.trim() || ""
        : selectedType

    if (!message_type) {
      setError("Escribí tu pregunta personalizada.")
      setIsSubmitting(false)
      return
    }

    const receiverEmail = formData.get("receiver_email") as string

    const data: Record<string, unknown> = {
      sender_name: formData.get("sender_name") as string,
      receiver_name: formData.get("receiver_name") as string,
      receiver_email: receiverEmail,
      message_type,
      timezone: userTimezone,
      theme: selectedTheme,
      relationship_type: relationshipType,
      custom_content: customContent,
    }

    if (isScheduled) {
      const date = formData.get("scheduled_date")
      const time = formData.get("scheduled_time")

      if (!date || !time) {
        setError("Por favor selecciona fecha y hora.")
        setIsSubmitting(false)
        return
      }

      data.scheduled_at = `${date}T${time}:00`
    }

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Error al enviar la carta")

      const { letterId, isPremium } = await res.json()

      // Carta creada correctamente
      trackEvent("letter_created", {
        theme: selectedTheme,
        relationship_type: relationshipType,
        is_scheduled: isScheduled,
        is_premium: isPremium,
      })

      // Si es premium -> redirigir a MercadoPago Checkout
      if (isPremium) {
        trackEvent("letter_premium_checkout_opened")
        await redirectToMercadoPago(letterId)
        return
      }

      // Mark as sent if it's a free letter
      if (isFreeTheme) {
        try {
          window.localStorage.setItem("love_letter_sent", JSON.stringify({
            sent: true,
            timestamp: new Date().toISOString()
          }))
        } catch (e) {
          console.error("Error saving to localStorage:", e)
        }
      }

      // Flujo gratis -> redirigir directamente
      if (isScheduled) {
        const date = formData.get("scheduled_date") as string
        const time = formData.get("scheduled_time") as string
        const params = new URLSearchParams({ scheduled: "1", date, time })
        router.push(`/sent?${params.toString()}`)
        trackEvent("letter_sent_scheduled")
      } else {
        router.push("/sent")
        trackEvent("letter_sent_immediate")
      }
    } catch {
      setError("Hubo un error al enviar la carta. Intenta de nuevo.")
      trackEvent("letter_submit_error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Resolve the actual message string for preview
  const resolvedMessage =
    messageType === CUSTOM_VALUE ? "" : messageType

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ====== LEFT COLUMN: Form ====== */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">


          {/* ── Sender name ── */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sender_name" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Tu nombre
            </label>
            <input
              id="sender_name"
              name="sender_name"
              type="text"
              required
              placeholder="¿Quién envía la carta?"
              value={senderName}
              onChange={(e) => setSenderName(capitalizeFirstLetter(e.target.value))}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* ── Receiver name ── */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="receiver_name" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Nombre de quien recibe
            </label>
            <input
              id="receiver_name"
              name="receiver_name"
              type="text"
              required
              placeholder="¿Para quién es?"
              value={receiverName}
              onChange={(e) => setReceiverName(capitalizeFirstLetter(e.target.value))}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* ── Receiver email ── */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="receiver_email" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email del receptor
            </label>
            <input
              id="receiver_email"
              name="receiver_email"
              type="email"
              required
              placeholder="¿A qué correo enviamos la carta?"
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* ── Message type ── */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message_type" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Send className="w-4 h-4 text-primary" />
              Pregunta
            </label>
            <select
              id="message_type"
              name="message_type"
              required
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none"
            >
              <option value="">Elegí una opción...</option>
              <option value="Queres ser mi San Valentin?">{"¿Querés ser mi San Valentín?"}</option>
              <option value="Queres ser mi novia?">{"¿Querés ser mi novia?"}</option>
              <option value="Tengo algo importante que preguntarte...">
                {"Tengo algo importante que preguntarte..."}
              </option>
              <option value={CUSTOM_VALUE}>Pregunta personalizada...</option>
            </select>
            {messageType === CUSTOM_VALUE && (
              <input
                type="text"
                name="message_type_custom"
                placeholder="Escribí tu pregunta..."
                required
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all mt-1"
              />
            )}
          </div>

          {/* ── Custom Content (dedication) ── */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="custom_content" className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Mensaje personalizado
              <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
            </label>
            <textarea
              id="custom_content"
              name="custom_content"
              rows={3}
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              placeholder="Escribí un mensaje especial que acompañe tu carta..."
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
            />
          </div>

          {/* ── Scheduling ── */}
          <div className="bg-secondary/30 p-4 rounded-xl border border-secondary">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="schedule_check"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
              <label htmlFor="schedule_check" className="text-sm font-medium cursor-pointer select-none">
                Programar envío para después
              </label>
            </div>

            <AnimatePresence>
              {isScheduled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-3 overflow-hidden"
                >
                  <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                    <label htmlFor="scheduled_date" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Fecha
                    </label>
                    <input
                      id="scheduled_date"
                      name="scheduled_date"
                      type="date"
                      required={isScheduled}
                      defaultValue={`${new Date().getFullYear()}-02-14`}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                    <label htmlFor="scheduled_time" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Hora
                    </label>
                    <input
                      id="scheduled_time"
                      name="scheduled_time"
                      type="time"
                      required={isScheduled}
                      defaultValue="10:00"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="col-span-2 text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Globe className="w-3 h-3" />
                    Zona horaria detectada: <span className="font-medium text-foreground">{userTimezone}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Theme Selector ── */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              Estilo de Carta
            </label>

            {/* Free themes */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gratis</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEMES.filter((t) => !t.isLocked).map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedTheme === theme.id}
                  onSelect={() => setSelectedTheme(theme.id)}
                />
              ))}
            </div>

            {/* Pro themes */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Pro — $1 USD
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEMES.filter((t) => t.isLocked).map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedTheme === theme.id}
                  onSelect={() => setSelectedTheme(theme.id)}
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              {getThemeById(selectedTheme).description}
            </p>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center" role="alert">
              {error}
            </p>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground font-semibold py-3.5 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl mt-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin inline-block w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                Guardando...
              </>
            ) : isThemeLocked(selectedTheme) ? (
              "Pagar $1 USD y Enviar"
            ) : isScheduled ? (
              "Programar Carta"
            ) : (
              "Enviar Carta Ahora"
            )}
          </button>

          {/* Mobile preview toggle */}
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden w-full py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <Palette className="w-4 h-4" />
            {showPreview ? "Ocultar Vista Previa" : "Ver Vista Previa"}
          </button>
        </form>

        {/* ====== RIGHT COLUMN: Live Preview ====== */}
        <div className={cn("lg:block", showPreview ? "block" : "hidden")}>
          <div className="sticky top-8">
            <LetterPreview
              themeId={selectedTheme}
              senderName={senderName}
              receiverName={receiverName}
              messageType={resolvedMessage}
              customContent={customContent}
              relationshipType={relationshipType}
            />
          </div>
        </div>
      </div>

      <LimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
      />
    </div>
  )
}
