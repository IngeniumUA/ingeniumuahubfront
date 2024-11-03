import {CheckoutSmollI} from "@ingenium/app/shared/models/payment/checkout/hubCheckoutI";

export interface CartSuccessI {
  checkout: CheckoutSmollI
  tracker_id: number | null
}

export interface CartFailedI {
  failed_products: any[]
}
