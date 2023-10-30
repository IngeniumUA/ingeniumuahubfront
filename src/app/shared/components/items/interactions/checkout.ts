import {TransactionI} from "../../../../core/services/user/account/account.service";

export interface CheckoutI {
  date_completed: string

  amount: number
  currency: string
  description: string

  transactions: TransactionI[]
}
