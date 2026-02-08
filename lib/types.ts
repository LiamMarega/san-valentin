import type { ThemeId, RelationshipType } from "@/constants/themes"

export interface LetterData {
  id: string
  sender_name: string
  receiver_name: string
  message_type: string
  response: string | null
  theme: ThemeId
  custom_content: string | null
  relationship_type: RelationshipType
  photo_url: string | null
  music_url: string | null
}
