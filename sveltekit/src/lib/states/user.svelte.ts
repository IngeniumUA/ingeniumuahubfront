import type {User, UserManager} from "oidc-client-ts";

export const oidcClient = $state<{ userManager: null|UserManager }>({
  userManager: null,
});
// @ts-ignore
export const user = $state<User>({});