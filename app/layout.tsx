import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Caveat, Dancing_Script } from 'next/font/google'
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

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Carta Secreta - Envia una pregunta especial',
  description: 'Crea una carta digital romantica y enviala por email para hacer una pregunta que nunca olvidara.',
}

export const viewport: Viewport = {
  themeColor: '#C76A5B',
}

import { FundingBanner } from "@/components/funding-banner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7123506609054772"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${caveat.variable} ${dancingScript.variable} font-sans antialiased`}>
        <FundingBanner />
        {children}
      </body>
    </html>
  )
}
