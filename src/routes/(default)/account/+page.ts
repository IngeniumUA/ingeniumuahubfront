import { PUBLIC_API_URL } from "$env/static/public";
import { getAuthorizationHeaders, getLoginUrlWithRedirect, hasValidToken } from "$lib/auth/auth";
import { redirect } from "@sveltejs/kit";
import { handleRequest } from "$lib/utilities/httpUtilities";

export const load = async ({ fetch, params, url }) => {
  if (!hasValidToken(params)) {
    redirect(307, getLoginUrlWithRedirect(url.pathname));
  }

  try {
    const options = {
      headers: getAuthorizationHeaders(params),
    }

    return {
      account: fetch(`${PUBLIC_API_URL}/account`, options).then(handleRequest),
      memberCard: fetch(`${PUBLIC_API_URL}/account/card`, options).then(handleRequest),
    }
  } catch (error) {

  }
}