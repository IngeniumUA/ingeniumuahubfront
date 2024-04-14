import {CheckoutI} from "@ingenium/app/shared/components/items/interactions/checkout";

export interface HubCheckoutTrackerI {
  id: number,
  checkout: CheckoutI
  tracker_status: number
}
