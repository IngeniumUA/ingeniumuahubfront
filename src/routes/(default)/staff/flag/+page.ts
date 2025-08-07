import { CoreFlagAPI } from '$lib/core_api/flag_api';


export async function load() {
	const configFlags = await CoreFlagAPI.queryFlag(new URLSearchParams({
		flag_type: '1',
		limit: '100'
	}));
	const featureFlags = await CoreFlagAPI.queryFlag(new URLSearchParams({
		flag_type: '2',
		limit: '100'
	}));
	return { configFlags, featureFlags };
}