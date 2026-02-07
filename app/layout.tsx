import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Caveat } from 'next/font/google'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Carta Secreta - Envia una pregunta especial',
  description: 'Crea una carta digital romantica y enviala por email para hacer una pregunta que nunca olvidara.',
}

export const viewport: Viewport = {
  themeColor: '#C76A5B',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} ${caveat.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
