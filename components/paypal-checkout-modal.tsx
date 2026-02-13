"use client"

import React, { useState } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, ShieldCheck } from "lucide-react"
import { trackEvent } from "@/lib/firebase"

interface PayPalCheckoutModalProps {
  isOpen: boolean
  letterId: string
  onClose: () => void
  onSuccess: (letterId: string) => void
}

export function PayPalCheckoutModal({
  isOpen,
  letterId,
  onClose,
  onSuccess,
}: PayPalCheckoutModalProps) {
  const [error, setError] = useState("")

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  if (!clientId) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-white">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-lg font-bold">Desbloquear Tema Premium</h2>
              </div>
              <p className="text-sm text-white/90 mt-1">
                Solo $1 USD — tu carta con un diseño exclusivo
              </p>
            </div>

            {/* PayPal Buttons */}
            <div className="px-6 py-5">
              <PayPalScriptProvider
                options={{
                  clientId,
                  currency: "USD",
                  intent: "capture",
                }}
              >
                <PayPalButtons
                  style={{
                    shape: "rect",
                    layout: "vertical",
                    color: "gold",
                    label: "paypal",
                    tagline: false,
                  }}
                  createOrder={async () => {
                    setError("")
                    try {
                      const res = await fetch("/api/create-paypal-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ letterId }),
                      })

                      const data = await res.json()

                      if (!res.ok || !data.orderId) {
                        throw new Error(data.error || "Error creating order")
                      }

                      trackEvent("paypal_order_created", { letterId })
                      return data.orderId
                    } catch (err) {
                      console.error("PayPal createOrder error:", err)
                      setError("Error al crear la orden. Intenta de nuevo.")
                      throw err
                    }
                  }}
                  onApprove={async (data) => {
                    setError("")
                    try {
                      const res = await fetch("/api/capture-paypal-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          orderId: data.orderID,
                          letterId,
                        }),
                      })

                      const result = await res.json()

                      if (!res.ok || !result.success) {
                        throw new Error(result.error || "Error capturing payment")
                      }

                      trackEvent("paypal_payment_completed", { letterId })
                      onSuccess(result.letterId || letterId)
                    } catch (err) {
                      console.error("PayPal onApprove error:", err)
                      setError("Error al procesar el pago. Intenta de nuevo.")
                    }
                  }}
                  onCancel={() => {
                    trackEvent("paypal_payment_cancelled", { letterId })
                  }}
                  onError={(err) => {
                    console.error("PayPal error:", err)
                    setError("Ocurrió un error con PayPal. Intenta de nuevo.")
                    trackEvent("paypal_payment_error", { letterId })
                  }}
                />
              </PayPalScriptProvider>

              {error && (
                <p className="text-red-500 text-sm text-center mt-3">{error}</p>
              )}

              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pago seguro con PayPal — no necesitas cuenta</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
