import {
  PUBLIC_KC_CLIENT_ID,
  PUBLIC_KC_DISCOVERY,
  PUBLIC_KC_LOGOUT_URL,
  PUBLIC_KC_REDIRECT_URL
} from '$env/static/public';
import { browser } from '$app/environment';
import { page } from '$app/state';

import Cookies from 'js-cookie';
import * as client from 'openid-client';
import { jwtDecode } from 'jwt-decode';
import type { TokenEndpointResponse } from 'openid-client';
import type { AuthUser } from '$lib/models/authI';

export const getOpenIdDiscovery = async () => {
  return await client.discovery(new URL(PUBLIC_KC_DISCOVERY), PUBLIC_KC_CLIENT_ID);
}

export const doLogin = async (state: Record<string, string> = {}): Promise<URL> => {
  const config = await getOpenIdDiscovery();
  const codeVerifier = client.randomPKCECodeVerifier();
  const strState = JSON.stringify(state);

  // Try to store the code verifier in the session
  if (browser && window.sessionStorage) {
    window.sessionStorage.setItem('pkce_code_verifier', codeVerifier);
    window.sessionStorage.setItem('expected_state', strState);
  } else {
    throw new Error('Your browser does not supported session storage to provide a secure login experience.');
  }

  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);

  return client.buildAuthorizationUrl(config, {
    redirect_uri: PUBLIC_KC_REDIRECT_URL,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state: strState,
  });
}

export const getUserFromToken = (token: string): AuthUser => {
  const decoded = jwtDecode(token) as AuthUser;

  // Check if the token is still valid, if not return undefined
  const d = new Date(0);
  d.setUTCSeconds(decoded.exp);
  if (d < new Date()) {
    throw new Error('Token is expired');
  }

  return decoded;
}

export const storeTokens = (tokens: TokenEndpointResponse|undefined) => {
  if (!tokens) {
    Cookies.remove('access_token');
    Cookies.remove('id_token');
    return;
  }

  const millisecondAdd = (tokens.expires_in !== undefined ? tokens.expires_in : 300) * 1000; // expires_in sec and 5 min to ms
  Cookies.set('access_token', tokens.access_token, {
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + millisecondAdd),
  });
}

export const doLogout = async () => {
  const config = await getOpenIdDiscovery();
  const metadata = config.serverMetadata();

  if (metadata.frontchannel_logout_session_supported && metadata.end_session_endpoint) {
    const url = new URL(metadata.end_session_endpoint);
    url.searchParams.append('post_logout_redirect_uri', PUBLIC_KC_LOGOUT_URL);
    url.searchParams.append('client_id', PUBLIC_KC_CLIENT_ID);
    window.location.replace(url);
  }
}

export const getTokens = (params: Partial<Record<string, string>>|null) => {
  if (browser) {
    return {
      access_token: Cookies.get('access_token'),
    }
  }

  return {
    access_token: params?.__ACCESS_TOKEN__,
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
export const getAuthorizationHeaders = (params: Partial<Record<string, string>>|null, additionalHeaders = {}): HeadersInit => {
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