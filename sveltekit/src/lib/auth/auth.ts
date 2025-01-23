import {OidcClient, SigninResponse} from "oidc-client-ts";
import { PUBLIC_KC_ISSUER, PUBLIC_KC_CLIENT_ID, PUBLIC_KC_REDIRECT_URL} from "$env/static/public";
import {userState, type UserStateI} from "$lib/states/user.svelte";

export const setupOidcClient = () => {
  return new OidcClient({
    authority: PUBLIC_KC_ISSUER,
    client_id: PUBLIC_KC_CLIENT_ID,
    redirect_uri: PUBLIC_KC_REDIRECT_URL,
    response_type: "code",
    scope: "openid email roles",
    filterProtocolClaims: true,
    disablePKCE: false,
  });
}

export const setUserInStateFromResponse = (userState: UserStateI, response: SigninResponse) => {
  userState.access_token = response.access_token;
  userState.id_token = response.id_token;
  userState.refresh_token = response.refresh_token;
  userState.authenticated = true;
  userState.user = {
    name: response.profile.name,
    email: response.profile.email,
  }

  // Save in locale storage
  localStorage.setItem("access_token", response.access_token);
  // @ts-ignore
  localStorage.setItem("id_token", response.id_token);
  // @ts-ignore
  localStorage.setItem("refresh_token", response.refresh_token);
  localStorage.setItem("authenticated", "true");
  localStorage.setItem("user", JSON.stringify(userState.user));

  // Set a cookie with the access token
  document.cookie = `access_token=${response.access_token}; SameSite=Strict; Secure`;
}

export const getUserFromLocalStorage = () => {
  const access_token = localStorage.getItem("access_token");
  const id_token = localStorage.getItem("id_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const authenticated = localStorage.getItem("authenticated");
  const user = localStorage.getItem("user");

  if (access_token && id_token && refresh_token && authenticated && user) {
    return {
      access_token,
      id_token,
      refresh_token,
      authenticated: true,
      user: JSON.parse(user)
    }
  }

  return null;
}