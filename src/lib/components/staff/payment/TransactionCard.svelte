<script lang="ts">
	import type { TransactionI } from '$lib/models/transactionI';
	import { ValidityEnum, ValidityList } from '$lib/models/productsI';
	import { makePretty } from '$lib/utilities/style-utilities';
	import { successToast } from '$lib/components/toast/defined_toast';
	import { CoreTransactionAPI } from '$lib/core_api/transaction';
	import ExplodedLogPreview from '$lib/components/staff/dblog/ExplodedLogPreview.svelte';
	import { DBLogAPI } from '$lib/core_api/dblog_api';
	import type { DBLogExplodedI } from '$lib/models/dblog';

	let { isOpen = $bindable(), loadingHTTP = $bindable(), transaction = $bindable(), transactionIndex = null }: { isOpen: boolean, loadingHTTP: boolean, transaction: TransactionI, transactionIndex: number | null } = $props();
	let logs: DBLogExplodedI[] = $state([])

	let isOpenBuffer = $state(isOpen);
	$effect(() => {
		if (isOpen && !isOpenBuffer) { // Only on 'open' procedure
			refreshLogs()
		}
		isOpenBuffer = isOpen;
	})
	async function refreshLogs() {
		const queryParam = new URLSearchParams({
			table_name: 'hubtransaction',
			row_primary_key: `${transaction.interaction.interaction_id}`
		});
		logs = await DBLogAPI.queryCoreDBLogExploded(null, queryParam)
	}

	let transactionPatchError: Error | null = $state(null);
	async function patchValidity(validity: ValidityEnum) {
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
			case ValidityEnum.valid: {
				return 'green'
			}
		case ValidityEnum.invalid: {
				return 'orange'
			}
		case ValidityEnum.forbidden: {
				return 'red'
			}
		case ValidityEnum.consumed: {
				return 'gray'
			}
		}
	}
</script>

<div class="flex justify-between items-center">
	<h3 id="transaction-{transaction.interaction.interaction_id}" class="text-ingenium-grey-700 font-bold">
		{#if transactionIndex !== null}{(transactionIndex ?? 0) + 1}){/if} {transaction.product_blueprint_name} at
		{#if transaction.purchased_product.price_policy?.name !== null}{transaction.purchased_product.price_policy?.name} -{/if}
		{#if transaction.purchased_product.price_policy?.price === 0}Gratis{:else}€{transaction.purchased_product.price_policy?.price}{/if}
	</h3>

	<div class="transaction-validity-selector">
		{#each ValidityList as validity}
			<button type="button"
							class="first:rounded-l-md last:rounded-r-md {validityToColor(validity)} {transaction.validity === validity ? 'border-2': 'border-0'}"
							onclick={() => patchValidity(validity)}
							disabled={loadingHTTP}>
				<span class="block md:hidden">{makePretty(ValidityEnum[validity]).substring(0, 1)}</span>
				<span class="hidden md:block">{makePretty(ValidityEnum[validity])}</span>
			</button>
		{/each}
	</div>

	<button type="button" class="button button-primary button-icon-only relative inline-flex items-center justify-center"
					aria-controls="mobile-menu" aria-expanded="{isOpen}"
					onclick={ () => isOpen = !isOpen }
	>
		<span class="sr-only">Open navigatie</span>
		{#if isOpen}
			<svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		{:else}
			<svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
			</svg>
		{/if}
	</button>
</div>
{#if isOpen}
	<form class="ingenium-form flex flex-row gap-4">
	</form>

	<div class="flex flex-col md:flex-row gap-2">
		<div class="order-1 md:order-3 md:flex-[1]">
			<h4>Purchased Product</h4>
			<p>Momentopname van het gekochte product</p>
			<pre class="text-xs text-ingenium-grey-900">{JSON.stringify(transaction.purchased_product, null, 2)}</pre>
		</div>

		<div class="hidden md:block w-px mx-4 bg-gray-200 order-2"></div>

		<div class="order-3 md:order-1 md:flex-[2]">
			<h4>Recent History</h4>
			<ExplodedLogPreview targetObject={transaction} explodedDBLogs={logs}></ExplodedLogPreview>
		</div>
	</div>

	<div class="mt-4 flex justify-end">
		<button class="button button-primary button-inline">
			<span class="text-white">Update</span>
		</button>
	</div>

	{#if (transactionPatchError !== null)}
		<div class="error-message p-4">
			{JSON.stringify(transactionPatchError)}
		</div>
	{/if}
{/if}

<style>
		h4 {
        @apply text-ingenium-grey-800 font-bold;
		}

	.transaction-validity-selector {
			button {
					@apply text-sm text-white py-1 px-2 inline-flex items-center justify-center whitespace-nowrap align-middle font-semibold disabled:cursor-not-allowed  w-full  drop-shadow;
			}

			.red {
					@apply border-red-700 text-red-700 bg-red-300;
			}
      .orange {
          @apply  border-orange-700 text-orange-700 bg-orange-300;
      }
      .green {
          @apply  border-green-700 text-green-700 bg-green-300;
      }
			.gray {
          @apply  border-gray-700 text-gray-700 bg-gray-300;
			}

			@apply ml-auto mr-4 rounded-lg bg-gray-100 flex flex-row;
	}
</style>