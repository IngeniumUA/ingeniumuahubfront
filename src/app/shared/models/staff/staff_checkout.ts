import {StaffCreateTransactionI} from "./staff_transaction";

export interface StaffCheckoutI {
  id: string

  user_id: string
  user_email: string

  amount: number
  currency: string
  description: string

  status: string

  date_created: string
  date_completed: string

  payment_providor: string
}

export interface StaffCheckoutPatchI {
  status: string | null
}

export interface StaffCreateCheckoutI {
  user: string
  payment_providor: string
  transactions: StaffCreateTransactionI[]
}
