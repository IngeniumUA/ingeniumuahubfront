<script lang="ts">
	import CheckoutTable from '$lib/components/staff/payment/CheckoutTable.svelte';
	import TransactionTable from '$lib/components/staff/payment/TransactionTable.svelte';
	import { makePretty } from '$lib/utilities/style-utilities';
	import { onMount } from 'svelte';
	import { PaymentStatusEnum } from '$lib/models/enums';

	let { baseQueryParam = $bindable(new URLSearchParams({ limit: '100', offset:'5' })), baseSelectedTable = 'betalingen' }
		: { baseQueryParam: URLSearchParams, baseSelectedTable: string | null } = $props();

	/**
	 *
	 */
	let selectedTable = $state(baseSelectedTable);
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const queryParams = Object.fromEntries(params.entries());
		if (queryParams["selected_table"]) {
			selectedTable = queryParams["selected_table"];
		}
	});
</script>

<main>
	<div class="flex flex-row gap-2">{#each ["betalingen", "transacties", "refunds"] as tableOption}
		<button onclick={() => selectedTable = tableOption}><span
			class="text-blue-900 font-bold {tableOption === selectedTable ? '': 'opacity-75'}">{makePretty(tableOption)}</span></button>
	{/each}</div>
	{#if selectedTable === "betalingen"}
		<CheckoutTable baseQueryParam={baseQueryParam} displayPaymentStatus={
		[
			PaymentStatusEnum.all,
			PaymentStatusEnum.successful,
			PaymentStatusEnum.pending,
			PaymentStatusEnum.failed,
			PaymentStatusEnum.cancelled
		]
		}></CheckoutTable>
	{:else if selectedTable === "transacties"}
		<TransactionTable baseQueryParam={baseQueryParam}></TransactionTable>
	{:else if selectedTable === "refunds"}
		<CheckoutTable baseQueryParam={baseQueryParam} displayPaymentStatus={
		[
			PaymentStatusEnum.refunded,
			PaymentStatusEnum.refund_pending
		]
		}></CheckoutTable>
	{/if}

</main>
