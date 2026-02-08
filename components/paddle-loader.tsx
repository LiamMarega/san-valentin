"use client"

import { useEffect } from "react"
import { initializePaddle, type Paddle } from "@paddle/paddle-js"

let paddleInstance: Paddle | undefined

export function getPaddle(): Paddle | undefined {
  return paddleInstance
}

export function PaddleLoader() {
  useEffect(() => {
    initializePaddle({
      environment: "sandbox", // Cambiar a 'production' cuando salgas a vivo
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((instance: Paddle | undefined) => {
      if (instance) {
        paddleInstance = instance
        console.log("Paddle initialized")
      }
    })
  }, [])

  return null
}
