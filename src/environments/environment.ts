import {AuthConfig} from 'angular-oauth2-oidc';
import {versions} from "@ingenium/environments/versions";
import {
  AndroidAnimation,
  AndroidViewStyle,
  DismissStyle,
  InAppBrowser,
  iOSAnimation,
  iOSViewStyle,
  SystemBrowserOptions
} from '@capacitor/inappbrowser';

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
  versions: versions
};

export async function openUri(uri: string) {
  await InAppBrowser.openInSystemBrowser({
    url: uri,
    options: options
  });
}

const options: SystemBrowserOptions = {
  android: {
    showTitle: false,
    hideToolbarOnScroll: true,
    viewStyle: AndroidViewStyle.FULL_SCREEN,
    startAnimation: AndroidAnimation.SLIDE_IN_LEFT,
    exitAnimation: AndroidAnimation.SLIDE_OUT_RIGHT
  },
  iOS: {
    closeButtonText: DismissStyle.CLOSE,
    viewStyle: iOSViewStyle.FULL_SCREEN,
    animationEffect: iOSAnimation.COVER_VERTICAL,
    enableBarsCollapsing: true,
    enableReadersMode: false
  }
}
