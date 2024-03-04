export interface StaffCardDetailI {
  id: string
  academic_year: string
  user_id: string | null
  user_email: string | null
  card_type: string
  card_nr: number
  linked_date: string | null
  last_edited: string
  card_item: string
}

export const CardTypes: string[] = [
  'lid',
  'steunend'
]
