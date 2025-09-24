import type { CheckoutIWide } from './checkoutI';

export enum HubCheckoutTrackerStatusEnum {
  Pending = 1,
  Ready = 2,
  Finished = 3,

  // UI ONLY:
  All = 10,
}

export interface HubCheckoutTrackerI {
  id: number,
  disabled: boolean,
  checkout: CheckoutIWide
  checkout_tracker_status: HubCheckoutTrackerStatusEnum

  created_timestamp: string
}

export interface PublicOrderTrackerI {
  id: number;
  checkout_tracker_status: HubCheckoutTrackerStatusEnum,
}