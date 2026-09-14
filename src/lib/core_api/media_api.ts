import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';

export class CoreMediaAPI {
	static async queryMediaList(params: RouteParams | null = null): Promise<string[]> {
		const res = await fetch(`${PUBLIC_API_URL}/file/media/list`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch media list: ${await res.text()}`;
		}
	}
}