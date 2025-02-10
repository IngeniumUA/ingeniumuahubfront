import { AuthConfig } from 'angular-oauth2-oidc';
import { versions } from "@ingenium/environments/versions";

const OAuthConfig: AuthConfig = {
  issuer: 'https://sso.ingeniumua.be/realms/IngeniumTESTING',
  redirectUri: 'https://dev.ingeniumua.be/auth/callback',
  postLogoutRedirectUri: 'https://dev.ingeniumua.be/auth/logout',
  clientId: 'ingeniumwebsite',
  responseType: 'code',
  scope: 'openid profile email',
  useSilentRefresh: false,
};

export const apiEnviroment = {
  name: 'staging',
  apiUrl: 'https://hub.dev.ingeniumua.be/api/v1/',
  appHost: 'dev.ingeniumua.be',
  oauthConfig: OAuthConfig,
  versions: versions,
  turnstileSiteKey: '0x4AAAAAAAX0Qzpta2sfvGK-',
};
