import { AuthConfig } from 'angular-oauth2-oidc';
import { versions } from "@ingenium/environments/versions";
import {Browser} from "@capacitor/browser";

const OAuthConfig: AuthConfig = {
  issuer: 'https://sso.ingeniumua.be/realms/ingeniumua',
  // issuer: 'https://sso.ingeniumua.be/realms/IngeniumTESTING',
  redirectUri: 'https://ingeniumua.be' + '/auth/callback',
  postLogoutRedirectUri: 'https://ingeniumua.be' + '/auth/logout',
  clientId: 'ingeniumwebsite',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: false,
  useSilentRefresh: false,
  openUri
};

export const apiEnviroment = {
  name: 'production',
  apiUrl: 'https://hub.ingeniumua.be/api/v1/',
  // apiUrl: 'https://hub.dev.ingeniumua.be/api/v1/',
  oauthConfig: OAuthConfig,
  versions: versions
};

export function openUri(uri: string) {
  Browser.open({ url: uri });
}
