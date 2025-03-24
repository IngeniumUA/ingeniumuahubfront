import type { AuthState } from '$lib/models/authI';

export const auth = $state<AuthState>({
  discoveryLoaded: false,
  discoveryFailed: true,
  authConfig: undefined,
  tokens: undefined,
  user: undefined,
});

/**
 * Check if the user is authenticated.
 */
export const isAuthenticated = () => {
  return auth.user !== undefined;
}

/**
 * Check if the user has a specific role.
 * @param role name of the role to check for
 */
export const hasRole = (role: string) => {
  return auth?.user?.realm_access?.roles?.includes(role) || false;
}