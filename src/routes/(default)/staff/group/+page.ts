import { CoreGroupAPI } from '$lib/core_api/group_api';

export async function load({ params }) {
	const groupTable = await CoreGroupAPI.groupTable(params);
	const keycloakGroups = await CoreGroupAPI.queryKeycloakGroup(params)

	return { groupTable, keycloakGroups };
}