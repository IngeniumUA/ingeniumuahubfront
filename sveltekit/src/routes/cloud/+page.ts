import {browser} from "$app/environment";
import { getLoginUrlWithRedirect, hasValidToken } from "$lib/auth/auth";
import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, params, url }) => {
  if (!hasValidToken(params)) {
    redirect(307, getLoginUrlWithRedirect(url.pathname));
  }
}