import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getScratchCardById } from "@/lib/scratch-actions"
import { SuccessContent } from "./success-content"

export const metadata: Metadata = {
  title: "Raspadito Creado | Valentine's Day Letter",
  description: "Tu raspadito de amor fue creado exitosamente. Comparte el link con esa persona especial.",
}

interface Props {
  searchParams: Promise<{ id?: string; payment?: string }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const { id, payment } = await searchParams

  if (!id) {
    redirect("/raspadito")
  }

  const scratchCard = await getScratchCardById(id)

  if (!scratchCard) {
    redirect("/raspadito")
  }

  // Check if premium card is paid
  if (scratchCard.is_premium && scratchCard.payment_status !== "paid" && payment !== "pending") {
    redirect("/raspadito")
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://www.valentinedayletter.com"}/raspadito/${id}`

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
      <SuccessContent
        scratchCard={scratchCard}
        shareUrl={shareUrl}
        isPending={payment === "pending"}
      />
    </main>
  )
}
