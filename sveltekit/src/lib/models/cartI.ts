import {type PaymentProviderEnum, type ProductOutI, ValidityEnum} from "$lib/models/productsI";

export interface CartSuccessI {
  checkout: CheckoutSmallI
  tracker_id: number | null
}

export interface CheckoutSmallI {
  checkout_uuid: string
  client_secret: string
  payment_provider: PaymentProviderEnum
}

export interface FailedProductError {
  // This should go in a generic exception interface somewhere
  error_nl: string
  error_en: string
}

export interface FailedProductI {
  index: number

  available: boolean
  validity: ValidityEnum

  auth_error: FailedProductError | null
  non_auth_error: FailedProductError

  product: ProductOutI
}

export interface CartFailedI {
  failed_products: FailedProductI[]
}
