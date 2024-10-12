import {
  AvailabilityCompositionI,
  AvailabilityCompositionInI
} from "@ingenium/app/shared/models/item/availability_composition";
import {PricePolicyI} from "@ingenium/app/shared/models/price_policy";

export interface ProductBlueprintInI {
  name: string
  description: string

  availability: AvailabilityCompositionInI

  max_total: number | null
  max_individual: number | null
  max_per_checkout: number | null

  ordering: number | null

  origin_item_id: number
  source_item_ids: number | null

  product_blueprint_metadata: object | null
}

export interface ProductBlueprintI {
  id: number
  name: string
  description: string

  last_updated_timestamp: string
  created_timestamp: string

  availability: AvailabilityCompositionI

  max_total: number
  max_individual: number
  max_per_checkout: number

  ordering: number

  origin_item_id: number
  source_item_ids: number

  price_policies: PricePolicyI
  product_blueprint_metadata: object
}
