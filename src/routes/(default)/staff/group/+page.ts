import { CoreGroupAPI } from '$lib/core_api/group_api';

export async function load({ params }) {
	const groupTable = await CoreGroupAPI.groupTable(params);
	return { groupTable };
}