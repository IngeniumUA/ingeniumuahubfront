import {ProductMetaI} from "../items/products/products";

export interface StaffProductBlueprintI {
  id: number
  available: boolean
  disabled: boolean
  date_created: string
  origin_item_id: string
  source_item_ids: string[]
  product_blueprint_pools: number[]
  name: string
  description: string

  max_total: number
  max_individual: number
  max_per_checkout: number

  price_policies: []

  product_meta: ProductMetaI
}
