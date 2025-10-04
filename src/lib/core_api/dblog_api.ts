import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';
import type { DBLogExplodedI, DBLogI } from '$lib/models/dblog';

export class DBLogAPI {
	static async queryCoreDBLog(params: RouteParams | null = null, queryParam: URLSearchParams): Promise<DBLogI[]> {
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

	static async countCoreDBLog(params: RouteParams | null = null, queryParam: URLSearchParams): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/dblog/count?${queryParam.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch dblog count: ${await res.text()}`;
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

	static async downloadDblog(
		params: RouteParams | null = null,
		query_param: URLSearchParams
	): Promise<void> {
		const res = await fetch(`${PUBLIC_API_URL}/dblog/export?${query_param.toString()}`, {
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
			: 'db_logs.csv';
		document.body.appendChild(a);

		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);
	}
}