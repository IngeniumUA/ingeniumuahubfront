<script lang="ts">
	import { onMount } from 'svelte';
	import { PaymentStatusEnum } from '$lib/models/enums';
	import { successToast } from '$lib/components/toast/defined_toast';
	import type { TransactionI } from '$lib/models/transactionI';
	import { CoreTransactionAPI } from '$lib/core_api/transaction';
	import { ValidityEnum, ValidityList } from '$lib/models/productsI';
	import { makePretty, prettyDateTime } from '$lib/utilities/style-utilities';
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
	import type { ProductBlueprintI } from '$lib/models/product_blueprint/ProductBlueprintI';

	let {
		baseQueryParam = $bindable(new URLSearchParams({ limit: '100', offset:'5' }))
	}: {
		baseQueryParam: URLSearchParams
	} = $props();

	let transactionCount: number = $state(0);
	let transactions: TransactionI[] = $state([])
	let groupedPaymentStatus: Record<string, number> = $state({})

	let pricePolicyTable: [] = $state([])
	let productBlueprintIdList = $derived.by(() => {
		return pricePolicyTable.reduce(
			(acc: { product_blueprint_id: number; product_blueprint_name: string }[],
			 val: { product_blueprint_id: number; product_blueprint_name: string }
			)=> {
			// val is object with properties
			if (!acc.some((entry) => {
				return entry.product_blueprint_id === val.product_blueprint_id;
			})) {
				acc.push({
					product_blueprint_name: val.product_blueprint_name,
					product_blueprint_id: val.product_blueprint_id,
				})
			}
			return acc
		}, [])
	})
	let pricePolicyIdList = $derived.by(() => {
		return pricePolicyTable.reduce(
			(acc: { price_policy_id: number; price_policy_name: string, price_eu: number }[],
			 val: { price_policy_id: number; price_policy_name: string, price_eu: number }
			)=> {
				// val is object with properties
				if (!acc.some((entry) => {
					return entry.price_policy_id === val.price_policy_id;
				})) {
					acc.push({
						price_policy_name: val.price_policy_name,
						price_policy_id: val.price_policy_id,
						price_eu: val.price_eu,
					})
				}
				return acc
			}, [])
	})

	let displayPaymentStatus = [
		PaymentStatusEnum.all,
		PaymentStatusEnum.successful,
		PaymentStatusEnum.pending,
		PaymentStatusEnum.failed,
		PaymentStatusEnum.cancelled
	] // Which payment status to display
	let groupedPaymentStatusDisplay = $derived(Object.entries(groupedPaymentStatus)
		.map(([key, value]) => [parseInt(key), value])
		.filter(([key]) => {
			return displayPaymentStatus.includes(key);
		})
	)
	let selectedStatus = $state(PaymentStatusEnum.all);

	onMount(() => {
		queryData(queryParam);
	});

	/**
	 * Query logic
	 */
	interface QueryFormI {
		user_email: string | null;
		validity: ValidityEnum | null;
		productBlueprintId: number | null;
		pricePolicyId: number | null;
	}
	let queryForm: QueryFormI = $state({
		user_email: null,
		validity: null,
		productBlueprintId: null,
		pricePolicyId: null
	})
	let queryParam = $derived.by(() => {
		let searchParam = new URLSearchParams()
		// From status button
		if (selectedStatus !== PaymentStatusEnum.all) searchParam.set('transaction_status', selectedStatus.toString());

		// From query form
		if (queryForm.user_email !== null && queryForm.user_email !== "") searchParam.set('user_email_contains', queryForm.user_email);
		if (queryForm.validity !== null) searchParam.set('validity', queryForm.validity.toString());
		if (queryForm.productBlueprintId !== null) searchParam.set('product_blueprint_id', queryForm.productBlueprintId.toString());
		if (queryForm.pricePolicyId !== null) searchParam.set('price_policy_id', queryForm.pricePolicyId.toString());

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

		const queryParamItem = new URLSearchParams(queryParam);
		if (queryParamItem.has('item_id')) queryParamItem.set('source_item_id', queryParamItem.get('item_id')!);
		pricePolicyTable = await CoreProductBlueprintAPI.queryPricePolicyTable(null, queryParamItem);

		// Shallow copy and then making sure we don't filter by checkout_status
		const queryParamNoStatus = new URLSearchParams(queryParam);
		queryParamNoStatus.delete('transaction_status');
		groupedPaymentStatus = await CoreTransactionAPI.groupByStatus(null, queryParamNoStatus);

		selectedArray = Array.from({ length: transactions.length }, () => false)
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

	/**
	 * Downloading
	 */
	async function download() {
		if (loadingHTTP) return;
		loadingHTTP = true;
		try {
			await CoreTransactionAPI.downloadTransactions(null, queryParam);
			transactionPatchError = null;
		} catch (error) {
			transactionPatchError = error instanceof Error ? error : Error('Error download');
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}
</script>

<article>
	<div class="flex justify-between items-center">
		<h2 id="transaction-table">Transactions</h2>
		<button onclick={download} class="ml-auto button button-primary w-24 button-inline">
			<span class="text-white">Download</span>
		</button>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>
	<div class="alert alert-info max-w-3xl">
		<p class="alert-text">Een transactie is de 'aankoop' van een product door een gebruiker. Het overdragen van geld zit in een checkout (dus er kunnen meerdere transactions in één checkout zitten). Een Transactie heeft ook een validity, die zegt of het product 'geldig' is aangekocht. Bv. Lid prijs wanneer je geen lid bent -> invalid.</p>
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
	{#if (transactionPatchError !== null)}
		<div class="error-message p-4">
			{JSON.stringify(transactionPatchError)}
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
			<th><h4>Select</h4> <input type="checkbox" class="p-0.5 rounded-md border-ingenium-grey-300 placeholder-ingenium-grey-300 font-thin" checked={allSelected} onclick={() => toggleAllSelected(!allSelected)}/></th>
			<th><h4>ID</h4></th>
			<th><h4>Checkout</h4></th>
			<th><h4>Status</h4></th>
			<th>
				<h4>Product Blueprint</h4>
				<div class="form-field max-w-32">
					<select id="product_blueprint_id" required bind:value={queryForm.productBlueprintId}>
						{#each [null, ...productBlueprintIdList] as productBlueprint}
							<option value={productBlueprint?.product_blueprint_id ?? null}>
								{productBlueprint === null ? "All": makePretty(productBlueprint?.product_blueprint_name)}
							</option>
						{/each}
					</select>
				</div>
			</th>
			<th>
				<h4>Price Policy</h4>
				<div class="form-field max-w-32">
					<select id="price_policy_id" required bind:value={queryForm.pricePolicyId}>
						{#each [null, ...pricePolicyIdList] as pricePolicy}
							<option value={pricePolicy?.price_policy_id ?? null}>
								{pricePolicy === null ? "All": `€${pricePolicy.price_eu} ${pricePolicy.price_policy_name === null ? "": makePretty(pricePolicy.price_policy_name)}`}
							</option>
						{/each}
					</select>
				</div>
			</th>
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
					{transaction.purchased_product['name']}
				</td>
				<td>
					{transaction.purchased_product.price_policy?.name ?? transaction.purchased_product.price_policy?.id}
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

<style lang="scss">
	h3 {
			@apply font-bold;
	}

  section {
    @apply my-4;
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