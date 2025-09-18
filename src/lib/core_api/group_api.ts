import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { GroupI } from '$lib/models/user/GroupI';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';

export class CoreGroupAPI {
	static async groupTable(params: RouteParams | null = null): Promise<[]> {
		const res = await fetch(`${PUBLIC_API_URL}/group/table`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch groups table: ${await res.text()}`;
		}
	}

	static async getGroup(params: RouteParams | null = null, group_identifier: string | number): Promise<GroupI> {
		const res = await fetch(`${PUBLIC_API_URL}/group/${group_identifier}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch group: ${await res.text()}`;
		}
	}

	static async putGroup(params: RouteParams | null = null, putGroup: GroupI): Promise<GroupI> {
		const res = await fetch(`${PUBLIC_API_URL}/group/${putGroup.id}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(putGroup)
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to put group: ${await res.text()}`;
		}
	}

	static async queryKeycloakGroup(params: RouteParams | null = null): Promise<[]> {
		const res = await fetch(`${PUBLIC_API_URL}/keycloak/group`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch keycloak group: ${await res.text()}`;
		}
	}
}