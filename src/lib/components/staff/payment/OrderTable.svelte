<script lang="ts">
	import type { CheckoutI } from '$lib/models/checkoutI';
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
	import { onMount } from 'svelte';
	import { PaymentStatusEnum } from '$lib/models/enums';
	import { successToast } from '$lib/components/toast/defined_toast';
	import { makePretty, prettyDateTime } from '$lib/utilities/style-utilities';
	import { type HubCheckoutTrackerI, HubCheckoutTrackerStatusEnum } from '$lib/models/trackerI';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';
	import type { RouteParams } from '../../../../../.svelte-kit/types/src/routes/$types';

	let { baseQueryParam = $bindable(new URLSearchParams({ limit: '100', offset:'5' })) }: { baseQueryParam: URLSearchParams } = $props();

	let orderCount: number = $state(0);
	let orders: HubCheckoutTrackerI[] = $state([])

	onMount(() => {
		queryData(queryParam);
	});

	/**
	 * Query logic
	 */
	interface QueryFormI {
		user_email: string | null;
	}
	let queryForm: QueryFormI = $state({
		user_email: null
	})
	let queryParam = $derived.by(() => {
		let searchParam = new URLSearchParams()
		if (queryForm.user_email !== null && queryForm.user_email !== "") searchParam.set('user_email_contains', queryForm.user_email);

		let queryParam = new URLSearchParams()
		for (const [key, value] of baseQueryParam) {
			queryParam.append(key, value);
		}
		for (const [key, value] of searchParam) {
			queryParam.append(key, value);
		}
		return queryParam
	})
	let loadingHTTP = $state(false);

	let queryError: Error | null = null
	async function queryData(queryParam: URLSearchParams) {
		if (loadingHTTP) return;
		orders = await CoreCheckoutAPI.queryCheckoutTracker(null, queryParam);
		orderCount = await CoreCheckoutAPI.countCheckoutTracker(null, queryParam);
	}

	/**
	 *
	 */
	async function refresh() {
		await queryData(queryParam)
		successToast("Refreshed!")
	}

	/**
	 * Bulk Operations selection
	 */
	// let selectedArray: boolean[] = $state([])

	async function resetIndexRequest(params: RouteParams | null = null) {
		const res = await fetch(`${PUBLIC_API_URL}/checkout/tracker/reset`, {
			method: 'GET',
			headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
		});
		if (res.ok) {
			return await res.json();
		} else {
			throw `Failed to reset: ${await res.text()}`;
		}
	}
</script>

<article>
	<div class="flex justify-between items-center">
		<h2 id="checkout-table">Order Trackers</h2>
		<button onclick={resetIndexRequest} class="ml-auto button button-primary button-inline">
			<span class="text-white">Reset Order index</span>
		</button>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>
	<div class="alert alert-info mb-4 max-w-3xl">
		<p class="alert-text">Trackers die vasthangen aan de betaling.</p>
	</div>

	<section class="filter-selector">
		<h3>Filter</h3>
		<p>Hier vanalle filters om toe te passen op de table.
			Mis zoals price policy ook zo knop om een dropdown te openen
			(met dan al zo, de waarden die via props zijn ingevoerd op disabled? Da like ik wel</p>
	</section>

	<section class="bulk-operation">
		<h3>Apply</h3>
		<p>Om bulk operaties uit te voeren zoals refunds. Hier ook de export knop zetten?
			Zwz voorda de operatie wordt uitgevoerd zo een buffer knop van "are you sure?"</p>
	</section>

	{#if (queryError !== null)}
		<div class="error-message p-4">
			{JSON.stringify(queryError)}
		</div>
	{/if}

	<table class="ingenium-table">
		<thead>
		<tr>
			<th><h4>Select</h4> <input type="checkbox"/></th>
			<th><h4>Order ID</h4></th>
			<th><h4>Order Counter</h4></th>
			<th><h4>Checkout</h4></th>
			<th><h4>Status</h4></th>
			<th>
				<div>
					<h4>User</h4>
					<input type="text" placeholder="Email" bind:value={queryForm.user_email}>
				</div>
			</th>
			<th><h4>Created</h4></th>
			<th><h4>Showing {orders.length} / {orderCount}</h4></th>
		</tr>
		</thead>
		<tbody>
		{#each orders as order (order.id)}
			<tr>
				<th>
					<input type="checkbox"/>
				</th>
				<th>{order.id}</th>
				<th>{order.order_counter}</th>
				<th>
					<a href={`/staff/payment/${order.checkout.checkout_uuid}#overview`}>{order.checkout.checkout_uuid.slice(0, 6)}</a>
				</th>
				<td>
					{makePretty(HubCheckoutTrackerStatusEnum[order.checkout_tracker_status])}
				</td>
				<td>
					{order.checkout.user_email}
				</td>
				<td>
					{prettyDateTime(order.created_timestamp)}
				</td>
				<td>
					<button>
						<span>...</span>
					</button>
				</td>
			</tr>
		{/each}
		</tbody>
	</table>
</article>