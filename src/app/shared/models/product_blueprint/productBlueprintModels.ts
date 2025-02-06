import {
  AvailabilityCompositionI,
  AvailabilityCompositionInI
} from "@ingenium/app/shared/models/item/availabilityCompositionI";
import {PricePolicyI} from "@ingenium/app/shared/models/price_policy";
import {ProductMetaI} from "@ingenium/app/shared/models/product/products";

export interface ProductBlueprintInI {
  name: string
  description: string

  availability: AvailabilityCompositionInI

  max_total: number | null
  max_individual: number | null
  max_per_checkout: number | null

  ordering: number | null

  origin_item_id: number
}

export interface ProductBlueprintI {
  id: number
  name: string
  description: string

  last_update_timestamp: string
  created_timestamp: string

  availability: AvailabilityCompositionI

  max_total: number
  max_individual: number
  max_per_checkout: number

  ordering: number
  allow_individualised: boolean

  origin_item_id: number
  source_item_ids: number[]

  product_blueprint_pool_ids: number[]
  price_policies: PricePolicyI[]
  product_blueprint_metadata: ProductMetaI
}
