import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';
import type { TransactionI } from '$lib/models/transactionI';

export class CoreTransactionAPI {
	static async patchTransaction(params: RouteParams | null = null,
																transactionIdentifier: number,
																patchObj): Promise<TransactionI> {
		const res = await fetch(`${PUBLIC_API_URL}/transaction/${transactionIdentifier}?force_patch=true`, {
			method: 'PATCH',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
			body: JSON.stringify(patchObj)
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to patch transaction: ${await res.text()}`;
		}
	}
}