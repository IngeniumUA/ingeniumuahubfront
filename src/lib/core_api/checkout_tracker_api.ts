import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { HubCheckoutTrackerI } from '$lib/models/trackerI';

export class CoreCheckoutTrackerAPI {
	static async countCheckoutTracker(query_param: URLSearchParams): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/tracker/count?item=${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch checkout tracker count: ${await res.text()}`;
		}
	}

	static async queryCheckoutTracker(query_param: URLSearchParams): Promise<HubCheckoutTrackerI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/tracker?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch checkout trackers: ${await res.text()}`;
		}
	}

	static async groupByCheckoutTracker(query_param: URLSearchParams): Promise<Record<number, number>[]> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/tracker/group_by?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(null)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load checkout trackers: ${text}`);
		}
		return await res.json();
	}

	static async stepCheckoutTracker(trackerID: number): Promise<HubCheckoutTrackerI> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/tracker/step/${trackerID}`, {
			method: 'POST',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to step checkout tracker: ${text}`);
		}
		return await res.json();
	}


}