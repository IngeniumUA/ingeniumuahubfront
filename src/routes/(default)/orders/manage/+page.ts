import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
import type { HubCheckoutTrackerI } from '$lib/models/trackerI';
import {
	getAuthorizationHeaders,
	getLoginUrlWithRedirect,
	getTokens,
	getUserFromToken,
	hasValidToken
} from '$lib/auth/auth';
import { redirect } from '@sveltejs/kit';
import { CoreFlagAPI } from '$lib/core_api/flag_api';
import { PUBLIC_API_URL } from '$env/static/public';

export async function load({ params, url }) {
	if (!hasValidToken(params)) {
		redirect(307, getLoginUrlWithRedirect(url.href));
	}

	// fixme to be refactored to be generalised (and store token? Maybe?)
	const accessToken = getTokens(params).access_token;
	if (!accessToken) {
		redirect(308, "");
	}
	const user = getUserFromToken(accessToken);
	if (!user.realm_access.roles.includes('staff')) {
		redirect(308, "");
	}

	const query_param = new URLSearchParams({
		limit: '100'
	})
	let orders: HubCheckoutTrackerI[];
	try {
		orders = await CoreCheckoutAPI.queryCheckoutTracker(params, query_param);
	} catch (error) {
		console.log(error)
		orders = []
	}

	let publicCheckoutEnabled: boolean = false;
	try {
		const flag = await CoreFlagAPI.getFlag(params, "popupz_shop_enabled");
		if (flag !== null) {
			publicCheckoutEnabled = (flag.value as boolean);
		}
	} catch (error) {
		console.log(error)
		orders = []
	}

	const doRefresh = url.searchParams.get('refresh') === 'true'
	const filterStatus = url.searchParams.get('filter')

	const itemRes = await fetch(`${PUBLIC_API_URL}/popupz`, {
		method: 'GET',
		headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
	});
	const item = itemRes.ok ? await itemRes.json(): [];

	return { orders, publicCheckoutEnabled, doRefresh, filterStatus, item }
}