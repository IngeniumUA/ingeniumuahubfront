import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
import { DBLogAPI } from '$lib/core_api/dblog_api';

export async function load({ params }) {
	const checkout = await CoreCheckoutAPI.getCheckoutWide(params, params.checkout_uuid);
	const queryParam = new URLSearchParams({
		table_name: 'hubcheckout',
		row_primary_key: `${checkout.id}`
	});
	const logs = await DBLogAPI.queryCoreDBLogExploded(params, queryParam)
	return { checkout, logs };
}