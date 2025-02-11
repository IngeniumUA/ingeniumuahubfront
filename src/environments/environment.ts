import {AuthConfig} from 'angular-oauth2-oidc';
import {versions} from "@ingenium/environments/versions";
import {Browser} from "@capacitor/browser";

const OAuthConfig: AuthConfig = {
  issuer: 'https://sso.ingeniumua.be/realms/ingeniumua',
  // issuer: 'https://sso.ingeniumua.be/realms/IngeniumTESTING',
  redirectUri: 'ingenium://' + 'auth/callback',
  postLogoutRedirectUri: 'ingenium://' + 'auth/logout',
  clientId: 'ingeniumapp',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: false,
  useSilentRefresh: false,
  openUri
};

export let apiEnviroment = {
  name: 'production',
  apiUrl: 'https://hub.ingeniumua.be/api/v1/',
  // apiUrl: 'https://hub.dev.ingeniumua.be/api/v1/',
  oauthConfig: OAuthConfig,
  versions: versions,
  turnstileSiteKey: '0x4AAAAAAAX0Qzpta2sfvGK-',
};

export function openUri(uri: string) {
  Browser.open({ url: uri });
}
