import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';
import type { UserI, UserWideI } from '$lib/models/user/userI';
import type { HubCheckoutTrackerI } from '$lib/models/trackerI';
import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';

export class CoreUserAPI {
	static async countUser(
		params: RouteParams | null = null,
		query_param: URLSearchParams
	): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/user/count?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch user count: ${await res.text()}`;
		}
	}

	static async queryUser(
		params: RouteParams | null = null,
		query_param: URLSearchParams
	): Promise<UserI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/user?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch users: ${await res.text()}`;
		}
	}

	static async getUserWide(
		params: RouteParams | null = null,
		userIdentifier: string
	): Promise<UserWideI> {
		const res = await fetch(`${PUBLIC_API_URL}/user/wide/${userIdentifier}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch user: ${await res.text()}`;
		}
	}

	static async getUserKeycloak(
		params: RouteParams | null = null,
		userIdentifier: string
	): Promise<any> {
		const res = await fetch(`${PUBLIC_API_URL}/keycloak/user/${userIdentifier}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch keycloak user: ${await res.text()}`;
		}
	}

	static async queryCheckoutTracker(params: RouteParams | null = null, userIdentifier: string): Promise<HubCheckoutTrackerI[]> {
		const query = new URLSearchParams({
			user: userIdentifier,
		});
		return await CoreCheckoutAPI.queryCheckoutTracker(params, query)
	}

	static async addUserToGroup(groupIdentifier: number, userIdentifier: string): Promise<boolean> {
		const res = await fetch(`${PUBLIC_API_URL}/group/add/${groupIdentifier}/${userIdentifier}`, {
			method: 'POST',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify({})
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to add user to group: ${await res.text()}`;
		}
	}

	static async removeUserFromGroup(groupIdentifier: number, userIdentifier: string): Promise<boolean> {
		const res = await fetch(`${PUBLIC_API_URL}/group/remove/${groupIdentifier}/${userIdentifier}`, {
			method: 'POST',
			headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
			body: JSON.stringify({})
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to remove user from group: ${await res.text()}`;
		}
	}
}