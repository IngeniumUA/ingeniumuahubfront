<script lang="ts">
	import CheckoutTable from '$lib/components/staff/payment/CheckoutTable.svelte';
	import Modal from '$lib/components/layout/modal.svelte';
	import TransactionTable from '$lib/components/staff/payment/TransactionTable.svelte';
	import { makePretty } from '$lib/utilities/style-utilities';
	import { onMount } from 'svelte';
	import { PaymentStatusEnum } from '$lib/models/enums';

	let { baseQueryParam = $bindable(new URLSearchParams({ limit: '100', offset:'5' })) }: { baseQueryParam: URLSearchParams } = $props();

	/**
	 *
	 */
	let selectedTable = $state(0);
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const queryParams = Object.fromEntries(params.entries());
		if (queryParams["selected_table"]) {
			selectedTable = parseInt(queryParams["selected_table"]);
		}
	});
</script>

<main>
	<div class="flex flex-col sm:flex-row gap-2">{#each ["betalingen", "transacties", "refunds"] as tableOption, index}
		<button onclick={() => selectedTable = index}><span
			class="text-blue-900 font-bold {index === selectedTable ? '': 'opacity-75'}">{makePretty(tableOption)}</span></button>
	{/each}</div>
	{#if selectedTable === 0}
		<CheckoutTable baseQueryParam={baseQueryParam} displayPaymentStatus={
		[
			PaymentStatusEnum.all,
			PaymentStatusEnum.successful,
			PaymentStatusEnum.pending,
			PaymentStatusEnum.failed,
			PaymentStatusEnum.cancelled
		]
		}></CheckoutTable>
	{:else if selectedTable === 1}
		<TransactionTable baseQueryParam={baseQueryParam}></TransactionTable>
	{:else if selectedTable === 2}
		<CheckoutTable baseQueryParam={baseQueryParam} displayPaymentStatus={
		[
			PaymentStatusEnum.refunded,
			PaymentStatusEnum.refund_pending
		]
		}></CheckoutTable>
	{/if}

</main>
