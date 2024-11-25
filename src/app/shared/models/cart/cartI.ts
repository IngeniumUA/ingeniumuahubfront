import {CheckoutSmollI} from "@ingenium/app/shared/models/payment/checkout/hubCheckoutI";
import {ValidityEnum} from "@ingenium/app/shared/models/payment/transaction/validityEnum";

export interface CartSuccessI {
  checkout: CheckoutSmollI
  tracker_id: number | null
}

export interface FailedProductI {
  index: number

  available: boolean
  validity: ValidityEnum

  auth_error: object
  non_auth_error: object

  product: any
}

export interface CartFailedI {
  failed_products: FailedProductI[]
}
