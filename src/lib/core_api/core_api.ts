import type { PromoItemWideI } from '$lib/models/item/promoI';
import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { EventItemWideI } from '$lib/models/item/eventI';

export class CoreItemAPI {
	static async patchItem(item_identifier: string | number, patch_object: object) {
		const res = await fetch(`${PUBLIC_API_URL}/item/${item_identifier}`, {
			method: 'PATCH',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(patch_object)
		});
		if (res.ok) {
			return res.json();
		} else {
			throw `Failed to patch item: ${await res.text()}`;
		}
	}

	static async putItem(item_identifier: string | number, put_object: object) {
		const res = await fetch(`${PUBLIC_API_URL}/item/${item_identifier}`, {
			method: 'PUT',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(put_object)
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to put item: ${await res.text()}`;
		}
	}

	static async attachedProductBlueprintTable(item_identifier: string | number): Promise<[]> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/table?item=${item_identifier}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch product blueprints table: ${await res.text()}`;
		}
	}

	static async countSuccessCheckout(item_identifier: string | number): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/count?item=${item_identifier}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch transaction count: ${await res.text()}`;
		}
	}

	static async countSuccessTransaction(item_identifier: string | number): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/transaction/count?item=${item_identifier}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch transaction count: ${await res.text()}`;
		}
	}
}

export class CoreItemWideAPI {
	static async queryPromoItem(query_param: URLSearchParams): Promise<PromoItemWideI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/item/wide?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(null)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load vacatures: ${text}`);
		}
		return await res.json();
	}
	static async queryEventItem(query_param: URLSearchParams): Promise<EventItemWideI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/item/wide?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(null)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load events: ${text}`);
		}
		return await res.json();
	}

	static async countItemWide(query_param: URLSearchParams): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/item/count?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(null)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load count: ${text}`);
		}
		return await res.json();
	}

	static async putItem(item_identifier: string | number, patch_object: object) {
		const res = await fetch(`${PUBLIC_API_URL}/item/${item_identifier}`, {
			method: 'PUT',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(patch_object)
		});
		if (res.ok) {
			return res.json();
		} else {
			return `Failed to create flag: ${await res.text()}`;
		}
	}
}
