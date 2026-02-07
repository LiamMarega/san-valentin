import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { response } = body

    if (!response) {
      return NextResponse.json({ error: "La respuesta es obligatoria" }, { status: 400 })
    }

    await sql`
      UPDATE letters SET response = ${response} WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating letter:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
