import { CoreUserAPI } from '$lib/core_api/user_api';

export async function load({ params }) {
	const managerUsers = await CoreUserAPI.queryManagers(params);
	return { managerUsers }
}