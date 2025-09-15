import { redirect } from "@sveltejs/kit";
import { PUBLIC_API_URL } from "$env/static/public";
import { getAuthorizationHeaders, hasValidToken } from "$lib/auth/auth";
import { handleRequest } from "$lib/utilities/httpUtilities";

export const load = async ({ fetch, params }) => {
  if (!hasValidToken(params)) {
    return { params }
  }

  // Get the card id
  const cardId = params.id;

  try {
    await fetch(`${PUBLIC_API_URL}/account/card/${cardId}`, {
      headers: getAuthorizationHeaders(params),
    }).then(handleRequest);
    redirect(307, "/account?link_status=success");
  } catch (error) {
    console.error(error);
    redirect(307, "/account?link_status=error");
  }
}