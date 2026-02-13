"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateSenderEmailSchema = z.object({
    letterId: z.string().uuid(),
    email: z.string().email("Email inválido"),
})

export async function updateSenderEmail(letterId: string, email: string) {
    try {
        const result = updateSenderEmailSchema.safeParse({ letterId, email })

        if (!result.success) {
            return { success: false, error: result.error.errors[0].message }
        }

        await sql`
      UPDATE letters
      SET sender_email = ${email}
      WHERE id = ${letterId}
    `

        revalidatePath("/sent")
        return { success: true }
    } catch (error) {
        console.error("Error updating sender email:", error)
        return { success: false, error: "Error al guardar el email" }
    }
}
