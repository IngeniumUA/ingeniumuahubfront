import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';

export async function load({ params }) {
	const resp = await fetch(`${PUBLIC_API_URL}/account/billing`, {
		method: 'GET',
		headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
	});
	const billing = await resp.json();
	return { billing };
}
