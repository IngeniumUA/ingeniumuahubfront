import Cookies from 'js-cookie';
import { User, UserManager, WebStorageStateStore } from "oidc-client-ts";
import { PUBLIC_KC_ISSUER, PUBLIC_KC_CLIENT_ID, PUBLIC_KC_REDIRECT_URL } from "$env/static/public";
import { browser } from "$app/environment";
import { page } from "$app/state";

export const fetchUserDetails = async (userManager: UserManager) => {
  const user = await userManager.getUser();
  setTokensInCookies(user);
  return user;
}

/**
 * Create an OIDC Client
 */
export const setupOidcClient = () => {
  return new UserManager({
    authority: PUBLIC_KC_ISSUER,
    client_id: PUBLIC_KC_CLIENT_ID,
    redirect_uri: PUBLIC_KC_REDIRECT_URL,
    response_type: "code",
    scope: "openid email roles",
    filterProtocolClaims: true,
    disablePKCE: false,
    stateStore: new WebStorageStateStore({ store: window.localStorage }),
  });
}

export const setTokensInCookies = (user: User|null) => {
  if (user === null) {
    Cookies.remove("access_token");
    return;
  }

  Cookies.set('access_token', user.access_token, {
    secure: true,
    sameSite: 'strict',
    expires: user.expires_at !== undefined ? new Date(user.expires_at * 1000) : Date.now(),
  });
}

export const getTokens = (params: Partial<Record<string, string>>) => {
  if (browser) {
    return {
      access_token: Cookies.get('access_token'),
    }
  }

  return {
    access_token: params.__ACCESS_TOKEN__,
  }
}

/**
 * Check if the user has a valid token, used for SSR auth checks
 * @param params
 */
export const hasValidToken = (params: Partial<Record<string, string>>) => {
  return !!getTokens(params).access_token;
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

/**
 * Create a login URL with a redirect to the current page.
 */
export const getLoginUrlWithRedirect = (path: undefined|string = undefined) => {
  return `/auth/login?next=${path || page.url.pathname}`;
}