import { CoreGroupAPI } from '$lib/core_api/group_api';

export async function load() {
	const groupTable = await CoreGroupAPI.groupTable();
	return { groupTable };
}