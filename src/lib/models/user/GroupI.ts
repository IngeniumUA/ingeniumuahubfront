export interface GroupI {
	id: number;
	name: string;
	keycloak_group_uuid: string | null;
	last_update_timestamp: string;
	created_timestamp: string;
}