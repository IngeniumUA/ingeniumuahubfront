import { CoreItemWideAPI } from '$lib/core_api/core_api';

export async function load({ params }) {
	const itemQuery = new URLSearchParams({
		available: 'true',
		limit: '10'
	});
	const shopItems = await CoreItemWideAPI.queryShopItem(params, itemQuery);

	const countQuery = new URLSearchParams({
		item_type: 'shopitem',
		available: 'true'
	});
	const available_count: number = await CoreItemWideAPI.countItemWide(params, countQuery);

	const countQueryAll = new URLSearchParams({
		item_type: 'shopitem',
	});
	const total_count: number = await CoreItemWideAPI.countItemWide(params, countQueryAll);

	return { shopItems, available_count, total_count };
}