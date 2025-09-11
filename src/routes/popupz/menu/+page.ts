import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';

export const load: PageLoad = async () => {
	const res = await fetch(`${PUBLIC_API_URL}/popupz/products`, {
		method: 'GET',
		headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
	});
	const products = res.ok ? await res.json(): [];
	return { products }
}