import {PUBLIC_API_URL} from "$env/static/public";
import {getAuthorizationHeaders} from "$lib/auth/auth";

export const load = async ({ fetch, params }) => {
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