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

	static async patchCard(cardIdentifier: string, cardObj: CardI): Promise<CardI> {
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

}