import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';
import type { OnkostenNotaI, OnkostenNotaWideI } from '$lib/models/onkosten/onkostennota';
import type { GroupI } from '$lib/models/user/GroupI';

export class CoreOnkostenNotaAPI {
	static async getOnkostennota(
		params: RouteParams | null = null,
		volgnummer: number
	): Promise<OnkostenNotaWideI> {
		const res = await fetch(`${PUBLIC_API_URL}/onkostennota/${volgnummer}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to get onkostennota: ${await res.text()}`;
		}
	}

	static async putOnkostennota(
		params: RouteParams | null = null,
		volgnummer: number,
		putOnkostenNota: OnkostenNotaWideI
	): Promise<OnkostenNotaWideI> {
		const res = await fetch(`${PUBLIC_API_URL}/onkostennota/${volgnummer}`, {
			method: 'PUT',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(putOnkostenNota)
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to put onkostennota: ${await res.text()}`;
		}
	}

	static async postOnkostennota(
		params: RouteParams | null = null,
		postGroup: Partial<OnkostenNotaI>,
		update_account_info: boolean = false
	): Promise<GroupI> {
		const queryParam = new URLSearchParams({
			update_account_info: update_account_info.toString()
		});
		const res = await fetch(`${PUBLIC_API_URL}/onkostennota?${queryParam.toString()}`, {
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

	/**
	 */
	static async uploadSignature(
		params: RouteParams | null = null,
		onkostenIdentifier: string,
		file: Blob
	): Promise<string> {
		const body = new FormData();
		body.append('blob_data', file, 'signature');
		// No Content-Type here: the browser has to set the multipart boundary itself.
		const res = await fetch(`${PUBLIC_API_URL}/onkostennota/signature/${onkostenIdentifier}`, {
			method: 'PUT',
			headers: getAuthorizationHeaders(params, {}),
			body
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to upload media: ${await res.text()}`;
		}
	}

	/** The stored signature image, or null when the nota has none yet (404). */
	static async fetchSignature(
		params: RouteParams | null = null,
		onkostenIdentifier: string
	): Promise<Blob | null> {
		const res = await fetch(`${PUBLIC_API_URL}/onkostennota/${onkostenIdentifier}/signature`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, {})
		});
		if (res.status === 404) return null;
		if (res.ok) {
			return await res.blob();
		} else {
			throw `Failed to fetch signature: ${await res.text()}`;
		}
	}

	static async fetchMedia(
		params: RouteParams | null = null,
		onkostenIdentifier: string,
		filename: string
	): Promise<Blob> {
		const fileName = filename.split('/').pop() ?? filename;
		const res = await fetch(
			`${PUBLIC_API_URL}/file/onkosten/${onkostenIdentifier}/${encodeURIComponent(fileName)}`,
			{
				method: 'GET',
				headers: getAuthorizationHeaders(params, {})
			}
		);
		if (res.ok) {
			return await res.blob();
		} else {
			throw `Failed to fetch media: ${await res.text()}`;
		}
	}
}
