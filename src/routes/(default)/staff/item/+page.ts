import { CoreItemWideAPI } from '$lib/core_api/core_api';

export async function load({ params }) {
	const queryParam = new URLSearchParams({
		disabled: 'None',
		limit: '100'
	});
	const items = await CoreItemWideAPI.queryItem(params, queryParam);
	const itemCount = await CoreItemWideAPI.countItemWide(params, queryParam);

	return { items, itemCount };
}