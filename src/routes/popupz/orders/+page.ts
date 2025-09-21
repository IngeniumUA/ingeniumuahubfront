import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';

export const load: PageLoad = async ({ fetch, params }) => {
	const ordersRes = await fetch(`${PUBLIC_API_URL}/order_tracking`, {
		method: 'GET',
		headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
	});
	const orders = ordersRes.ok ? await ordersRes.json(): [];
	return { orders }
}