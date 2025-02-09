import {PUBLIC_API_URL} from "$env/static/public";
import {getAuthorizationHeaders, getLoginUrlWithRedirect, hasValidToken} from "$lib/auth/auth";
import {redirect} from "@sveltejs/kit";

export const load = async ({ fetch, params, url }) => {
  if (!hasValidToken(params)) {
    redirect(307, getLoginUrlWithRedirect(url.pathname));
  }

  try {
    const options = {
      headers: getAuthorizationHeaders(params),
    }

    return {
      account: fetch(`${PUBLIC_API_URL}/account`, options).then(r => r.json()),
      memberCard: fetch(`${PUBLIC_API_URL}/account/card`, options).then(r => r.json()),
    }
  } catch (error) {

  }
}