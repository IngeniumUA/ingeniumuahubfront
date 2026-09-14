import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { CardI } from '$lib/models/cardI';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';

export class CoreCardAPI {
	static async queryCards(params: RouteParams | null = null, query_param: URLSearchParams): Promise<CardI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/card?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(params)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load cards: ${text}`);
		}
		return await res.json();
	}

	static async countCards(params: RouteParams | null = null, query_param: URLSearchParams): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/card/count?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(params)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load card count: ${text}`);
		}
		return await res.json();
	}

	static async queryCardTable(params: RouteParams | null = null, query_param: URLSearchParams): Promise<[]> {
		const res = await fetch(`${PUBLIC_API_URL}/card/table?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(params)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load card count table: ${text}`);
		}
		return await res.json();
	}

	static async putCard(cardObj: CardI): Promise<CardI> {
		const res = await fetch(`${PUBLIC_API_URL}/card/${cardObj.card_uuid}`, {
			method: 'PUT',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(cardObj)
		});
		if (res.ok) {
			return res.json();
		} else {
			const text = await res.text();
			throw new Error(`Failed to PUT: ${text}`);
		}
	}

	static async patchCard(cardIdentifier: string, cardObj): Promise<CardI> {
		const res = await fetch(`${PUBLIC_API_URL}/card/${cardIdentifier}`, {
			method: 'PATCH',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(cardObj)
		});
		if (res.ok) {
			return res.json();
		} else {
			const text = await res.text();
			throw new Error(`Failed to PATCH: ${text}`);
		}
	}

	static async setAvailable(card: CardI, available: boolean) {
		const patchObj  = {
			available: available
		}
		return await this.patchCard(card.card_uuid, patchObj)
	}

	static async downloadCards(
		params: RouteParams | null = null,
		query_param: URLSearchParams
	): Promise<void> {
		const res = await fetch(`${PUBLIC_API_URL}/card/export?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'text/csv' })
		});
		if (!res.ok) {
			throw new Error(`Failed to fetch lidkaarten export: ${await res.text()}`);
		}
		const blob = await res.blob();
		const url = window.URL.createObjectURL(blob);
		// Create a hidden <a> element
		const a = document.createElement('a');
		a.href = url;

		// Extract filename from Content-Disposition header OR fallback
		const contentDisposition = res.headers.get('Content-Disposition');
		a.download = contentDisposition
			? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
			: 'lidkaarten.csv'; // download instead of navigating
		document.body.appendChild(a);
		a.click();

		// Clean up
		a.remove();
		window.URL.revokeObjectURL(url);
	}

	static async downloadCurrentCards(params: RouteParams | null = null) {
		const query_param = new URLSearchParams({
			available: 'true',
			limit: '1000',
			offset: '0',
		});
		await this.downloadCards(params, query_param)
	}
}