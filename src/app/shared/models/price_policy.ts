import {AvailabilityCompositionInI} from "@ingenium/app/shared/models/item/availability_composition";

export interface PricePolicyI {
  id: number
  name: string
  price: number

  product_blueprint_id: number
  always_display: boolean
  allow_invalid_access: boolean
  availability: AvailabilityCompositionInI
  // update_fields: { [key: string]: any } | null
}

export interface PricePolicyInI {
  name: string
  price_eu: number
  product_blueprint_id: number
  always_display: boolean
  allow_invalid_access: boolean
  availability: AvailabilityCompositionInI
}
