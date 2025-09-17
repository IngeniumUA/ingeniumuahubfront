import type { PromoItemWideI } from '$lib/models/item/promoI';
import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { EventItemWideI } from '$lib/models/item/eventI';
import type { ItemWideI } from '$lib/models/item/itemwideI';
import type { ShopItemWideI } from '$lib/models/item/shopI';
import type { ProductOutI } from '$lib/models/productsI';
import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
import type { HubCheckoutTrackerI } from '$lib/models/trackerI';
import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';

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

	static async patchAvailable(item_identifier: string | number, available: boolean) {
		const patch_obj = {
			"availability": {"available": available},
		}
		return await this.patchItem(item_identifier, patch_obj)
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

	static async queryProductsForItem(item_identifier: string | number): Promise<ProductOutI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/item/products/${item_identifier}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch product for item: ${await res.text()}`;
		}
	}

	static async attachedProductBlueprintTable(item_identifier: string | number): Promise<[]> {
		const query = new URLSearchParams({
			source_item_id: item_identifier.toString(),
		});
		return await CoreProductBlueprintAPI.queryProductBlueprintTable(query);
	}

	static async attachedPricePolicyTable(params: RouteParams | null = null, item_identifier: string | number): Promise<[]> {
		const query = new URLSearchParams({
			source_item_id: item_identifier.toString(),
		});
		return await CoreProductBlueprintAPI.queryPricePolicyTable(params, query);
	}


	static async attachedCheckoutStatusTable(params: RouteParams | null = null, item_identifier: string | number): Promise<Record<string, number>> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/group_by?item=${item_identifier}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch checkout status grouped: ${await res.text()}`;
		}
	}

	static async countCheckoutTracker(params: RouteParams | null = null, item_identifier: string | number): Promise<number> {
		const query = new URLSearchParams({
			item_id: item_identifier.toString(),
		});
		return await CoreCheckoutAPI.countCheckoutTracker(params, query)
	}

	static async queryCheckoutTracker(params: RouteParams | null = null, item_identifier: string | number): Promise<HubCheckoutTrackerI[]> {
		const query = new URLSearchParams({
			item_id: item_identifier.toString(),
		});
		return await CoreCheckoutAPI.queryCheckoutTracker(params, query)
	}

	static async countSuccessCheckout(item_identifier: string | number): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/count?item=${item_identifier}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch checkout count: ${await res.text()}`;
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
	static async getItem(params: RouteParams | null = null, item_identifier: string | number): Promise<ItemWideI> {
		const res = await fetch(`${PUBLIC_API_URL}/item/wide/${item_identifier}`, {
			headers: getAuthorizationHeaders(params)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load items: ${text}`);
		}
		return await res.json();
	}

	static async queryItem(params: RouteParams | null = null, query_param: URLSearchParams): Promise<ItemWideI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/item/wide?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(params)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load items: ${text}`);
		}
		return await res.json();
	}
	static async queryShopItem(params: RouteParams | null = null, query_param: URLSearchParams): Promise<ShopItemWideI[]> {
		query_param.set("item_type", 'shopitem')
		return (await this.queryItem(params, query_param)) as ShopItemWideI[]
	}
	static async queryPromoItem(params: RouteParams | null = null, query_param: URLSearchParams): Promise<PromoItemWideI[]> {
		query_param.set("item_type", 'promoitem')
		return (await this.queryItem(params, query_param)) as PromoItemWideI[]
	}
	static async queryEventItem(params: RouteParams | null = null, query_param: URLSearchParams): Promise<EventItemWideI[]> {
		query_param.set("item_type", 'eventitem');
		return (await this.queryItem(params, query_param)) as EventItemWideI[]
	}

	static async countItemWide(params: RouteParams | null = null, query_param: URLSearchParams): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/item/count?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(params)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load count: ${text}`);
		}
		return await res.json();
	}

	static async putItem(item_identifier: string | number, patch_object: object) {
		const res = await fetch(`${PUBLIC_API_URL}/item/wide/${item_identifier}`, {
			method: 'PUT',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(patch_object)
		});
		if (res.ok) {
			return res.json();
		} else {
			const text = await res.text();
			throw new Error(`Failed to load items: ${text}`);
		}
	}

	static async postItem(post_object: object) {
		const res = await fetch(`${PUBLIC_API_URL}/item/wide`, {
			method: 'POST',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(post_object)
		});
		if (res.ok) {
			return res.json();
		} else {
			throw await res.json();
		}
	}
}
