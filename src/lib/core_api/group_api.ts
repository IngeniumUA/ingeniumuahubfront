import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';

export class CoreGroupAPI {
	static async groupTable(): Promise<[]> {
		const res = await fetch(`${PUBLIC_API_URL}/group/table`, {
			method: 'GET',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch product blueprints table: ${await res.text()}`;
		}
	}
}