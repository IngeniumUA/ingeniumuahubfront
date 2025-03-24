import { Configuration, type TokenEndpointResponse } from 'openid-client';

export interface AuthUser {
	'allowed-origins': string[],
	exp: number,
	email: string,
	family_name: string,
	given_name: string,
	name: string,
	preferred_username: string,
	locale: string,
	realm_access: {
		roles: string[],
	}
}

export interface AuthState {
	discoveryLoaded: boolean,
	discoveryFailed: boolean,
	authConfig: Configuration|undefined;
	user: AuthUser|undefined;
}