import { CoreItemWideAPI } from '$lib/core_api/core_api';

export async function load() {
	const itemQuery = new URLSearchParams({
		limit: '20'
	});
	const shopItems = await CoreItemWideAPI.queryShopItem(itemQuery);

	const countQuery = new URLSearchParams({
		item_type: 'shopitem',
		available: 'true'
	});
	const available_count: number = await CoreItemWideAPI.countItemWide(countQuery);

	const countQueryAll = new URLSearchParams({
		item_type: 'shopitem',
	});
	const total_count: number = await CoreItemWideAPI.countItemWide(countQueryAll);

	return { shopItems, available_count, total_count };
}