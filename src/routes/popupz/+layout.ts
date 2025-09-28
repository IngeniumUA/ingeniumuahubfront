import { PUBLIC_API_URL } from '$env/static/public';
import {
	getAuthorizationHeaders,
	getTokens,
	getUserFromToken,
} from '$lib/auth/auth';
import type { PageLoad } from '../../../.svelte-kit/types/src/routes/(default)/$types';

export const load: PageLoad = async ({ params }) => {
	const res = await fetch(`${PUBLIC_API_URL}/popupz`, {
		method: 'GET',
		headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
	});
	const item = res.ok ? await res.json(): [];


	// fixme to be refactored to be generalised (and store token? Maybe?)
	let isStaff = false;
	const accessToken = getTokens(params).access_token;
	if (accessToken) {
		const user = getUserFromToken(accessToken);
		if (user.realm_access.roles.includes('staff')) {
			isStaff = true;
		}
	}
	return { item, isStaff, }
}