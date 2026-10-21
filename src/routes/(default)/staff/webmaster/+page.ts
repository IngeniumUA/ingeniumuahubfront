import { CoreUserAPI } from '$lib/core_api/user_api';
import { CoreMediaAPI } from '$lib/core_api/media_api';
import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';

export async function load({ params }) {
	const managerUsers = await CoreUserAPI.queryManagers(params);
	const mediaList = await CoreMediaAPI.queryMediaList(params);
	const resp = await fetch(`${PUBLIC_API_URL}/internal/env`, {
		method: 'GET',
		headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
	});
	const internal = await resp.json();
	return { managerUsers, mediaList, internal };
}