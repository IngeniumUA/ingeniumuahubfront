import type { EventItemWideI } from '$lib/models/item/eventI';
import type { ShopItemWideI } from '$lib/models/item/shopI';

export interface RecSysPreviewI {
	follow_through_link: string;
	name: string;
	date: string | null | undefined;
	color: string;
	image_square: string | null;
	image_landscape: string | null;
	preview_description: string | null;
}

export const toRecsysPreview = (input: EventItemWideI | ShopItemWideI): RecSysPreviewI => {
    return {
		follow_through_link: input.derived_type.display.follow_through_link,
		name: input.item.name,
		date: '',
		color: input.derived_type.display.color,
		image_square: input.derived_type.display.image_square,
		image_landscape: input.derived_type.display.image_landscape,
		preview_description: input.derived_type.display.preview_description
	};
};