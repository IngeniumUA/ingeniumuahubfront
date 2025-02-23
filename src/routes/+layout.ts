import { browser } from "$app/environment";
import { fetchUserDetails, setupOidcClient } from "$lib/auth/auth";

export const load = async ({ data }) => {
  if (!browser) return; // Don't configure OIDC client on the server

  const oidcClient = setupOidcClient();
  
  return {
    ...data,
    oidcClient,
    user: await fetchUserDetails(oidcClient),
  }
}