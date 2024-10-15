import { AuthConfig } from 'angular-oauth2-oidc';
import { versions } from "@ingenium/environments/versions";

const OAuthConfig: AuthConfig = {
  issuer: 'https://sso.ingeniumua.be/realms/IngeniumTESTING',
  redirectUri: window.location.origin + '/auth/callback',
  postLogoutRedirectUri: window.location.origin + '/auth/logout',
  clientId: 'ingeniumwebsite',
  responseType: 'code',
  scope: 'openid profile email',
  useSilentRefresh: false,
};

export const apiEnviroment = {
  name: 'staging',
  apiUrl: 'https://hub.dev.ingeniumua.be/api/v1/',
  oauthConfig: OAuthConfig,
  versions: versions
};
