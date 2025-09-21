import { CoreItemWideAPI } from '$lib/core_api/core_api';

export async function load({ params }) {
	const itemQuery = new URLSearchParams({
		item_type: 'eventitem',
		available: 'true',
		limit: '10'
	});
	const events = await CoreItemWideAPI.queryEventItem(params, itemQuery);

	const countQuery = new URLSearchParams({
		item_type: 'eventitem',
		available: 'true'
	});
	const available_count: number = await CoreItemWideAPI.countItemWide(params, countQuery);

	const countQueryAll = new URLSearchParams({
		item_type: 'eventitem',
	});
	const total_count: number = await CoreItemWideAPI.countItemWide(params, countQueryAll);

	return { events, available_count, total_count };
}