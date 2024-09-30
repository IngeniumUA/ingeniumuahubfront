import {CheckoutI} from "@ingenium/app/shared/components/items/interactions/checkout";

export enum TrackerStatusEnum {
  Pending = 1,
  Ready = 2,
  Finished = 3,
}

export interface HubCheckoutTrackerI {
  id: number,
  checkout: CheckoutI
  checkout_tracker_status: TrackerStatusEnum
}
