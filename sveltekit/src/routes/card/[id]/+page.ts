import { redirect } from "@sveltejs/kit";
import { PUBLIC_API_URL } from "$env/static/public";
import { getAuthorizationHeaders, getLoginUrlWithRedirect, hasValidToken } from "$lib/auth/auth";
import { handleRequest } from "$lib/utilities/httpUtilities";
import type { CardItemWideLimitedI } from "$lib/models/item/cardI";

export const load = async ({ fetch, params, url }) => {
  if (!hasValidToken(params)) {
    redirect(307, getLoginUrlWithRedirect(url.pathname));
  }

  // Get the card id
  const cardId = params.id;

  try {
    const card = await fetch(`${PUBLIC_API_URL}/card/${cardId}`, {
      headers: getAuthorizationHeaders(params),
    }).then(handleRequest) as CardItemWideLimitedI;

    redirect(307, "/account?link_status=success");
  } catch (error) {
    console.error(error);
    redirect(307, "/account?link_status=error");
  }
}