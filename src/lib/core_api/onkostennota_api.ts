import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';
import type { OnkostenNotaI } from '$lib/models/onkosten/onkostennota';
import type { GroupI } from '$lib/models/user/GroupI';

export class CoreOnkostenNotaAPI {
	static async postOnkostennota(
		params: RouteParams | null = null,
		postGroup: Partial<GroupI>
	): Promise<GroupI> {
		const res = await fetch(`${PUBLIC_API_URL}/onkostennota`, {
			method: 'POST',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(postGroup)
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to post onkostennota: ${await res.text()}`;
		}
	}

	/**
	 * Uploads one receipt for a nota. `onkostenIdentifier` is O<volgnummer, 4 digits>_Onkostennota_<voornaam>_<naam>
	 * (letters and hyphens only), the same as the PDF file name without extension.
	 * Resolves with the blob url.
	 */
	static async uploadMedia(
		params: RouteParams | null = null,
		onkostenIdentifier: string,
		file: Blob,
		filename: string
	): Promise<string> {
		const body = new FormData();
		body.append('blob_data', file, filename);
		// No Content-Type here: the browser has to set the multipart boundary itself.
		const res = await fetch(`${PUBLIC_API_URL}/file/onkosten/${onkostenIdentifier}`, {
			method: 'POST',
			headers: getAuthorizationHeaders(params, {}),
			body
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to upload media: ${await res.text()}`;
		}
	}

	static async queryOnkostenNota(
		params: RouteParams | null = null,
		queryParam: URLSearchParams
	): Promise<OnkostenNotaI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/onkostennota?${queryParam.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch dblogs: ${await res.text()}`;
		}
	}

	static async countOnkostenNota(
		params: RouteParams | null = null,
		queryParam: URLSearchParams
	): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/onkostennota/count?${queryParam.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch dblog count: ${await res.text()}`;
		}
	}

	static async queryMediaList(params: RouteParams | null = null): Promise<[]> {
		const res = await fetch(`${PUBLIC_API_URL}/file/onkosten/list`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch media list: ${await res.text()}`;
		}
	}

	static async downloadOnkostenTable(
		params: RouteParams | null = null,
		query_param: URLSearchParams
	): Promise<void> {
		const res = await fetch(`${PUBLIC_API_URL}/onkostennota/export?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'text/csv' })
		});
		if (!res.ok) {
			throw new Error(`Failed to fetch onkostennota export: ${await res.text()}`);
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
