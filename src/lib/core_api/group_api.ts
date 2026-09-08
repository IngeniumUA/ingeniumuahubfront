import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { GroupI } from '$lib/models/user/GroupI';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';

export class CoreGroupAPI {
	static async queryGroup(params: RouteParams | null = null): Promise<[]> {
		const res = await fetch(`${PUBLIC_API_URL}/group`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch groups: ${await res.text()}`;
		}
	}

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
			method: 'PUT',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(putGroup)
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to put group: ${await res.text()}`;
		}
	}

	static async postGroup(params: RouteParams | null = null, postGroup: Partial<GroupI>): Promise<GroupI> {
		const res = await fetch(`${PUBLIC_API_URL}/group`, {
			method: 'POST',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(postGroup)
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to post group: ${await res.text()}`;
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
			throw `Failed to fetch keycloak groups: ${await res.text()}`;
		}
	}

	static async getKeycloakGroup(params: RouteParams | null = null, groupId: string): Promise<any> {
		const res = await fetch(`${PUBLIC_API_URL}/keycloak/group/${groupId}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch keycloak group: ${await res.text()}`;
		}
	}

	static async countMembers(params: RouteParams | null = null, groupId: number | string): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/user/count?group=${groupId}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch user count for group: ${await res.text()}`;
		}
	}

}