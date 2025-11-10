import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import { type HubCheckoutTrackerI, HubCheckoutTrackerStatusEnum } from '$lib/models/trackerI';
import type { CheckoutIWide } from '$lib/models/checkoutI';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';

export class CoreCheckoutAPI {

	static async analyseBreakdown(params: RouteParams | null = null, queryParam: URLSearchParams): Promise<Record<string, number>> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/analyse/breakdown?${queryParam.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch analyzed profits: ${await res.text()}`;
		}
	}

	static async getCheckoutWide(params: RouteParams | null = null, checkoutIdentifier: string): Promise<CheckoutIWide> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/${checkoutIdentifier}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch checkout: ${await res.text()}`;
		}
	}

	static async queryCheckoutWide(params: RouteParams | null = null, queryParam: URLSearchParams): Promise<CheckoutIWide[]> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout?${queryParam.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to query checkout: ${await res.text()}`;
		}
	}

	static async patchCheckout(params: RouteParams | null = null, checkoutIdentifier: string, patchObj: any): Promise<CheckoutIWide> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/${checkoutIdentifier}`, {
			method: 'PATCH',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(patchObj)
		});
		if (res.ok) {
			return res.json();
		} else {
			throw `Failed to patch checkout: ${await res.text()}`;
		}
	}

	static async countCheckout(params: RouteParams | null = null, query_param: URLSearchParams): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/count?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch checkout count: ${await res.text()}`;
		}
	}

	static async groupByStatus(params: RouteParams | null = null, query_param: URLSearchParams): Promise<Record<string, number>> {
		// Return is like {'0': 78, ...}
		const res = await fetch(`${PUBLIC_API_URL}/checkout/group_by?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch checkout grouped: ${await res.text()}`;
		}
	}

	static async countCheckoutTracker(params: RouteParams | null = null, query_param: URLSearchParams): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/tracker/count?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch checkout tracker count: ${await res.text()}`;
		}
	}

	static async queryCheckoutTracker(params: RouteParams | null = null, query_param: URLSearchParams): Promise<HubCheckoutTrackerI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/tracker?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch checkout trackers: ${await res.text()}`;
		}
	}

	static async groupByCheckoutTracker(params: RouteParams | null = null, query_param: URLSearchParams): Promise<Record<number, number>[]> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/tracker/group_by?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(params)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load checkout trackers: ${text}`);
		}
		return await res.json();
	}

	static async stepCheckoutTracker(params: RouteParams | null = null, trackerID: number): Promise<HubCheckoutTrackerI> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/tracker/step/${trackerID}`, {
			method: 'POST',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to step checkout tracker: ${text}`);
		}
		return await res.json();
	}

	static async setCheckoutTracker(params: RouteParams | null = null, trackerID: number, nextStatus: HubCheckoutTrackerStatusEnum): Promise<HubCheckoutTrackerI> {
		const patchObj = {
			checkout_tracker_status: nextStatus
		}
		const res = await fetch(`${PUBLIC_API_URL}/checkout/tracker/set/${trackerID}`, {
			method: 'PATCH',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(patchObj)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to step checkout tracker: ${text}`);
		}
		return await res.json();
	}

	static async sendCheckoutEmail(params: RouteParams | null = null, checkoutIdentifier: string): Promise<boolean> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/email/${checkoutIdentifier}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to send email: ${text}`);
		}
		return await res.json();
	}

	static async downloadOrderTrackers(
		params: RouteParams | null = null,
		query_param: URLSearchParams
	): Promise<void> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/tracker/export?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'text/csv' })
		});
		if (!res.ok) {
			throw new Error(`Failed to fetch checkout tracker export: ${await res.text()}`);
		}
		const blob = await res.blob();
		const url = window.URL.createObjectURL(blob);
		const contentDisposition = res.headers.get('Content-Disposition');

		const a = document.createElement('a');
		a.href = url;
		a.download = contentDisposition
			? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
			: 'checkout_trackers.csv';
		document.body.appendChild(a);

		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);
	}

	static async downloadCheckouts(
		params: RouteParams | null = null,
		query_param: URLSearchParams
	): Promise<void> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/export?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'text/csv' })
		});
		if (!res.ok) {
			throw new Error(`Failed to fetch checkouts export: ${await res.text()}`);
		}
		const blob = await res.blob();
		const url = window.URL.createObjectURL(blob);
		// Create a hidden <a> element
		const a = document.createElement('a');
		a.href = url;

		// Extract filename from Content-Disposition header OR fallback
		const contentDisposition = res.headers.get('Content-Disposition');
		a.download = contentDisposition
			? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
			: 'checkouts.csv'; // download instead of navigating
		document.body.appendChild(a);
		a.click();

		// Clean up
		a.remove();
		window.URL.revokeObjectURL(url);
	}
}