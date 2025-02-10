import type {PaymentProviderEnum} from "$lib/models/productsI";

export interface CartSuccessI {
  checkout: CheckoutSmallI
  tracker_id: number | null
}

export interface CheckoutSmallI {
  checkout_uuid: string
  client_secret: string
  payment_provider: PaymentProviderEnum
}