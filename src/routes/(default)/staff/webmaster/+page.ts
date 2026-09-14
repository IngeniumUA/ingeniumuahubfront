import { CoreUserAPI } from '$lib/core_api/user_api';
import { CoreMediaAPI } from '$lib/core_api/media_api';

export async function load({ params }) {
	const managerUsers = await CoreUserAPI.queryManagers(params);
	const mediaList = await CoreMediaAPI.queryMediaList(params);

	return { managerUsers, mediaList }
}