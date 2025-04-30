import os from 'os';
import { getUserFromToken } from '$lib/auth/auth';
import type { AuthUser } from '$lib/models/authI';

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

	return {
    user,
		serverHostname: os.hostname() // To see which server is handling the request (just some tmp debugging info)
	}
}