import {CheckoutSmollI} from "@ingenium/app/shared/models/payment/checkout/hubCheckoutI";
import {ValidityEnum} from "@ingenium/app/shared/models/payment/transaction/validityEnum";
import {ProductOutI} from "@ingenium/app/shared/models/product/products";

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

  product: ProductOutI
}

export interface CartFailedI {
  failed_products: FailedProductI[]
}
