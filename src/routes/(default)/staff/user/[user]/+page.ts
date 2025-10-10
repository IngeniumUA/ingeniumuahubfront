import { CoreCardAPI } from '$lib/core_api/card_api';
import { CoreUserAPI } from '$lib/core_api/user_api';

export async function load({ params }) {
	const cards = await CoreCardAPI.queryCards(params, new URLSearchParams({
		limit: '300',
	}));
	const userWide = await CoreUserAPI.getUserWide(params, params.user)
	const checkoutTrackers = await CoreUserAPI.queryCheckoutTracker(params, params.user)
	const keycloakUser = null // todo -> only when manager

	return { userWide, keycloakUser, cards, checkoutTrackers };
}