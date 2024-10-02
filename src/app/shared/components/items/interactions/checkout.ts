import {TransactionI} from '@ingenium/app/core/services/user/account/account.service';

export interface CheckoutI {
  id: string
  date_completed: string

  amount: number
  currency: string
  description: string

  note: string | null

  transactions: TransactionI[]
}
