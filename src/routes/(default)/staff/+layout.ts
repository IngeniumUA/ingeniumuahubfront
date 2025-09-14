import { getLoginUrlWithRedirect, getTokens, getUserFromToken, hasValidToken } from '$lib/auth/auth';
import { redirect } from '@sveltejs/kit';

export const ssr = false;

export const load = async ({ params, url }) => {
	if (!hasValidToken(params)) {
		redirect(307, getLoginUrlWithRedirect(url.href));
	}

	// fixme to be refactored to be generalised (and store token? Maybe?)
	const accessToken = getTokens(params).access_token;
	if (!accessToken) {
		redirect(308, "");
	}
	const user = getUserFromToken(accessToken);
	if (!user.realm_access.roles.includes('staff')) {
		redirect(308, "");
	}

	return {}
}