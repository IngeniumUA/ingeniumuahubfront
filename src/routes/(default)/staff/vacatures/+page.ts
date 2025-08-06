import type { PromoItemWideI } from '$lib/models/item/promoI';
import { CoreItemWideAPI } from '$lib/core_api/core_api';

export async function load() {
	const query = new URLSearchParams({
		item_type: 'promoitem',
		limit: '100'
	});
	const total_vacatures_count: number = await CoreItemWideAPI.countItemWide(query);
	query.set('available', 'true');
	const vacatures: PromoItemWideI[] = await CoreItemWideAPI.queryPromoItem(query);
	const available_vacatures_count: number = await CoreItemWideAPI.countItemWide(query);

	return { vacatures, available_vacatures_count, total_vacatures_count };
}