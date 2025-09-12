import { CoreCheckoutTrackerAPI } from '$lib/core_api/checkout_tracker_api';
import type { HubCheckoutTrackerI } from '$lib/models/trackerI';

export async function load() {
	const query_param = new URLSearchParams({
		limit: '100'
	})
	let orders: HubCheckoutTrackerI[];
	try {
		orders = await CoreCheckoutTrackerAPI.queryCheckoutTracker(query_param);
	} catch (error) {
		orders = []
	}

	return { orders }
}