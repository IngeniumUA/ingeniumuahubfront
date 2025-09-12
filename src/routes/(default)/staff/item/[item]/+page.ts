import { CoreItemAPI, CoreItemWideAPI } from '$lib/core_api/core_api';
import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';

export async function load({ params }) {
	const itemWide = await CoreItemWideAPI.getItem(params.item);
	const trackerCount = await CoreItemAPI.countCheckoutTracker(params.item);
	const trackers = await CoreItemAPI.queryCheckoutTracker(params.item);

	const query = new URLSearchParams({
		item: itemWide.item.id.toString(),
		limit: '100'
	});
	const productBlueprints = await CoreProductBlueprintAPI.queryProductBlueprints(query);
	const pricePoliciesTable = await CoreItemAPI.attachedPricePolicyTable(itemWide.item.id);

	const checkoutStatusTable = await CoreItemAPI.attachedCheckoutStatusTable(itemWide.item.id);

	return { itemWide, trackerCount, productBlueprints, pricePoliciesTable, checkoutStatusTable, trackers };
}