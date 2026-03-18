import type { AvailabilityCompositionI } from '$lib/models/item/availabilityCompositionI';
import type { PricePolicyI } from '$lib/models/product_blueprint/PricePolicyI';

export interface ProductBlueprintInI {
	name: string
	description: string

	max_total: number
	max_individual: number
	max_per_checkout: number

	ordering: number

	origin_item_id: number
}

export interface UponCompletionMetaData {
	track_checkout: object | null | undefined // fixme
	add_to_group: string | null | undefined
}

export interface ProductBlueprintMetaDataI {
	categorie: string | null
	group: string | null
	upon_completion: UponCompletionMetaData | null
	other_meta_data: object
}

export interface ProductBlueprintI extends ProductBlueprintInI {
	id: number

	last_update_timestamp: string
	created_timestamp: string

	availability: AvailabilityCompositionI

	source_item_ids: number[]
	price_policies: PricePolicyI[]
	product_blueprint_metadata: ProductBlueprintMetaDataI
}