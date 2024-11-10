import {TransactionLimitedI} from "@ingenium/app/shared/models/payment/transaction/hubTransactionI";

export interface CheckoutI {
  id: string
  date_completed: string

  amount: number
  currency: string
  description: string

  note: string

  transactions: TransactionLimitedI[]
}
