"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Check, Loader2, ArrowRight } from "lucide-react"
import { updateSenderEmail } from "@/lib/actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function SenderEmailForm({ letterId }: { letterId: string }) {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return

        setIsSubmitting(true)
        try {
            const result = await updateSenderEmail(letterId, email)
            if (result.success) {
                setIsSuccess(true)
                toast.success("¡Email guardado correctamente!")
            } else {
                toast.error(result.error || "Hubo un error")
            }
        } catch (error) {
            toast.error("Error al guardar el email")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full max-w-sm mx-auto mt-6">
            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center p-4 bg-green-50 border border-green-200 rounded-xl text-center"
                    >
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                            <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-800">
                            ¡Gracias! Tu correo quedó vinculado a la carta.
                        </p>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit}
                        className="relative"
                    >
                        <div className="flex flex-col gap-2">
                            <label htmlFor="sender-email" className="text-xs font-medium text-muted-foreground ml-1">
                                Por último, vincular tu correo electrónico con esta carta.
                            </label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <input
                                    id="sender-email"
                                    type="email"
                                    placeholder="Tu correo electrónico (opcional)"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full pl-9 pr-12 py-2.5 text-sm rounded-xl border border-border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e as any)}
                                    disabled={!email || isSubmitting}
                                    className={cn(
                                        "absolute right-1 p-1.5 rounded-lg transition-all",
                                        email ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
                                    )}
                                    title="Guardar correo"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}
