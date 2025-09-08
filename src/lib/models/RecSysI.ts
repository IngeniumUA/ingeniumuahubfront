import type { EventItemWideI } from '$lib/models/item/eventI';
import type { ShopItemWideI } from '$lib/models/item/shopI';
import type { ItemWideI } from '$lib/models/item/itemwideI';
import { hexToRGB } from '$lib/utilities/style-utilities';

export interface RecSysPreviewI {
	follow_through_link: string;
	name: string;
	date: string | null | undefined;
	color: string;
	image_square: string | null;
	image_landscape: string | null;
	preview_description: string | null;
}

export const toRecsysPreview = (input: EventItemWideI | ShopItemWideI | ItemWideI): RecSysPreviewI | null => {
	const itemType = input.derived_type.derived_type_enum;
	const hasDisplayMixin = ["eventitem", "shopitem", "promoitem"].includes(itemType);
	if (!hasDisplayMixin) {return null}

	const displayHolding = (input as EventItemWideI);

	const recsysItem: RecSysPreviewI = {
		name: displayHolding.item.name,
		follow_through_link: displayHolding.derived_type.display.follow_through_link ? displayHolding.derived_type.display.follow_through_link: `/${itemType.slice(0, itemType.length - 4)}/${displayHolding.item.name}`,
		date: null,
		color: 'rgb(255, 255, 255)',
		image_square: null,
		image_landscape: null,
		preview_description: null
	};
	recsysItem.color = hexToRGB(displayHolding.derived_type.display.color) ?? displayHolding.derived_type.display.color;
	recsysItem.preview_description = displayHolding.derived_type.display.preview_description;
	if (itemType === "eventitem") {
		recsysItem.date = displayHolding.derived_type.event_start;
	}
	return recsysItem;
};