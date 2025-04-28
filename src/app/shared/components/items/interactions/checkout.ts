import {TransactionLimitedI} from "@ingenium/app/shared/models/payment/transaction/hubTransactionI";

export interface CheckoutI {
  id: string

  user_uuid: string
  user_email: string
  user_first_name: string
  user_last_name: string

  date_completed: string

  amount: number
  currency: string
  description: string

  note: string | null

  transactions: TransactionLimitedI[]
}
