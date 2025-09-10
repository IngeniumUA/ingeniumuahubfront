import type { AvailabilityCompositionI, AvailabilityCompositionInI } from '$lib/models/item/availabilityCompositionI';

export interface PricePolicyInI {
	product_blueprint_id: number
	name: string | null;

	price_eu: number,
	always_display: boolean,
	allow_invalid_access: boolean,
	allow_unauthenticated_access: boolean,

	max_valid_usages: number,

	ordering: number

	availability: AvailabilityCompositionInI | null
}

export interface PricePolicyI extends PricePolicyInI {
	id: number;

	price: number;
	availability: AvailabilityCompositionI
}