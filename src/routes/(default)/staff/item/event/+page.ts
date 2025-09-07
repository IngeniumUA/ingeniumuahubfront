import { CoreItemWideAPI } from '$lib/core_api/core_api';

export async function load() {
	const itemQuery = new URLSearchParams({
		item_type: 'eventitem',
		limit: '20'
	});
	const events = await CoreItemWideAPI.queryEventItem(itemQuery);

	const countQuery = new URLSearchParams({
		item_type: 'eventitem',
		available: 'true'
	});
	const available_count: number = await CoreItemWideAPI.countItemWide(countQuery);

	const countQueryAll = new URLSearchParams({
		item_type: 'eventitem',
	});
	const total_count: number = await CoreItemWideAPI.countItemWide(countQueryAll);

	return { events, available_count, total_count };
}