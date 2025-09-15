<script lang="ts">
	import type { CheckoutI } from '$lib/models/checkoutI';
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
	import { onMount } from 'svelte';

	let checkouts: CheckoutI[] = $state([])
	let checkoutStatusList = $state([])

	let queryParam = $state(new URLSearchParams()) // todo bindable via input with default
	let loadingHTTP = $state(false);

	let queryError: Error | null = null
	async function queryData(queryParam: URLSearchParams) {
		if (loadingHTTP) return;
		checkouts = await CoreCheckoutAPI.queryCheckoutWide(null, queryParam);
	}

	onMount(() => {
		queryData(queryParam);
	});

	/**
	 * Bulk Operations selection
	 */
	// let selectedArray: boolean[] = $state([])
</script>

<article>
	<h2>Checkouts</h2>
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
				<th>Doos voor alles</th>
				<th>Checkout</th>
			</tr>
		</thead>
		<tbody>
			{#each checkouts as checkout (checkout.checkout_uuid)}
				<tr>
					<th>
						Doos voor deze rij
					</th>
					<th>
						<a href={`payment/${checkout.checkout_uuid}#overview`}>{checkout.checkout_uuid.slice(6)}</a>
					</th>
					<td>
						{checkout.user_email}
					</td>
					<td>
						... Button voor opties
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

</article>

<style>
	.status-selector {

	}

	.filter-selector {

	}

	.bulk-operation {

	}
</style>