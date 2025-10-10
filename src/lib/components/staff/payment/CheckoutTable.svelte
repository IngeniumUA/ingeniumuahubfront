<script lang="ts">
	import type { CheckoutI } from '$lib/models/checkoutI';
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
	import { onMount } from 'svelte';
	import { PaymentStatusEnum } from '$lib/models/enums';
	import { makePretty, prettyDateTime } from '$lib/utilities/style-utilities';

	let {
		baseQueryParam = $bindable(new URLSearchParams({ limit: '100', offset:'5' })),
		displayPaymentStatus = $bindable([
			PaymentStatusEnum.all,
			PaymentStatusEnum.successful,
			PaymentStatusEnum.pending,
			PaymentStatusEnum.failed,
			PaymentStatusEnum.cancelled
		])
	}: { baseQueryParam: URLSearchParams, displayPaymentStatus: PaymentStatusEnum[] } = $props();

	let checkoutCount: number = $state(0);
	let checkouts: CheckoutI[] = $state([])
	let groupedPaymentStatus: Record<string, number> = $state({})

	let groupedPaymentStatusDisplay = $derived(Object.entries(groupedPaymentStatus)
			.map(([key, value]) => [parseInt(key), value])
			.filter(([key]) => {
				return displayPaymentStatus.includes(key);
			})
	)
	let selectedStatus = $state(displayPaymentStatus[0]);

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
		// From status button
		if (selectedStatus !== PaymentStatusEnum.all) searchParam.set('checkout_status', selectedStatus.toString());

		// From query form
		if (queryForm.user_email !== null && queryForm.user_email !== "") searchParam.set('user_email_contains', queryForm.user_email);

		// Combining
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
		checkouts = await CoreCheckoutAPI.queryCheckoutWide(null, queryParam);
		checkoutCount = await CoreCheckoutAPI.countCheckout(null, queryParam);

		// Shallow copy and then making sure we don't filter by checkout_status
		const queryParamNoStatus = new URLSearchParams(queryParam);
		queryParamNoStatus.delete('checkout_status');
		groupedPaymentStatus = await CoreCheckoutAPI.groupByStatus(null, queryParamNoStatus);
	}

	/**
	 *
	 */
	async function refresh() {
		await queryData(queryParam)
	}

	/**
	 * Bulk Operations selection
	 */
	// let selectedArray: boolean[] = $state([])
</script>

<article>
	<div class="flex justify-between items-center">
		<h2 id="checkout-table">Checkouts</h2>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>
	<div class="alert alert-info max-w-3xl">
		<p class="alert-text">Een Checkout is een daadwerkelijke betaling, uitgevoerd met een <span class="italic">payment provider</span>.
			Die betalingen kan worden uitgevoerd via stripe, maar bijvoorbeeld ook gewoon hier gelogd als 'kassa betaling'.
			Er kunnen dus meerdere transacties (voor verschillende gebruikers) in één betaling zitten.</p>
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

	<section class="status-selector">
		{#each groupedPaymentStatusDisplay as [paymentStatus, checkoutStatusCount] (paymentStatus)}
			<button class="status-selector-button {paymentStatus === selectedStatus ? 'status-button-selected': ''}"
							onclick={() => {
								selectedStatus = paymentStatus;
								refresh()
							}}
			>
				<span class={paymentStatus === selectedStatus ? 'text-blue-900': 'text-ingenium-grey-700'}>{makePretty(PaymentStatusEnum[paymentStatus])}</span>
				<span class="font-bold">{checkoutStatusCount}</span>
			</button>
		{/each}
	</section>

	<table class="ingenium-table">
		<thead>
			<tr>
				<th><h4>Select</h4> <input type="checkbox"/></th>
				<th><h4>Checkout</h4></th>
				<th><h4>Status</h4></th>
				<th>
					<div>
						<h4>User</h4>
						<input type="text" placeholder="Email" bind:value={queryForm.user_email}>
					</div>
				</th>
				<th><h4>Created</h4></th>
				<th><h4>Showing {checkouts.length} / {checkoutCount}</h4></th>
			</tr>
		</thead>
		<tbody>
			{#each checkouts as checkout (checkout.checkout_uuid)}
				<tr>
					<th>
						<input type="checkbox"/>
					</th>
					<th>
						<a href={`/staff/payment/${checkout.checkout_uuid}#overview`}>{checkout.checkout_uuid.slice(0, 6)}</a>
					</th>
					<td>
						{makePretty(PaymentStatusEnum[checkout.checkout_status])}
					</td>
					<td>
						<a href={`/staff/user/${checkout.user_email}#overview`}>{checkout.user_email}</a>
					</td>
					<td>
						{prettyDateTime(checkout.created_timestamp)}
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

<style lang="scss">
		h3 {
				@apply font-bold;
		}

		section {
			@apply my-4;
		}

    th {
        div {
            @apply h-14 flex flex-col;
        }

        input {
            @apply p-0.5 rounded-md border-ingenium-grey-300 placeholder-ingenium-grey-300 font-thin;
        }
    }

		.status-selector {
				@apply flex flex-col md:flex-row gap-2;

				.status-selector-button {
						@apply flex flex-col items-start flex-grow p-2 pt-3 pb-3 border border-ingenium-grey-700 rounded-lg;
				};

				.status-button-selected {
						@apply border-blue-900 border-2 font-bold;
				};
		}

		.filter-selector {

		}

		.bulk-operation {

		}
</style>