import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { handleRequest } from "$lib/utilities/httpUtilities";
import { PUBLIC_API_URL } from "$env/static/public";
import { getAuthorizationHeaders } from "$lib/auth/auth";

export const load: PageServerLoad = async ({ params, url, fetch }) => {
  try {
    const platform = url.searchParams.get('platform');
    const transaction_uuid = url.searchParams.get('transaction_uuid');

    // If any of these values are null, redirect to the homepage
    if (!platform || !transaction_uuid) {
      return redirect(307, '/');
    }

		if (platform === "google") {
			const redirectUrl: string = await fetch(`${PUBLIC_API_URL}/account/wallet/${platform}?transaction_uuid=${transaction_uuid}`,
			{
				method: "GET",
				headers: getAuthorizationHeaders(params),
			}).then(handleRequest);

			return redirect(302, redirectUrl);
		}

		// APPLE WALLET → pass data to +page.svelte for download
		if (platform === "apple") {
			return {
				platform,
				transaction_uuid,
			};
		}

  } catch (e: any) {
		if (e.status === 302) { // This is really vague that there are two ways to redirect.
			return redirect(302, e.location || '/');
			}
	return redirect(307, '/'); }
}