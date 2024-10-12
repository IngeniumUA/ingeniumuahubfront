import {TransactionInI} from "@ingenium/app/shared/models/transaction/transaction_models";

export interface CheckoutI {
  checkout_uuid: string

  user_uuid: string
  user_email: string

  payment_provider: number

  amount: number
  note: string | null

  completed_timestamp: string | null
  last_updated_timestamp: string
  created_timestamp: string
}

export interface CheckoutInI {
  user_email: string;
  payment_provider: number

  transactions: TransactionInI[]
  note: number | null
}

export interface CheckoutPatchI {
  checkout_status: number
}
