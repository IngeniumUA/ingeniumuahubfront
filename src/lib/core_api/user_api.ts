import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';
import type { UserWideI } from '$lib/models/user/userI';
import type { HubCheckoutTrackerI } from '$lib/models/trackerI';
import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';

export class CoreUserAPI {
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
}