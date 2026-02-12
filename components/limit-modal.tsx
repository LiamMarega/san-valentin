"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Instagram, Heart, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface LimitModalProps {
    isOpen: boolean
    onClose: () => void
}

export function LimitModal({ isOpen, onClose }: LimitModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            // Prevents closing when clicking outside as per requirement
            if (!open) onClose()
        }}>
            <DialogContent
                className="sm:max-w-md border-none bg-white/95 backdrop-blur-md p-0 overflow-hidden shadow-2xl"
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                <div className="relative p-6 sm:p-8">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-pink-500 to-red-500" />
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-100 rounded-full blur-3xl opacity-50" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50" />

                    <DialogHeader className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-2">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
                            </motion.div>
                        </div>

                        <DialogTitle className="text-2xl font-bold text-center text-gray-900 flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5 text-rose-400" />
                            ¡Ya enviaste tu carta! 💌
                        </DialogTitle>

                        <DialogDescription className="text-center text-gray-600 leading-relaxed text-base">
                            Este proyecto es autofinanciado por mí (<span className="font-semibold text-rose-600">@LiammDev</span>).
                            Cada carta tiene un costo de servidor y desarrollo que mantengo de mi bolsillo.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 space-y-4">
                        <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100">
                            <p className="text-sm text-center text-rose-800 font-medium">
                                ¡Tu follow significa mucho para mí y me motiva a seguir creando proyectos como este! 🚀❤️
                            </p>
                        </div>

                        <Button
                            asChild
                            className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 transition-all shadow-lg border-none"
                        >
                            <a
                                href="https://www.instagram.com/liammdev/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                            >
                                <Instagram className="w-5 h-5" />
                                Seguir a @LiammDev en Instagram
                            </a>
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
