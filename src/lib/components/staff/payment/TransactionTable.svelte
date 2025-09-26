<script lang="ts">
	import { onMount } from 'svelte';
	import { PaymentStatusEnum } from '$lib/models/enums';
	import { successToast } from '$lib/components/toast/defined_toast';
	import type { TransactionI } from '$lib/models/transactionI';
	import { CoreTransactionAPI } from '$lib/core_api/transaction';
	import { ValidityEnum, ValidityList } from '$lib/models/productsI';
	import { makePretty, prettyDateTime } from '$lib/utilities/style-utilities';

	let { baseQueryParam = $bindable(new URLSearchParams({ limit: '100', offset:'5' })) }: { baseQueryParam: URLSearchParams } = $props();

	let transactionCount: number = $state(0);
	let transactions: TransactionI[] = $state([])
	let transactionStatusTable = $state([])

	onMount(() => {
		queryData(queryParam);
	});

	/**
	 * Query logic
	 */
	interface QueryFormI {
		user_email: string | null;
		validity: ValidityEnum | null;
	}
	let queryForm: QueryFormI = $state({
		user_email: null,
		validity: null
	})
	let queryParam = $derived.by(() => {
		let searchParam = new URLSearchParams()
		if (queryForm.user_email !== null && queryForm.user_email !== "") searchParam.set('user_email_contains', queryForm.user_email);
		if (queryForm.validity !== null) searchParam.set('validity', queryForm.validity.toString());

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
		transactions = await CoreTransactionAPI.queryTransactions(null, queryParam);
		transactionCount = await CoreTransactionAPI.countTransactions(null, queryParam);

		selectedArray = Array.from({ length: transactions.length }, () => false)
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
		selectedArray = Array.from({ length: transactions.length }, () => value)
	}
	let selectedArray: boolean[] = $state([])

	/**
	 * Transaction validity methods
	 */
	let transactionPatchError: Error | null = $state(null);
	async function patchValidity(transaction: TransactionI, validity: ValidityEnum) {
		if (loadingHTTP) return;
		const patchObject = {
			validity: validity
		}
		loadingHTTP = true;
		try {
			const transResult = await CoreTransactionAPI.patchTransaction(null,
				transaction.interaction.interaction_id,
				patchObject);
			transaction.validity = transResult.validity;
			transactionPatchError = null;
			successToast("Validity Patched!")
		} catch (error) {
			transactionPatchError = error instanceof Error ? error : Error('Error validity');
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	function validityToColor(validity: ValidityEnum) {
		switch (validity) {
			case ValidityEnum.valid: return 'green';
			case ValidityEnum.invalid: return 'orange';
			case ValidityEnum.forbidden: return 'red';
			case ValidityEnum.consumed: return 'gray';
		}
	}
</script>

<article>
	<div class="flex justify-between items-center">
		<h2 id="transaction-table">Transactions</h2>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>
	<div class="alert alert-info max-w-3xl">
		<p class="alert-text">TODO: Wat is een transaction</p>
	</div>

	<section class="status-selector">
		{#each transactionStatusTable as paymentStatusGrouped (paymentStatusGrouped["checkout_status"])}
			<div>
				<p>{paymentStatusGrouped["transaction_status"]}</p>
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
	{#if (transactionPatchError !== null)}
		<div class="error-message p-4">
			{JSON.stringify(transactionPatchError)}
		</div>
	{/if}

	<table class="ingenium-table">
		<thead>
		<tr>
			<th><h4>Select</h4> <input type="checkbox" class="p-0.5 rounded-md border-ingenium-grey-300 placeholder-ingenium-grey-300 font-thin" checked={allSelected} onclick={() => toggleAllSelected(!allSelected)}/></th>
			<th><h4>ID</h4></th>
			<th><h4>Checkout</h4></th>
			<th><h4>Status</h4></th>
			<th>
				<div class="form-field">
					<h4>Validity</h4>
					<div class="form-field max-w-32">
						<select id="validity" required bind:value={queryForm.validity}>
							{#each [null, ...ValidityList] as validity}
								<option value={validity}>
									{validity === null ? "All": makePretty(ValidityEnum[validity])}
								</option>
							{/each}
						</select>
					</div>
				</div>
			</th>
			<th>
				<div class="form-field">
					<h4>User</h4>
					<input class="max-w-32" type="email" placeholder="Email" bind:value={queryForm.user_email}>
				</div>
			</th>
			<th><h4>Created</h4></th>
			<th><h4>{transactions.length} / {transactionCount}</h4></th>
		</tr>
		</thead>
		<tbody>
		{#each transactions as transaction, tableIndex (transaction.interaction.interaction_id)}
			<tr>
				<th>
					<input class="p-0.5 rounded-md border-ingenium-grey-300 placeholder-ingenium-grey-300 font-thin" type="checkbox" checked={selectedArray[tableIndex]}/>
				</th>
				<td>
					<a href={`payment/transaction/${transaction.interaction.interaction_id}#overview`}>{transaction.interaction.interaction_id}</a>
				</td>
				<td>
					<a href={`payment/${transaction.checkout_uuid}#overview`}>{transaction.checkout_uuid.slice(0, 6)}</a>
				</td>
				<td>
					{makePretty(PaymentStatusEnum[transaction.transaction_status])}
				</td>
				<td>
					<div class="transaction-validity-selector">
						{#each ValidityList as validity}
							<button type="button"
											class="first:rounded-l-md last:rounded-r-md {validityToColor(validity)} {transaction.validity === validity ? 'border-2': 'border-0'}"
											onclick={() => patchValidity(transaction, validity)}
											disabled={loadingHTTP}>
								<span class="block md:hidden">{makePretty(ValidityEnum[validity]).substring(0, 1)}</span>
								<span class="hidden md:block">{makePretty(ValidityEnum[validity])}</span>
							</button>
						{/each}
					</div>
				</td>
				<td>
					<a href={`user/${transaction.interaction.user_uuid}#overview`}>{transaction.interaction.user_email}</a>
				</td>
				<td>
					{prettyDateTime(transaction.created_timestamp)}
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

  .transaction-validity-selector {
      button {
          @apply text-xs text-white py-1 px-2 inline-flex items-center justify-center whitespace-nowrap align-middle font-semibold disabled:cursor-not-allowed  w-full  drop-shadow;
      }
      .red {@apply border-red-700 text-red-700 bg-red-100;}
      .orange {@apply  border-orange-700 text-orange-700 bg-orange-100;}
      .green {@apply  border-green-700 text-green-700 bg-green-100;}
      .gray {@apply  border-gray-700 text-gray-700 bg-gray-100;}

      @apply ml-auto mr-4 rounded-lg bg-gray-100 flex flex-row;
  }
</style>