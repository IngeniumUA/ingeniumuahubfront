import { CoreCardAPI } from '$lib/core_api/card_api';


export async function load() {
	const card_table = await CoreCardAPI.queryCardTable(new URLSearchParams({}));
	const cards = await CoreCardAPI.queryCards(new URLSearchParams({
		limit: '100',
	}));
	return { cards, card_table };
}