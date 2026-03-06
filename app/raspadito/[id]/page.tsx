import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getScratchCardById, markAsOpened } from "@/lib/scratch-actions"
import { ScratchCardViewer } from "./scratch-card-viewer"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const scratchCard = await getScratchCardById(id)

  if (!scratchCard) {
    return {
      title: "Raspadito no encontrado",
    }
  }

  return {
    title: `Raspadito de ${scratchCard.sender_name} | Valentine's Day`,
    description: `${scratchCard.receiver_name}, tienes un mensaje secreto de ${scratchCard.sender_name}. Raspa para descubrir!`,
    openGraph: {
      title: `${scratchCard.receiver_name}, tienes un raspadito!`,
      description: `${scratchCard.sender_name} te envio un mensaje secreto. Raspa para descubrirlo!`,
    },
  }
}

export default async function ScratchCardPage({ params }: Props) {
  const { id } = await params
  const scratchCard = await getScratchCardById(id)

  if (!scratchCard) {
    notFound()
  }

  // Check payment status for premium cards
  if (scratchCard.is_premium && scratchCard.payment_status !== "paid") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Raspadito pendiente
          </h1>
          <p className="text-slate-600">
            Este raspadito aun no esta disponible. El remitente debe completar el pago.
          </p>
        </div>
      </main>
    )
  }

  // Mark as opened (only first time)
  if (scratchCard.status === "pending" || scratchCard.status === "sent") {
    await markAsOpened(id)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
      <ScratchCardViewer scratchCard={scratchCard} />
    </main>
  )
}
