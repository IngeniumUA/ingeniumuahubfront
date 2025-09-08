import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';

export class CoreProductBlueprintAPI {
	static async queryProductBlueprints(query_param: URLSearchParams): Promise<[]> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(null)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load product blueprints: ${text}`);
		}
		return await res.json();
	}

	static async patchProductBlueprint(product_blueprint_identifier: string | number, patch_object: object): Promise<any> {
		const res = await fetch(`${PUBLIC_API_URL}/blueprint/${product_blueprint_identifier}`, {
			method: 'PATCH',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(patch_object)
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to put blueprint: ${await res.text()}`;
		}
	}
}