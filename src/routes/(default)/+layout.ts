import { getCookie, getUserFromToken, setCookie } from '$lib/auth/auth';
import { auth } from '$lib/states/auth.svelte.ts';

export const load = ({ route }) => {
	// Check if there is a valid token
	const token = getCookie('access_token');
	if (token) {
		try {
			auth.user = getUserFromToken(token);
		} catch (e) {
			setCookie('access_token', "", 0);
			console.error(e);
		}
	}
	return {
		footerEnabled: !route.id?.includes('/scanners/'),
	};
};