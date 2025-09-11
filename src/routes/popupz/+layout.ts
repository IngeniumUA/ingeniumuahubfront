import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { PageLoad } from '../../../.svelte-kit/types/src/routes/(default)/$types';

export const load: PageLoad = async () => {
	const res = await fetch(`${PUBLIC_API_URL}/popupz`, {
		method: 'GET',
		headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
	});
	const item = res.ok ? await res.json(): [];
	return { item }
}