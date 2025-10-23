import { CoreItemAPI, CoreItemWideAPI } from '$lib/core_api/core_api';
import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';

export async function load({ params }) {
	const itemWide = await CoreItemWideAPI.getItem(params, params.item);
	const trackerCount = await CoreItemAPI.countCheckoutTracker(params, params.item);

	const query = new URLSearchParams({
		item: itemWide.item.id.toString(),
		limit: '100'
	});
	const productBlueprints = await CoreProductBlueprintAPI.queryProductBlueprints(params, query);
	const pricePoliciesTable = await CoreItemAPI.attachedPricePolicyTable(params, itemWide.item.id);

	const checkoutStatusTable = await CoreItemAPI.attachedCheckoutStatusTable(params, itemWide.item.id);
	const transactionValidityGrouped = await CoreItemAPI.attachedValidityGrouped(params, itemWide.item.id);

	return { itemWide, trackerCount, productBlueprints, pricePoliciesTable, checkoutStatusTable, transactionValidityGrouped };
}