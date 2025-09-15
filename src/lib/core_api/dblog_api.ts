import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';
import type { DBLogExplodedI } from '$lib/models/dblog';

export class DBLogAPI {
	static async queryCoreDBLog(params: RouteParams | null = null, queryParam: URLSearchParams): Promise<[]> {
		const res = await fetch(`${PUBLIC_API_URL}/dblog?${queryParam.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch dblogs: ${await res.text()}`;
		}
	}

	static async queryCoreDBLogExploded(params: RouteParams | null = null, queryParam: URLSearchParams): Promise<DBLogExplodedI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/dblog/explode?${queryParam.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch exploded dblogs: ${await res.text()}`;
		}
	}
}