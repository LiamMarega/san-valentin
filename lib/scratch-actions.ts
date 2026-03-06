"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import type { ScratchCard, ScratchCardFormData } from "@/lib/types"
import type { ScratchThemeId } from "@/constants/scratch-themes"

// =============================================================================
// Validation Schemas
// =============================================================================

const createScratchCardSchema = z.object({
  senderName: z.string().min(1, "El nombre del remitente es requerido").max(100),
  senderEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  receiverName: z.string().min(1, "El nombre del destinatario es requerido").max(100),
  receiverEmail: z.string().email("Email del destinatario inválido"),
  hiddenMessage: z.string().min(1, "El mensaje es requerido").max(500),
  revealMessage: z.string().max(200).optional(),
  theme: z.string(),
  isPremium: z.boolean().default(false),
  photoUrl: z.string().url().optional().or(z.literal("")),
  musicUrl: z.string().url().optional().or(z.literal("")),
})

// =============================================================================
// Server Actions
// =============================================================================

export async function createScratchCard(data: ScratchCardFormData): Promise<{ 
  success: boolean
  scratchCardId?: string
  error?: string 
}> {
  try {
    const validation = createScratchCardSchema.safeParse(data)
    
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message }
    }

    const {
      senderName,
      senderEmail,
      receiverName,
      receiverEmail,
      hiddenMessage,
      revealMessage,
      theme,
      isPremium,
      photoUrl,
      musicUrl,
    } = validation.data

    const paymentStatus = isPremium ? "pending" : "free"

    const result = await sql`
      INSERT INTO scratch_cards (
        sender_name,
        sender_email,
        receiver_name,
        receiver_email,
        hidden_message,
        reveal_message,
        theme,
        is_premium,
        photo_url,
        music_url,
        payment_status,
        status
      ) VALUES (
        ${senderName},
        ${senderEmail || null},
        ${receiverName},
        ${receiverEmail},
        ${hiddenMessage},
        ${revealMessage || null},
        ${theme},
        ${isPremium},
        ${photoUrl || null},
        ${musicUrl || null},
        ${paymentStatus},
        'pending'
      )
      RETURNING id
    `

    const scratchCardId = result[0].id

    revalidatePath("/raspadito")
    return { success: true, scratchCardId }
  } catch (error) {
    console.error("Error creating scratch card:", error)
    return { success: false, error: "Error al crear el raspadito" }
  }
}

export async function getScratchCardById(id: string): Promise<ScratchCard | null> {
  try {
    const result = await sql`
      SELECT * FROM scratch_cards WHERE id = ${id}
    `
    
    if (result.length === 0) {
      return null
    }

    return result[0] as ScratchCard
  } catch (error) {
    console.error("Error fetching scratch card:", error)
    return null
  }
}

export async function updateScratchProgress(
  id: string, 
  percentage: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE scratch_cards
      SET scratch_percentage = ${percentage}
      WHERE id = ${id}
    `
    return { success: true }
  } catch (error) {
    console.error("Error updating scratch progress:", error)
    return { success: false, error: "Error al actualizar progreso" }
  }
}

export async function markAsScratched(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE scratch_cards
      SET 
        status = 'scratched',
        scratch_percentage = 100,
        scratched_at = NOW()
      WHERE id = ${id}
    `
    revalidatePath(`/raspadito/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Error marking as scratched:", error)
    return { success: false, error: "Error al marcar como raspado" }
  }
}

export async function markAsOpened(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE scratch_cards
      SET 
        status = CASE WHEN status = 'pending' OR status = 'sent' THEN 'opened' ELSE status END,
        opened_at = COALESCE(opened_at, NOW())
      WHERE id = ${id}
    `
    return { success: true }
  } catch (error) {
    console.error("Error marking as opened:", error)
    return { success: false, error: "Error al marcar como abierto" }
  }
}

export async function updateScratchCardPayment(
  id: string,
  paymentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE scratch_cards
      SET 
        payment_status = 'paid',
        mp_payment_id = ${paymentId},
        status = 'sent'
      WHERE id = ${id}
    `
    revalidatePath(`/raspadito/${id}`)
    revalidatePath("/raspadito/exito")
    return { success: true }
  } catch (error) {
    console.error("Error updating payment:", error)
    return { success: false, error: "Error al actualizar pago" }
  }
}
