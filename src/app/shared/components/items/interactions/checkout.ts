import {TransactionLimitedI} from "@ingenium/app/shared/models/transaction/transactionModels";

export interface CheckoutI {
  id: string
  date_completed: string

  amount: number
  currency: string
  description: string

  note: string | null

  transactions: TransactionLimitedI[]
}
