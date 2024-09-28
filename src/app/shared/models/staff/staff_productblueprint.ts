import {ProductMetaI} from '../items/products/products';
import {PricePolicyI} from '../price_policy';
import {AvailabilityCompositionI} from "@ingenium/app/shared/models/item/availability_composition";

export interface StaffProductBlueprintI {
  id: number

  availability: AvailabilityCompositionI

  date_created: string
  origin_item_id: string
  source_item_ids: string[]
  product_blueprint_pools: number[]
  name: string
  description: string

  max_total: number
  max_individual: number
  max_per_checkout: number

  ordering: number

  price_policies: PricePolicyI[]

  product_blueprint_metadata: ProductMetaI
}
