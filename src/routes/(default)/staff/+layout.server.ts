import { getUserFromToken } from '$lib/auth/auth';
import type { AuthUser } from '$lib/models/authI';
import { hasRole } from '$lib/states/auth.svelte.js';
import { redirect } from '@sveltejs/kit';

export const load = ({ cookies }) => {
	let user: AuthUser|undefined = undefined;

  // Check if the user has a valid token in the cookies
  const token = cookies.get('access_token');
  if (token) {
    try {
      user = getUserFromToken(token);
    } catch (e) {
      cookies.delete('access_token', { path: '/' });
      console.error(e);
    }
  }

	// Check roles for authorization
	if(!hasRole('staff')) {
			throw redirect(307, '/');
	}

	return {
    user
	}
}