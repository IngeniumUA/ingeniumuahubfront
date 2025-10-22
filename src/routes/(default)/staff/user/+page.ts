import { CoreUserAPI } from '$lib/core_api/user_api';


export async function load({ params }) {
	const searchParam = new URLSearchParams({});
	const users = await CoreUserAPI.queryUser(params, searchParam);
	const userCount = await CoreUserAPI.countUser(params, searchParam);

	return { users, userCount }
}