export interface InteractionLimitedI {
  interaction_uuid: string

  item_id: number
  item_name: string

  user_email: string

  interaction_type: number
}

export interface InteractionI {
  interaction_id: number
  interaction_uuid: string

  item_id: number
  item_name: string

  user_uuid: string
  user_email: string

  interaction_type: number

  last_updated_timestamp: string
  created_timestamp: string
}