import {
  PUBLIC_KC_CLIENT_ID,
  PUBLIC_KC_DISCOVERY,
  PUBLIC_KC_LOGOUT_URL,
  PUBLIC_KC_REDIRECT_URL
} from '$env/static/public';
import { browser } from '$app/environment';

import * as client from 'openid-client';
import { jwtDecode } from 'jwt-decode';
import type { TokenEndpointResponse } from 'openid-client';
import type { AuthUser } from '$lib/models/authI';
import type { Page } from '@sveltejs/kit';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const ACCESS_TOKEN_COOKIE = 'access_token';
const ID_TOKEN_COOKIE = 'id_token';

function setCookie(cname: string, cvalue: string, exsec: number) {
  const d = new Date();
  d.setTime(d.getTime() + (exsec * 1000));
  const expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname: string) {
  const name = cname + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

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
    scope: 'openid profile',
    // prompt: 'login',  // ask user to log in again every time
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
    setCookie(ACCESS_TOKEN_COOKIE, "", 0)
    setCookie(ID_TOKEN_COOKIE, "", 0)
    // Cookies.remove(ACCESS_TOKEN_COOKIE);
    // Cookies.remove(ID_TOKEN_COOKIE);
    return;
  }

  // const millisecondAdd = (tokens.expires_in !== undefined ? tokens.expires_in : 300) * 1000; // expires_in sec and 5 min to ms
  // const options: Cookies.CookieAttributes = {
  //   secure: true,
  //   sameSite: 'strict',
  //   expires: new Date(Date.now() + millisecondAdd),
  // }

  setCookie(ACCESS_TOKEN_COOKIE, tokens.access_token, (tokens.expires_in !== undefined ? tokens.expires_in : 300))
  setCookie(ID_TOKEN_COOKIE, (tokens.id_token !== undefined ? tokens.id_token : "undefined"), (tokens.expires_in !== undefined ? tokens.expires_in : 300))
  // Cookies.set(ACCESS_TOKEN_COOKIE, tokens.access_token, options);
  // Cookies.set(ID_TOKEN_COOKIE, tokens.id_token || '', options);
}

export const doLogout = async () => {
  const config = await getOpenIdDiscovery();
  const metadata = config.serverMetadata();

  if (metadata.frontchannel_logout_session_supported && metadata.end_session_endpoint) {
    const url = new URL(metadata.end_session_endpoint);
    url.searchParams.append('post_logout_redirect_uri', PUBLIC_KC_LOGOUT_URL);
    url.searchParams.append('client_id', PUBLIC_KC_CLIENT_ID);
    url.searchParams.append('id_token_hint', getCookie(ID_TOKEN_COOKIE) || '');
    // url.searchParams.append('id_token_hint', Cookies.get(ID_TOKEN_COOKIE) || '');
    if (Capacitor.getPlatform() === "web") {
      window.location.replace(url);
    } else {
      await Browser.open({ url: url.href })
    }
  }
}

export const getTokens = (params: Partial<Record<string, string>>|null) => {
  if (browser) {
    return {
      access_token: getCookie(ACCESS_TOKEN_COOKIE),
      id_token: getCookie(ID_TOKEN_COOKIE),
      // access_token: Cookies.get(ACCESS_TOKEN_COOKIE),
      // id_token: Cookies.get(ID_TOKEN_COOKIE),
    }
  }

  return {
    access_token: params?.__ACCESS_TOKEN__,
    id_token: params?.__ID_TOKEN__,
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
export const getLoginUrlWithRedirect = (path: string|undefined=undefined, page: Page<Record<string, string>, string | null>|undefined=undefined) => {
  let actualPath = '/';

  // Manually defined redirects
  if (path !== undefined) {
    actualPath = path;
  }

  // When given a page item, it is usual an automatic redirect
  if (page !== undefined) {
    // Check if the page route id would go to a prohibited page, if so redirect to root
    actualPath = ['DEF', '/auth/logout', '/auth/login', '/auth/callback'].includes(page.route.id || 'DEF') ? '/' : page.url.pathname;
  }

  return `/auth/login?next=${actualPath}`;
}