import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { HubFlag } from '$lib/models/flag/HubFlagI';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';

export class CoreFlagAPI {
	static async queryFlag(query_param: URLSearchParams): Promise<HubFlag[]> {
		const res = await fetch(`${PUBLIC_API_URL}/flag?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(null)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load flags: ${text}`);
		}
		return await res.json();
	}

	static async getFlag(params: RouteParams | null = null, flagIdentifier: string): Promise<HubFlag> {
		const res = await fetch(`${PUBLIC_API_URL}/flag/${flagIdentifier}`, {
			headers: getAuthorizationHeaders(params)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load flag: ${text}`);
		}
		return await res.json();
	}

	static async patchFlag(flag_identifier: string | number, patch_object: object): Promise<HubFlag> {
		const res = await fetch(`${PUBLIC_API_URL}/flag/${flag_identifier}`, {
			method: 'PATCH',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(patch_object)
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to put flag: ${await res.text()}`;
		}
	}
}