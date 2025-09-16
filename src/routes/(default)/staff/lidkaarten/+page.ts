import { CoreCardAPI } from '$lib/core_api/card_api';


export async function load({ params }) {
	const card_table = await CoreCardAPI.queryCardTable(params, new URLSearchParams({}));
	const cards = await CoreCardAPI.queryCards(params, new URLSearchParams({
		limit: '100',
	}));
	return { cards, card_table };
}