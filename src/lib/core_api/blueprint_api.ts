import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { ProductBlueprintI, ProductBlueprintInI } from '$lib/models/product_blueprint/ProductBlueprintI';
import type { PricePolicyI, PricePolicyInI } from '$lib/models/product_blueprint/PricePolicyI';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';

export class CoreProductBlueprintAPI {
	static async queryProductBlueprints(params: RouteParams | null = null, query_param: URLSearchParams): Promise<ProductBlueprintI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(params)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load product blueprints: ${text}`);
		}
		return await res.json();
	}

	static async getProductBlueprint(params: RouteParams | null = null, product_blueprint_identifier: number): Promise<ProductBlueprintI> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/${product_blueprint_identifier}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to get blueprint: ${await res.text()}`;
		}
	}

	static async queryPricePolicyForBlueprint(params: RouteParams | null = null, productBlueprintId: number): Promise<PricePolicyI[]> {
		// There is no existing endpoint for querying or getting price policies
		// So .. query the blueprint and take price policies lol (if it works, it works!)
		const blueprint = await this.getProductBlueprint(params, productBlueprintId);
		return blueprint?.price_policies ?? [];
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

	static async deleteProductBlueprint(product_blueprint_identifier: string | number): Promise<void> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/${product_blueprint_identifier}`, {
			method: 'DELETE',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to delete blueprint: ${await res.text()}`;
		}
	}

	static async deletePricePolicy(price_policy_identifier: string | number): Promise<void> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/price_policy/${price_policy_identifier}`, {
			method: 'DELETE',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to delete price policy: ${await res.text()}`;
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

	static async queryProductBlueprintTable(params: RouteParams | null = null,query_param: URLSearchParams) {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/table?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch product blueprint table: ${await res.text()}`;
		}
	}

	static async queryPricePolicyTable(params: RouteParams | null = null, query_param: URLSearchParams) {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/price_policy/table?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch price policies table: ${await res.text()}`;
		}
	}

	/**
	 * Meant for staff use
	 * For example when switching the product blueprint of a transaction for a user
	 * i.e. Dropdown shouldn't have all blueprints in the system, only those linked to the give source item
	 *     
	 * @param params
	 * @param query_param
	 */
	static async queryProducts(params: RouteParams | null = null,query_param: URLSearchParams) {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/products?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch products: ${await res.text()}`;
		}
	}
}