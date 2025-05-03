import { getLoginUrlWithRedirect, hasValidToken } from "$lib/auth/auth.ts";
import { redirect } from "@sveltejs/kit";

export const load = async ({ params, url }) => {
  if (!hasValidToken(params)) {
    redirect(307, getLoginUrlWithRedirect(url.pathname));
  }
}