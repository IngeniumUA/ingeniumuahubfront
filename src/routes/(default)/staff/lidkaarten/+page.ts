import { CoreCardAPI } from '$lib/core_api/card_api';


export async function load({ params }) {
	const card_table = await CoreCardAPI.queryCardTable(params, new URLSearchParams({}));
	const cards = await CoreCardAPI.queryCards(params, new URLSearchParams({
		limit: '300',
	}));

	const cardCountAvailable = await CoreCardAPI.countCards(params, new URLSearchParams({
		available: 'true',
	}));
	const cardCountNotAvailable = await CoreCardAPI.countCards(params, new URLSearchParams({
		available: 'true',
	}));
	const cardCount = cardCountAvailable + cardCountNotAvailable;
	return { cards, card_table, cardCountAvailable, cardCountNotAvailable, cardCount };
}