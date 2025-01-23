import {OidcClient} from "oidc-client-ts";

export interface UserStateI {
  oidcClient: OidcClient|null,
  authenticated: boolean,
  access_token?: string,
  id_token?: string,
  refresh_token?: string,
  user: {
    name?: string
    email?: string,
    roles?: string[],
  }
}

export const userState = $state<UserStateI>({
  oidcClient: null,
  authenticated: false,
  user: {}
});