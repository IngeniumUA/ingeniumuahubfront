import type { User, UserManager } from "oidc-client-ts";

interface UserState {
  userManager: null|UserManager;
  user: User|null;
  doLogin: (state: object) => Promise<void>;
}

export const auth = $state<UserState>({
  userManager: null,
  user: null,
  doLogin: async (state: object = {}) => {
    if (!auth.userManager) return;
    await auth.userManager.signinRedirect({
      state: state,
    });
  }
});

/**
 * Check if the user is authenticated.
 */
export const isAuthenticated = () => {
  return auth.user?.access_token !== undefined;
}

export const hasRole = (role: string) => {
  // @ts-expect-error -> cannot change type of oidc package
  return auth?.profile?.realm_access?.roles?.includes(role) || false;
}