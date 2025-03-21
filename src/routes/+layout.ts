import Cookies from 'js-cookie';
import { getUserFromToken } from '$lib/auth/auth';

export const load = async ({ data }) => {
  // If there is no user given (e.g. failed or no SSR)
  if (!data.user) {
    // Check if there is a valid token
    const token = Cookies.get('access_token');
    if (token) {
      try {
        data.user = getUserFromToken(token);
      } catch (e) {
        Cookies.remove('access_token');
        console.error(e);
      }
    }
  }

	return {
		...data,
	}
}