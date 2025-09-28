<script lang="ts">
	import type { CheckoutI } from '$lib/models/checkoutI';
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
	import { onMount } from 'svelte';
	import { PaymentStatusEnum } from '$lib/models/enums';
	import { successToast } from '$lib/components/toast/defined_toast';
	import { makePretty, prettyDateTime } from '$lib/utilities/style-utilities';

	let { baseQueryParam = $bindable(new URLSearchParams({ limit: '100', offset:'5' })) }: { baseQueryParam: URLSearchParams } = $props();

	let checkoutCount: number = $state(0);
	let checkouts: CheckoutI[] = $state([])
	let checkoutStatusList = $state([])

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
		checkouts = await CoreCheckoutAPI.queryCheckoutWide(null, queryParam);
		checkoutCount = await CoreCheckoutAPI.countCheckout(null, queryParam);
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
</script>

<article>
	<div class="flex justify-between items-center">
		<h2 id="checkout-table">Checkouts</h2>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>
	<div class="alert alert-info mb-4 max-w-3xl">
		<p class="alert-text">Een Checkout is een daadwerkelijke betaling, uitgevoerd met een <span class="italic">payment provider</span>.
			Die betalingen kan worden uitgevoerd via stripe, maar bijvoorbeeld ook gewoon hier gelogd als 'kassa betaling'.
			Er kunnen dus meerdere transacties (voor verschillende gebruikers) in één betaling zitten.</p>
	</div>

	<section class="status-selector">
		{#each checkoutStatusList as checkoutStatusBox (checkoutStatusBox["checkout_status"])}
		<div>
			<p>{checkoutStatusBox["checkout_status"]}</p>
		</div>
		{/each}
		<p>Hier de stripe stijl van status selector</p>
	</section>

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
						{checkout.user_email}
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

<style>
		h3 {
				@apply font-bold;
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

		}

		.filter-selector {

		}

		.bulk-operation {

		}
</style>