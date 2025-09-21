import { CoreGroupAPI } from '$lib/core_api/group_api';

export async function load({ params }) {
	const group = await CoreGroupAPI.getGroup(params, params.id);
	const keycloakGroup = group.keycloak_group_uuid !== null ? await CoreGroupAPI.getKeycloakGroup(params, group.keycloak_group_uuid): null;
	const memberCount = await CoreGroupAPI.countMembers(params, params.id)

	return { group, keycloakGroup, memberCount};
}