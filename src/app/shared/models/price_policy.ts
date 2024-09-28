import {AccessPolicyI} from './staff/staff_access_policy';
import {AvailabilityCompositionInI} from "@ingenium/app/shared/models/item/availability_composition";

export interface PricePolicyI {
    price: number
    access_policy: AccessPolicyI
    always_available: boolean
    allow_invalid_access: boolean
    update_fields: { [key: string]: any } | null
}

export interface PricePolicyInI {
  name: string
  price_eu: number
  product_blueprint_id: number
  always_display: boolean
  allow_invalid_access: boolean
  availability: AvailabilityCompositionInI
}
