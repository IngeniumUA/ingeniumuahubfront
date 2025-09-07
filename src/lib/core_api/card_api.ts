import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { CardItemWideI } from '$lib/models/item/cardI';

export class CoreCardAPI {
	static async queryCards(query_param: URLSearchParams): Promise<CardItemWideI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/item/wide/card?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(null)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load carditems: ${text}`);
		}
		return await res.json();
	}

	static async queryCardTable(query_param: URLSearchParams): Promise<[]> {
		const res = await fetch(`${PUBLIC_API_URL}/item/wide/card/table?${query_param.toString()}`, {
			headers: getAuthorizationHeaders(null)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to load card count table: ${text}`);
		}
		return await res.json();
	}
}