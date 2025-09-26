import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import type { RouteParams } from '../../../.svelte-kit/types/src/routes/$types';
import type { TransactionI } from '$lib/models/transactionI';

export class CoreTransactionAPI {
	static async queryTransactions(
		params: RouteParams | null = null,
		query_param: URLSearchParams
	): Promise<TransactionI[]> {
		const res = await fetch(`${PUBLIC_API_URL}/transaction?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch transaction count: ${await res.text()}`;
		}
	}

	static async countTransactions(
		params: RouteParams | null = null,
		query_param: URLSearchParams
	): Promise<number> {
		const res = await fetch(`${PUBLIC_API_URL}/transaction/count?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch transaction count: ${await res.text()}`;
		}
	}

	static async patchTransaction(
		params: RouteParams | null = null,
		transactionIdentifier: number,
		patchObj: Partial<TransactionI>
	): Promise<TransactionI> {
		const res = await fetch(
			`${PUBLIC_API_URL}/transaction/${transactionIdentifier}?force_patch=true`,
			{
				method: 'PATCH',
				headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
				body: JSON.stringify(patchObj)
			}
		);
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to patch transaction: ${await res.text()}`;
		}
	}

	static async groupByTransactions(
		params: RouteParams | null = null,
		query_param: URLSearchParams
	): Promise<[]> {
		const res = await fetch(`${PUBLIC_API_URL}/transaction/group_by?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' })
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to fetch transaction grouped: ${await res.text()}`;
		}
	}

	static async downloadTransactions(
		params: RouteParams | null = null,
		query_param: URLSearchParams
	): Promise<void> {
		const res = await fetch(`${PUBLIC_API_URL}/transaction/export?${query_param.toString()}`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'text/csv' })
		});
		if (!res.ok) {
			throw new Error(`Failed to fetch transactions export: ${await res.text()}`);
		}
		const blob = await res.blob();
		const url = window.URL.createObjectURL(blob);
		// Create a hidden <a> element
		const a = document.createElement('a');
		a.href = url;

		// Extract filename from Content-Disposition header OR fallback
		const contentDisposition = res.headers.get('Content-Disposition');
		a.download = contentDisposition
			? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
			: 'transactions.csv'; // ✅ Tells browser to download instead of navigating
		document.body.appendChild(a);
		a.click(); // ✅ Programmatically trigger the click

		// Clean up
		a.remove();
		window.URL.revokeObjectURL(url);
	}
}