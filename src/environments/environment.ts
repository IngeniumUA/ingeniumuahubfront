import { AuthConfig } from 'angular-oauth2-oidc';

const OAuthConfig: AuthConfig = {
  issuer: 'https://sso.ingeniumua.be/realms/ingeniumua',
  redirectUri: window.location.origin + '/auth/callback',
  postLogoutRedirectUri: window.location.origin + '/auth/logout',
  clientId: 'ingeniumwebsite',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: false,
  useSilentRefresh: false,
};

export const apiEnviroment = {
  name: 'production',
  apiUrl: 'https://hub.ingeniumua.be/api/v1/',
  oauthConfig: OAuthConfig,
};
