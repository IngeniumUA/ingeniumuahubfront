import type { CheckoutI } from "./checkoutI"

export enum HubCheckoutTrackerStatusEnum {
  Pending = 1,
  Ready = 2,
  Finished = 3,

  // UI ONLY:
  All = 10,
}

export interface HubCheckoutTrackerI {
  id: number,
  checkout: CheckoutI
  checkout_tracker_status: HubCheckoutTrackerStatusEnum
}

export interface PublicOrderTrackerI {
  id: number;
  checkout_tracker_status: HubCheckoutTrackerStatusEnum,
}