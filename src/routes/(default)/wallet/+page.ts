import { redirect } from "@sveltejs/kit";
import { handleRequest } from "$lib/utilities/httpUtilities";
import { PUBLIC_API_URL } from "$env/static/public";
import { getAuthorizationHeaders } from "$lib/auth/auth";
import type { PageLoad } from '../../../.svelte-kit/types/src/routes/$types';

export const load: PageLoad = async ({ params, url, fetch }) => {
	try {
		const platform = url.searchParams.get('platform');
		const uuid = url.searchParams.get('transaction_uuid');
		const number = url.searchParams.get('nummer');
		const location = url.searchParams.get('locatie_naam');

		// If any of these values are null, redirect to the homepage
		if (!platform || !uuid || !number || !location) {
			return redirect(307, '/');
		}

		const redirectUrl: string = await fetch(
			`${PUBLIC_API_URL}/account/wallet/${platform}?transaction_uuid=${uuid}&nummer=${number}&locatie_naam=${location}`,
			{
				method: 'GET',
				headers: getAuthorizationHeaders(params),
			}
		).then(handleRequest);

		return redirect(302, redirectUrl);
	} catch (e: any) {
		if (e.status === 302) { // This is really vague that there are two ways to redirect.
			return redirect(302, e.location || '/');
		}

		return redirect(307, '/');
	}
}