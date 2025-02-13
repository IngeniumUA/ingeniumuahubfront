import { AuthConfig } from 'angular-oauth2-oidc';
import { versions } from "@ingenium/environments/versions";

const OAuthConfig: AuthConfig = {
  issuer: 'https://sso.ingeniumua.be/realms/ingeniumua',
  redirectUri: 'https://admin.ingeniumua.be/auth/callback',
  postLogoutRedirectUri: 'https://admin.ingeniumua.be/auth/logout',
  clientId: 'ingeniumwebsite',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: false,
  useSilentRefresh: false,
};

export const apiEnviroment = {
  name: 'production',
  apiUrl: 'https://hub.ingeniumua.be/api/v1/',
  appHost: 'ingeniumua.be',
  oauthConfig: OAuthConfig,
  versions: versions,
  turnstileSiteKey: '0x4AAAAAAAX0Qzpta2sfvGK-',
};
