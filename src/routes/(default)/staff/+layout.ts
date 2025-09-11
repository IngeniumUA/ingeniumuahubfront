import { getLoginUrlWithRedirect, hasValidToken } from '$lib/auth/auth';
import { hasRole } from '$lib/states/auth.svelte';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, url }) => {
	if (!hasValidToken(params)) {
		redirect(307, getLoginUrlWithRedirect(url.href));
	}
	if (!hasRole("staff")) {
		redirect(308, "/")
	}
	return {}
}