import { CoreItemAPI } from '$lib/core_api/core_api';

export async function load({ params }) {
	const queryParam = new URLSearchParams({
		disabled: 'None',
		limit: '20'
	});
	const items = await CoreItemAPI.queryItem(params, queryParam);
	const itemCount = await CoreItemAPI.countItems(params, queryParam);

	return { items, itemCount };
}