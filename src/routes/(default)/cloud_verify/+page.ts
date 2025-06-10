import { getAuthorizationHeaders, getLoginUrlWithRedirect, hasValidToken } from '$lib/auth/auth';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';
import { handleRequest } from '$lib/utilities/httpUtilities';
import { hasRole } from '$lib/states/auth.svelte';

export const load = async ({ params, url }) => {
	if (!hasValidToken(params)) {
		redirect(307, getLoginUrlWithRedirect(url.href));
	}
	if (!hasRole("staff")) {
		redirect(308, "/")
	}

	async function get_file_list() {
		if (!browser) {
			return;
		}
		try {
			return await fetch(`${PUBLIC_API_URL}/cloud/list_review_files`, {
				method: 'GET',
				headers: getAuthorizationHeaders(params)
			}).then(handleRequest);
		} catch (err) {
			console.error('Fetch error:', err);
		}
	}

	const file_list: string[] = await get_file_list();
	return { file_list: file_list };
};
