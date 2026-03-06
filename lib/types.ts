import type { ThemeId, RelationshipType } from "@/constants/themes"
import type { ScratchThemeId } from "@/constants/scratch-themes"

// =============================================================================
// Scratch Card Types
// =============================================================================

export interface ScratchCard {
  id: string
  sender_name: string
  sender_email: string | null
  receiver_name: string
  receiver_email: string
  hidden_message: string
  reveal_message: string | null
  theme: ScratchThemeId
  custom_cover_url: string | null
  is_premium: boolean
  photo_url: string | null
  music_url: string | null
  scheduled_at: string | null
  timezone: string
  status: 'pending' | 'sent' | 'opened' | 'scratched'
  scratch_percentage: number
  scratched_at: string | null
  opened_at: string | null
  payment_status: 'free' | 'pending' | 'paid'
  payment_method: string | null
  mp_payment_id: string | null
  email_provider: string | null
  created_at: string
}

export interface ScratchCardFormData {
  senderName: string
  senderEmail?: string
  receiverName: string
  receiverEmail: string
  hiddenMessage: string
  revealMessage?: string
  theme: ScratchThemeId
  isPremium: boolean
  photoUrl?: string
  musicUrl?: string
  scheduledAt?: Date
}

// =============================================================================
// Letter Types
// =============================================================================

export interface LetterData {
  id: string
  sender_name: string
  receiver_name: string
  receiver_email: string
  message_type: string
  response: string | null
  theme: ThemeId
  custom_content: string | null
  relationship_type: RelationshipType
  photo_url: string | null
  music_url: string | null
  is_premium: boolean
  payment_status: "free" | "pending" | "paid"
  mp_payment_id: string | null
}
