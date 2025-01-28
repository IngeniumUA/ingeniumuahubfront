import {OidcClient, SigninResponse, UserManager} from "oidc-client-ts";
import Cookies from 'js-cookie';
import { PUBLIC_KC_ISSUER, PUBLIC_KC_CLIENT_ID, PUBLIC_KC_REDIRECT_URL } from "$env/static/public";
import type { UserStateI } from "$lib/states/user.svelte";
import { browser } from "$app/environment";

/**
 * Create an OIDC Client
 */
export const setupOidcClient = () => {
  const mgr = new UserManager({
    authority: PUBLIC_KC_ISSUER,
    client_id: PUBLIC_KC_CLIENT_ID,
    redirect_uri: PUBLIC_KC_REDIRECT_URL,
    response_type: "code",
    scope: "openid email roles",
    filterProtocolClaims: true,
    disablePKCE: false,
  });
  return mgr;
}

export const setUserInStateFromResponse = (userState: UserStateI, response: SigninResponse) => {
  userState.access_token = response.access_token;
  userState.id_token = response.id_token;
  userState.refresh_token = response.refresh_token;
  userState.user = {
    name: response.profile.name,
    email: response.profile.email,
  }

  // Set 1 month expiration for other data
  const exp = new Date();
  exp.setMonth(exp.getMonth() + 1);

  // Create instance with default values
  const cookies = Cookies.withAttributes({
    secure: true,
    sameSite: 'strict',
    expires: exp,
  });

  // Set the cookies
  cookies.set('access_token', response.access_token, {
    //expires: new Date(response.expires_at ?? Date.now()) // TODO: Fix this!
  });
  if (response.refresh_token) {
    cookies.set('refresh_token', response.refresh_token);
  }
  if (response.id_token) {
    cookies.set('id_token', response.id_token);
  }
}

export const getTokens = (params: Partial<Record<string, string>>) => {
  if (browser) {
    return {
      access_token: Cookies.get('access_token'),
      refresh_token: Cookies.get('refresh_token'),
      id_token: Cookies.get('id_token'),
    }
  }

  return {
    access_token: params.__ACCESS_TOKEN__,
    refresh_token: params.__REFRESH_TOKEN__,
    id_token: params.__ID_TOKEN__,
  }
}

/**
 * Sets the correct header of access token
 * @param params uses to get the access token on the server
 * @param additionalHeaders can be used to set additional headers
 */
export const getAuthorizationHeaders = (params: Partial<Record<string, string>>, additionalHeaders = {}): HeadersInit => {
  const accessToken = getTokens(params).access_token;
  if (!accessToken) return additionalHeaders;

  // Merge additional headers with auth header
  return {
    ...additionalHeaders,
    'Authorization': `Bearer ${accessToken}`
  }
}

export const logout = () => {
  if (browser) {

  }
}