import { redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders, getLoginUrlWithRedirect, hasValidToken } from '$lib/auth/auth';
import type { OnkostenNotaI } from '$lib/models/onkosten/onkostennota';

export const load = async ({ fetch, params, url }) => {
	if (!hasValidToken(params)) {
		redirect(307, getLoginUrlWithRedirect(url.pathname));
	}

	try {
		return {
			onkostennotas: await fetch(`${PUBLIC_API_URL}/account/onkostennota`, {
				headers: getAuthorizationHeaders(params)
			}).then((r) => r.json() as Promise<OnkostenNotaI[]>)
		};
	} catch (error) {}
};
