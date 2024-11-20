import {
  AvailabilityCompositionI,
  AvailabilityCompositionInI
} from "@ingenium/app/shared/models/item/availabilityCompositionI";

export interface PricePolicyI {
  id: number
  name: string | null
  price: number

  ordering: number | null
  product_blueprint_id: number
  always_display: boolean
  allow_invalid_access: boolean
  allow_unauthenticated_access: boolean
  max_valid_usages: number

  availability: AvailabilityCompositionI
  // update_fields: { [key: string]: any } | null
}

export interface PricePolicyInI {
  name: string | null
  price_eu: number
  product_blueprint_id: number
  always_display: boolean
  allow_invalid_access: boolean
  availability: AvailabilityCompositionInI
}
