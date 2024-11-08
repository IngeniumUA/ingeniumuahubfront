import { AuthConfig } from 'angular-oauth2-oidc';
import { versions } from "@ingenium/environments/versions";
import {Browser} from "@capacitor/browser";

const OAuthConfig: AuthConfig = {
  issuer: 'https://sso.ingeniumua.be/realms/IngeniumTESTING',
  redirectUri: window.location.origin + '/auth/callback',
  postLogoutRedirectUri: window.location.origin + '/auth/logout',
  clientId: 'ingeniumapp',
  responseType: 'code',
  scope: 'openid profile email',
  useSilentRefresh: false,
  openUri
};

export const apiEnviroment = {
  name: 'staging',
  apiUrl: 'https://hub.dev.ingeniumua.be/api/v1/',
  oauthConfig: OAuthConfig,
  versions: versions
};

export function openUri(uri: string) {
  Browser.open({ url: uri });
}
