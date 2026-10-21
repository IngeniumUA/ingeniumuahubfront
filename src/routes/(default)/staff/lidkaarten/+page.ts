import { CoreCardAPI } from '$lib/core_api/card_api';


export async function load({ params }) {
	const card_table = await CoreCardAPI.queryCardTable(
		params,
		new URLSearchParams({
			available: 'true'
		})
	);
	const cards = await CoreCardAPI.queryCards(
		params,
		new URLSearchParams({
			limit: '100',
			available: 'true'
		})
	);
	const cardCount = await CoreCardAPI.countCards(params, new URLSearchParams({
		available: 'true',
	}));
	return { cards, card_table, cardCount };
}