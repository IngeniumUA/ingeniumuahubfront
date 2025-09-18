import type { AvailabilityCompositionI } from '$lib/models/item/availabilityCompositionI';

export interface CardLimitedI {
	card_uuid: string
	card_nr: number
	member_type: number
	card_type: number
	user_email: string | null
}

export interface CardI extends CardLimitedI {
	availability: AvailabilityCompositionI
	created_timestamp: string
	last_update_timestamp: string
	user_uuid: string | null
	linked_group: string | null
}