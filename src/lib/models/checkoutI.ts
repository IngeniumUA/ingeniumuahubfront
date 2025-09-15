import type { TransactionI } from './transactionI';
import { PaymentStatusEnum } from '$lib/models/enums';

export interface CheckoutI {
  id: number
  checkout_uuid: string
  date_completed: string

  amount: number
  currency: string
  checkout_status: PaymentStatusEnum

  user_uuid: string
  user_email: string | null
  user_first_name: string | null
  user_last_name: string | null

  note: string | null

  payment_provider: number
  checkout_metadata: Record<string, never>

  completed_timestamp: string
  last_updated_timestamp: string
  created_timestamp: string
}

export interface CheckoutIWide extends CheckoutI {
  transactions: TransactionI[]
}