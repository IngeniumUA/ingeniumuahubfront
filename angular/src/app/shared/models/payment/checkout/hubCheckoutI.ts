import {TransactionInI} from "@ingenium/app/shared/models/payment/transaction/hubTransactionI";
import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";
import {PaymentProviderEnum} from "@ingenium/app/shared/models/product/products";

export interface CheckoutI {
  checkout_uuid: string

  user_uuid: string
  user_email: string

  payment_provider: number

  amount: number
  note: string | null

  checkout_status: PaymentStatusEnum

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

export interface CheckoutSmollI {
  checkout_uuid: string
  client_secret: string
  payment_provider: PaymentProviderEnum
}
