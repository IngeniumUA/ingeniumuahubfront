import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
import { DBLogAPI } from '$lib/core_api/dblog_api';

export async function load({ params }) {
	const checkout = await CoreCheckoutAPI.getCheckoutWide(params.checkout_uuid);
	const queryParam = new URLSearchParams({
		table_name: "hubcheckout",
		row_primary_key: "20"
	})
	const logs = await DBLogAPI.queryCoreDBLog(queryParam)
	return { checkout, logs };
}