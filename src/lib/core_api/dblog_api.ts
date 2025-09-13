import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';

export class DBLogAPI {
	static async queryCoreDBLog(queryParam: URLSearchParams): Promise<[]> {
		const res = await fetch(`${PUBLIC_API_URL}/dblog?${queryParam.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch dblogs: ${await res.text()}`;
		}
	}
}