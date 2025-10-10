import type { GroupI } from '$lib/models/user/GroupI';

export interface UserI {
	user_uuid: string
	id: number

	sso_uuid: string
	first_name: string
	last_name: string

	email: string

	last_update_timestamp: string
	created_timestamp: string

	notification_token: string | null;

	manager: boolean

	roles: string[]
}

export interface AccountI {
	telephone: string;
}

export interface UserWideI extends UserI {
	groups: GroupI[]
	account: AccountI | null;
}