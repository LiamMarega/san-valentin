"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, Mail, Send, Sparkles, Calendar, Clock, Globe } from "lucide-react"

export function LetterForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  // Estado para controlar si se programa o se envía ahora
  const [isScheduled, setIsScheduled] = useState(false)
  const [userTimezone, setUserTimezone] = useState("")

  // Detectar zona horaria al cargar
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    setUserTimezone(tz)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    
    const data: any = {
      sender_name: formData.get("sender_name") as string,
      receiver_name: formData.get("receiver_name") as string,
      receiver_email: formData.get("receiver_email") as string,
      message_type: formData.get("message_type") as string,
      timezone: userTimezone, // Enviamos la zona horaria
    }

    // Si está programado, agregamos la fecha
    if (isScheduled) {
      const date = formData.get("scheduled_date")
      const time = formData.get("scheduled_time")
      
      if (!date || !time) {
        setError("Por favor selecciona fecha y hora.")
        setIsSubmitting(false)
        return
      }
      
      // Combinamos fecha y hora en formato ISO string
      // Nota: El backend se encargará de convertirlo correctamente usando la timezone
      data.scheduled_at = `${date}T${time}:00` 
    }

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Error al enviar la carta")

      if (isScheduled) {
        const date = formData.get("scheduled_date") as string
        const time = formData.get("scheduled_time") as string
        const params = new URLSearchParams({ scheduled: "1", date, time })
        router.push(`/sent?${params.toString()}`)
      } else {
        router.push("/sent")
      }
    } catch {
      setError("Hubo un error al enviar la carta. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md mx-auto">
      {/* Sender name */}
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
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* Receiver name */}
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
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* Receiver email */}
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

      {/* Message type */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message_type" className="text-sm font-medium text-foreground flex items-center gap-2">
          <Send className="w-4 h-4 text-primary" />
          Pregunta
        </label>
        <select
          id="message_type"
          name="message_type"
          required
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none"
        >
          <option value="Queres ser mi San Valentin?">{"¿Querés ser mi San Valentín?"}</option>
          <option value="Queres ser mi novia?">{"¿Querés ser mi novia?"}</option>
          <option value="Tengo algo importante que preguntarte...">{"Tengo algo importante que preguntarte..."}</option>
        </select>
      </div>

      {/* Scheduling Option */}
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

        {isScheduled && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
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
          </div>
        )}
      </div>

      {error && (
        <p className="text-destructive text-sm text-center" role="alert">{error}</p>
      )}

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
        ) : (
          isScheduled ? "Programar Carta" : "Enviar Carta Ahora"
        )}
      </button>
    </form>
  )
}