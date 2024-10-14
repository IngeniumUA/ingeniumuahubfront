import {CheckoutSmollI} from "@ingenium/app/shared/models/checkout/checkoutModels";

export interface CartSuccessI {
  checkout: CheckoutSmollI
  tracker_id: number | null
}

export interface CartFailedI {
  failed_products: any[]
}
