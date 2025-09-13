import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
import type { HubCheckoutTrackerI } from '$lib/models/trackerI';

export async function load() {
	const query_param = new URLSearchParams({
		limit: '100'
	})
	let orders: HubCheckoutTrackerI[];
	try {
		orders = await CoreCheckoutAPI.queryCheckoutTracker(query_param);
	} catch (error) {
		console.log(error)
		orders = []
	}

	return { orders }
}