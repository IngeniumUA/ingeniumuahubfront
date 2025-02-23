import { redirect } from "@sveltejs/kit";
import { PUBLIC_API_URL } from "$env/static/public";
import { getAuthorizationHeaders, getLoginUrlWithRedirect, hasValidToken } from "$lib/auth/auth";
import type { TransactionLimitedI } from "$lib/models/transactionI";

export const load = async ({ fetch, params, url }) => {
  if (!hasValidToken(params)) {
    redirect(307, getLoginUrlWithRedirect(url.pathname));
  }

  try {
    const options = {
      headers: getAuthorizationHeaders(params),
    }

    return {
      transactions: await fetch(`${PUBLIC_API_URL}/account/transactions`, options).then(r => r.json() as Promise<TransactionLimitedI[]>),
      trackedItems: null,
    }
  } catch (error) {

  }
}