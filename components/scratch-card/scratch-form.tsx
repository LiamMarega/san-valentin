"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Mail,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react"
import { ScratchThemeSelector } from "./theme-selector"
import { ScratchPreview } from "./scratch-preview"
import { createScratchCard } from "@/lib/scratch-actions"
import { isScratchThemeLocked, type ScratchThemeId } from "@/constants/scratch-themes"
import type { ScratchCardFormData } from "@/lib/types"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: 1, title: "Nombres", icon: Heart },
  { id: 2, title: "Mensaje", icon: MessageSquare },
  { id: 3, title: "Estilo", icon: Sparkles },
  { id: 4, title: "Vista previa", icon: Mail },
]

export function ScratchForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [senderName, setSenderName] = useState("")
  const [senderEmail, setSenderEmail] = useState("")
  const [receiverName, setReceiverName] = useState("")
  const [receiverEmail, setReceiverEmail] = useState("")
  const [hiddenMessage, setHiddenMessage] = useState("")
  const [revealMessage, setRevealMessage] = useState("")
  const [selectedTheme, setSelectedTheme] = useState<ScratchThemeId>("corazones")

  function capitalizeFirstLetter(value: string): string {
    if (!value) return value
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return senderName.trim() && receiverName.trim() && receiverEmail.trim()
      case 2:
        return hiddenMessage.trim()
      case 3:
        return true
      case 4:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length && canProceed()) {
      setCurrentStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    }
  }

  async function redirectToMercadoPago(scratchCardId: string) {
    try {
      const res = await fetch("/api/create-scratch-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scratchCardId }),
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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError("")

    const isPremium = isScratchThemeLocked(selectedTheme)

    const formData: ScratchCardFormData = {
      senderName,
      senderEmail: senderEmail || undefined,
      receiverName,
      receiverEmail,
      hiddenMessage,
      revealMessage: revealMessage || undefined,
      theme: selectedTheme,
      isPremium,
    }

    try {
      const result = await createScratchCard(formData)

      if (!result.success || !result.scratchCardId) {
        setError(result.error || "Error al crear el raspadito")
        setIsSubmitting(false)
        return
      }

      // If premium, redirect to payment
      if (isPremium) {
        await redirectToMercadoPago(result.scratchCardId)
        return
      }

      // If free, go to success page
      router.push(`/raspadito/exito?id=${result.scratchCardId}`)
    } catch {
      setError("Hubo un error. Intenta de nuevo.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              type="button"
              onClick={() => {
                if (step.id < currentStep) setCurrentStep(step.id)
              }}
              disabled={step.id > currentStep}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                currentStep === step.id
                  ? "bg-rose-500 text-white"
                  : step.id < currentStep
                    ? "bg-rose-100 text-rose-700 cursor-pointer hover:bg-rose-200"
                    : "bg-slate-100 text-slate-400"
              )}
            >
              <step.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{step.title}</span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-6 h-0.5 mx-1",
                  step.id < currentStep ? "bg-rose-300" : "bg-slate-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form content */}
      <div className="bg-white rounded-2xl shadow-xl p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* Step 1: Names */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5"
            >
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                  Quien envia y quien recibe?
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Cuéntanos los nombres para personalizar tu raspadito
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(capitalizeFirstLetter(e.target.value))}
                  placeholder="Quien envia el raspadito?"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  Nombre de quien recibe
                </label>
                <input
                  type="text"
                  value={receiverName}
                  onChange={(e) => setReceiverName(capitalizeFirstLetter(e.target.value))}
                  placeholder="Para quien es?"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-rose-500" />
                  Email del destinatario
                </label>
                <input
                  type="email"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  placeholder="A que correo enviamos el raspadito?"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  Tu email
                  <span className="text-xs text-slate-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="Para notificarte cuando lo abran"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Message */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5"
            >
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                  Cual es tu mensaje secreto?
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Este mensaje aparecera cuando raspen la tarjeta
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Mensaje oculto
                </label>
                <textarea
                  value={hiddenMessage}
                  onChange={(e) => setHiddenMessage(e.target.value)}
                  placeholder="Te amo mucho! Queres ser mi San Valentin?"
                  rows={4}
                  maxLength={500}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                />
                <p className="text-xs text-slate-400 text-right">
                  {hiddenMessage.length}/500
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  Mensaje adicional
                  <span className="text-xs text-slate-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={revealMessage}
                  onChange={(e) => setRevealMessage(e.target.value)}
                  placeholder="Un mensaje corto que aparece despues"
                  maxLength={200}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Theme */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5"
            >
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                  Elige un estilo
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Selecciona el diseno que mas te guste
                </p>
              </div>

              <ScratchThemeSelector
                selectedTheme={selectedTheme}
                onSelectTheme={setSelectedTheme}
              />

              {/* Premium benefits banner */}
              {isScratchThemeLocked(selectedTheme) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4"
                >
                  <p className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4" />
                    Que incluye el tema Premium?
                  </p>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">OK</span> Diseno exclusivo y premium
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">OK</span> Efectos especiales al raspar
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">OK</span> Animaciones de celebracion
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">OK</span> Solo $2.99 USD
                    </li>
                  </ul>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 4: Preview */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5"
            >
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                  Vista previa
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Asi se vera tu raspadito. Listo para enviar?
                </p>
              </div>

              <div className="flex justify-center">
                <ScratchPreview
                  theme={selectedTheme}
                  senderName={senderName}
                  receiverName={receiverName}
                  message={hiddenMessage}
                />
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-xl p-4 text-sm">
                <p className="font-medium text-slate-700 mb-2">Resumen:</p>
                <ul className="space-y-1 text-slate-600">
                  <li>De: <span className="font-medium">{senderName}</span></li>
                  <li>Para: <span className="font-medium">{receiverName}</span></li>
                  <li>Email: <span className="font-medium">{receiverEmail}</span></li>
                  <li>
                    Tipo:{" "}
                    <span className={cn(
                      "font-medium",
                      isScratchThemeLocked(selectedTheme) ? "text-amber-600" : "text-green-600"
                    )}>
                      {isScratchThemeLocked(selectedTheme) ? "Premium ($2.99)" : "Gratis"}
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-600 text-center mt-4">{error}</p>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={cn(
              "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              currentStep === 1
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Atras
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn(
                "flex items-center gap-1 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                canProceed()
                  ? "bg-rose-500 text-white hover:bg-rose-600"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  {isScratchThemeLocked(selectedTheme) ? "Pagar y enviar" : "Enviar raspadito"}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
