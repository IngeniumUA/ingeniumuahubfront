import { CoreFlagAPI } from '$lib/core_api/flag_api';

export async function load({ params }) {
	const flag = await CoreFlagAPI.getFlag(params, 'onkostennota_cijfer');

	return { flag };
}
