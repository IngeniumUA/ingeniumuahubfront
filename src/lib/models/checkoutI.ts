import type { TransactionLimitedI } from "./transactionI"

export interface CheckoutI {
  id: string
  date_completed: string
  amount: number
  currency: string
  description: string
  note: string | null
  transactions: TransactionLimitedI[]
}