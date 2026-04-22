<script lang="ts">
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
	import { onMount } from 'svelte';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
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
		statusQuery: HubCheckoutTrackerStatusEnum | null;
		disabledQuery: boolean;
	}
	let queryForm: QueryFormI = $state({
		user_email: null,
		statusQuery: null,
		disabledQuery: false,
	})
	let queryParam = $derived.by(() => {
		let searchParam = new URLSearchParams()
		if (queryForm.user_email !== null && queryForm.user_email !== "") searchParam.set('user_email_contains', queryForm.user_email);
		if (queryForm.statusQuery !== null) searchParam.set('checkout_tracker_status', queryForm.statusQuery.toString());
		searchParam.set('disabled', queryForm.disabledQuery.toString());

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

	let queryError: Error | null = $state(null)
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
	let allSelected: boolean = $state(false)
	function toggleAllSelected(value: boolean) {
		allSelected = value
		selectedArray = Array.from({ length: orders.length }, () => value)
	}
	let selectedArray: boolean[] = $state([])

	/**
	 * Downloading
	 */
	async function exportTrackers() {
		if (loadingHTTP) return;
		loadingHTTP = true;
		try {
			await CoreCheckoutAPI.downloadOrderTrackers(null, queryParam);
			queryError = null;
		} catch (error) {
			queryError = error instanceof Error ? error : Error('Error download');
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	async function resetIndexRequest(params: RouteParams | null = null) {
		if (loadingHTTP) return;
		loadingHTTP = true;

		try {
			const res = await fetch(`${PUBLIC_API_URL}/checkout/tracker/reset`, {
				method: 'GET',
				headers: getAuthorizationHeaders(params, { 'Content-Type': 'application/json' }),
			});
			if (res.ok) {
				throw `Failed to reset: ${await res.text()}`;
			}
			successToast("Reset Tracker!")
		} catch (error) {
			failedToast(`Error retrieving trackers ${error}`);
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}
</script>

<style lang="scss">
	section {
			@apply mt-4 p-4 pl-0 rounded-lg shadow-sm;

			h3 {
					@apply font-bold;
			}
	}
</style>

<article>
	<div class="flex justify-between items-center gap-4">
		<h2 id="checkout-table">Order Trackers</h2>
		<button disabled={loadingHTTP} onclick={resetIndexRequest} class="ml-auto button button-primary button-inline">
			<span class="text-white">Reset Order index</span>
		</button>
		<button onclick={exportTrackers} disabled={loadingHTTP} class="button button-primary button-inline">
			<span class="text-white">Export</span>
		</button>
		<button onclick={refresh} class="button button-primary w-24 button-inline">
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

		<form class="ingenium-form">
			<fieldset>
				<div class="form-field max-w-52">
					<label for="status_filter">Filter voor status</label>
					<select id="status_filter" required bind:value={queryForm.statusQuery}>
						{#each [null, 1, 2] as status}
							<option value={status}>{status === null ? "All": HubCheckoutTrackerStatusEnum[status]}</option>
						{/each}
					</select>
				</div>
			</fieldset>
			<fieldset>
				<label for="showDisabled">Show Disabled</label>
				<label class="inline-flex items-center cursor-pointer">
					<input id="showDisabled" type="checkbox" class="sr-only peer" disabled={loadingHTTP}
								 bind:checked={queryForm.disabledQuery}
								 onclick="{() => {queryForm.disabledQuery = !queryForm.disabledQuery}}"
					>
					<div class="
					ml-8
					relative w-11 h-6
					bg-red-900 dark:bg-red-900
					rounded-full
					peer-checked:bg-green-900 dark:peer-checked:bg-green-900
					after:content-['']
					after:absolute after:top-[2px] after:start-[2px]
					after:w-5 after:h-5
					after:bg-white after:rounded-full
					after:transition-transform
					peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
					"></div>
					<span class="hidden lg:inline ms-3 text-sm font-medium text-gray-600">{#if (queryForm.disabledQuery)}Aan{:else}Uit{/if}</span>
				</label>
			</fieldset>
		</form>
	</section>

	<section class="bulk-operation">
		<h3>Apply</h3>
		<p>Om bulk operaties uit te voeren.</p>

		<button disabled={true} class="ml-auto button button-primary button-inline">
			<span class="text-white">Zet selected ({selectedArray.filter(Boolean).length}) 'klaar'</span>
		</button>
	</section>

	{#if (queryError !== null)}
		<div class="error-message p-4">
			{JSON.stringify(queryError)}
		</div>
	{/if}

	<section>
		<h3>Table</h3>
		<table class="ingenium-table">
			<thead>
			<tr>
				<th>
					<div class="flex flex-col items-center justify-end h-full">
						<h4 class="flex-end">Select</h4>
						<input type="checkbox" class="p-0.5 rounded-md border-ingenium-grey-300 placeholder-ingenium-grey-300 font-thin" checked={allSelected} onclick={() => toggleAllSelected(!allSelected)}/>
					</div>
				</th>
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
			{#each orders as order, tableIndex (order.id)}
				<tr>
					<th class="flex justify-center">
						<input class="p-0.5 rounded-md border-ingenium-grey-300 placeholder-ingenium-grey-300 font-thin" type="checkbox" checked={selectedArray[tableIndex]}/>
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
	</section>
</article>