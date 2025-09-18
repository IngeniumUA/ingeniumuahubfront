import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';

export const load: PageLoad = async () => {
	const itemRes = await fetch(`${PUBLIC_API_URL}/popupz`, {
		method: 'GET',
		headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
	});
	const item = itemRes.ok ? await itemRes.json(): [];
	return { item }
}