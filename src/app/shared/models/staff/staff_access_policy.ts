export interface StaffAccessPolicyI {
  id: number
  method: string
  content: object
  is_disabled: boolean
  name: string
  description: string
}

export interface AccessPolicyI {
  method: string
  content: object
}
