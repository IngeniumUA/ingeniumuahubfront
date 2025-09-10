import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { ProductBlueprintI, ProductBlueprintInI } from '$lib/models/product_blueprint/ProductBlueprintI';
import type { PricePolicyI, PricePolicyInI } from '$lib/models/product_blueprint/PricePolicyI';

export class CoreProductBlueprintAPI {
	static async queryProductBlueprints(query_param: URLSearchParams): Promise<ProductBlueprintI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(null)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load product blueprints: ${text}`);
		}
		return await res.json();
	}

	static async patchProductBlueprint(product_blueprint_identifier: string | number, patch_object: object): Promise<ProductBlueprintI> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/${product_blueprint_identifier}`, {
			method: 'PATCH',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(patch_object)
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to patch blueprint: ${await res.text()}`;
		}
	}

	static async putProductBlueprint(putObject: ProductBlueprintI): Promise<ProductBlueprintI> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/${putObject.id}`, {
			method: 'PUT',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(putObject)
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to put blueprint: ${await res.text()}`;
		}
	}

	static async postBlueprint(post_object: ProductBlueprintInI): Promise<ProductBlueprintI> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint`, {
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

	static async postPricePolicy(post_object: PricePolicyInI) {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/price_policy`, {
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

	static async putPricePolicy(put_object: PricePolicyI): Promise<PricePolicyI> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/price_policy/${put_object.id}`, {
			method: 'PUT',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(put_object)
		});
		if (res.ok) {
			return res.json();
		} else {
			throw await res.json();
		}
	}

	static async patchPricePolicy(pricePolicyId: number, patch_object: any): Promise<PricePolicyI> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/price_policy/${pricePolicyId}`, {
			method: 'PATCH',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(patch_object)
		});
		if (res.ok) {
			return res.json();
		} else {
			throw await res.json();
		}
	}
	
	static async patchAvailablePricePolicy(pricePolicyId: number, available: boolean): Promise<PricePolicyI> {
		const patchObj = {
			"availability": {
				"available": available
			}
		}
		return await this.patchPricePolicy(pricePolicyId, patchObj);
	}
}