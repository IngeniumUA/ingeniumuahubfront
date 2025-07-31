import { getAuthorizationHeaders } from '$lib/auth/auth';
import { handleRequest } from '$lib/utilities/httpUtilities';
import { PUBLIC_API_URL } from "$env/static/public";
import { type HubFlag, HubFlagTypeEnum } from '$lib/models/flag/HubFlagI';


export async function load({ fetch, params }) {
	const flags: HubFlag[] = await fetch(`${PUBLIC_API_URL}/flag`, {
		headers: getAuthorizationHeaders(params)
	}).then(r => handleRequest(r));

	const configFlags = flags.filter((flag: HubFlag) => flag.flag_type === HubFlagTypeEnum.configuration);
	const featureFlags = flags.filter((flag: HubFlag) => flag.flag_type === HubFlagTypeEnum.feature);

	return { configFlags, featureFlags };
}