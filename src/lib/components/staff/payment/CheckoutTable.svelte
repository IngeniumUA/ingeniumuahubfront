<script lang="ts">
	import type { CheckoutI } from '$lib/models/checkoutI';
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
	import { onMount } from 'svelte';
	import { PaymentStatusEnum } from '$lib/models/enums';
	import { makePretty, paymentStatusToColor, prettyDateTime } from '$lib/utilities/style-utilities';
	import AddCheckoutModal from '$lib/components/staff/payment/AddCheckoutModal.svelte';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { hasRole } from '$lib/states/auth.svelte';
	import { PaymentProviderEnum, PaymentProviderList } from '$lib/models/productsI';
	import AddCheckoutBulk from '$lib/components/staff/payment/AddCheckoutBulk.svelte';

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
		checkoutUUID: string | null;
		queryOffset: number;
		queryLimit: number;
		paymentProvider: PaymentProviderEnum | null;
	}
	let queryForm: QueryFormI = $state({
		user_email: null,
		checkoutUUID: null,
		queryOffset: 0,
		queryLimit: parseInt(baseQueryParam.get('limit') ?? '50'),
		paymentProvider: null,
	})
	let queryParam = $derived.by(() => {
		let searchParam = new URLSearchParams()
		// From status button
		if (selectedStatus !== PaymentStatusEnum.all) searchParam.set('checkout_status', selectedStatus.toString());

		// From query form
		searchParam.set('offset', (queryForm.queryOffset * queryForm.queryLimit).toString());
		searchParam.set('limit', queryForm.queryLimit.toString());
		if (queryForm.user_email !== null && queryForm.user_email !== "") searchParam.set('user_email_contains', queryForm.user_email);
		if (queryForm.checkoutUUID !== null && queryForm.checkoutUUID !== "") searchParam.set('checkout_uuid', queryForm.checkoutUUID);
		if (queryForm.paymentProvider !== null) searchParam.set("payment_provider", queryForm.paymentProvider.toString())

		// Combining
		let queryParam = new URLSearchParams()
		for (const [key, value] of baseQueryParam) {
			queryParam.set(key, value);
		}
		for (const [key, value] of searchParam) {
			queryParam.set(key, value);
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
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	$effect(() => {
		$state.snapshot(queryForm);
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(refresh, 1000);
	});

	/**
	 * Boolean state for add new modal
	 */
	let showAddingNew = $state(false);
	let bulkUploadModal = $state(false);

	/**
	 * Bulk Operations selection
	 */
	// let selectedArray: boolean[] = $state([])

	/**
	 * Downloading
	 */
	async function download() {
		if (loadingHTTP) return;
		loadingHTTP = true;
		try {
			await CoreCheckoutAPI.downloadCheckouts(null, queryParam);
			checkoutPatchError = null;
		} catch (error) {
			checkoutPatchError = error instanceof Error ? error : Error('Error download');
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	/**
	 * Checkout operations
	 */
	let checkoutPatchError: Error | null = null

	async function cancelCheckout(index: number) {
		if (loadingHTTP) return;

		const checkout = checkouts.at(index);
		if (checkout === undefined) return;

		let patchObj = {
			checkout_status: PaymentStatusEnum.cancelled
		};
		loadingHTTP = true;

		try {
			const checkoutResult = await CoreCheckoutAPI.patchCheckout(null,
				checkout.checkout_uuid,
				patchObj);
			checkout.checkout_status = checkoutResult.checkout_status;
			checkoutPatchError = null;
		} catch (error) {
			checkoutPatchError = error instanceof Error ? error : Error('Error patching checkout status');
		} finally {
			loadingHTTP = false;
			if (checkoutPatchError !== null) {
				failedToast(checkoutPatchError.message);
			} else {
				successToast("Checkout Cancelled!")
			}
		}
	}
</script>

<article>
	<div class="flex justify-between items-center">
		<h2 id="checkout-table">Checkouts</h2>

		<button onclick={() => bulkUploadModal = !bulkUploadModal} class="ml-auto button button-primary w-24 button-inline">
			<span class="text-white">Bulk Add</span>
		</button>
		<button onclick={() => showAddingNew = !showAddingNew} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Add</span>
		</button>
		<button onclick={download} disabled={loadingHTTP} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Download</span>
		</button>
		<button onclick={refresh} disabled={loadingHTTP} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>
	<div class="alert alert-info max-w-3xl">
		<p class="alert-text">Een Checkout is een daadwerkelijke betaling, uitgevoerd met een <span class="italic">payment provider</span>.
			Die betalingen kan worden uitgevoerd via stripe, maar bijvoorbeeld ook gewoon hier gelogd als 'kassa betaling'.
			Er kunnen dus meerdere transacties (voor verschillende gebruikers) in één betaling zitten.</p>
	</div>

<!--	<section class="filter-selector">-->
<!--		<h3>Filter</h3>-->
<!--		<p>Hier vanalle filters om toe te passen op de table.-->
<!--		Mis zoals price policy ook zo knop om een dropdown te openen-->
<!--		(met dan al zo, de waarden die via props zijn ingevoerd op disabled? Da like ik wel</p>-->
<!--	</section>-->

<!--	<section class="bulk-operation">-->
<!--		<h3>Apply</h3>-->
<!--		<p>Om bulk operaties uit te voeren zoals refunds. Hier ook de export knop zetten?-->
<!--		Zwz voorda de operatie wordt uitgevoerd zo een buffer knop van "are you sure?"</p>-->
<!--	</section>-->

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
				<th class="flex flex-col items-center justify-center"><h4>Select</h4> <input type="checkbox"/></th>
				<th>
					<div>
						<h4>Checkout</h4>
						<input type="text" placeholder="checkout uuid" bind:value={queryForm.checkoutUUID}>
					</div>
				</th>
				<th><h4>Status</h4></th>
				<th><h4>Amount</h4></th>
				<th>
					<div>
						<h4>User</h4>
						<input type="email" placeholder="Email" bind:value={queryForm.user_email}>
					</div>
				</th>
				{#if hasRole('webmaster')}
					<th>
						<div class="form-field">
							<h4>Payment Provider</h4>
							<div class="form-field max-w-32">
								<select id="payment_provider" required bind:value={queryForm.paymentProvider}>
									{#each [null, ...PaymentProviderList] as paymentProvider}
										<option value={paymentProvider}>
											{paymentProvider === null ? "All": makePretty(PaymentProviderEnum[paymentProvider])}
										</option>
									{/each}
								</select>
							</div>
						</div>
					</th>
				{/if}
				<th class="p-0"><PaginationComponent
					bind:maxTotal={checkoutCount}
					bind:fetchedTotal={checkouts.length}
					bind:currentOffset={queryForm.queryOffset}
					bind:currentLimit={queryForm.queryLimit}
					bind:httpLoading={loadingHTTP}
					refresh={refresh}
				>
				</PaginationComponent></th>
			</tr>
		</thead>
		<tbody>
			{#each checkouts as checkout, tableIndex (checkout.checkout_uuid)}
				<tr>
					<th class="flex justify-center">
						<input type="checkbox"/>
					</th>
					<th>
						<a href={`/staff/payment/${checkout.checkout_uuid}#overview`}>{checkout.checkout_uuid.slice(0, 6)}</a>
					</th>
					<td>
						<span class="rounded-lg py-1 px-2 flex flex-row flex-nowrap {paymentStatusToColor(checkout.checkout_status)}">
							{makePretty(PaymentStatusEnum[checkout.checkout_status])}
							{#if (checkout.checkout_status === PaymentStatusEnum.pending)}
								<button onclick={() => cancelCheckout(tableIndex)}>
                  <svg fill="#7c2d12" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <title>cancel</title>
                    <path d="M16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM21.961 12.209c0.244-0.244 0.244-0.641 0-0.885l-1.328-1.327c-0.244-0.244-0.641-0.244-0.885 0l-3.761 3.761-3.761-3.761c-0.244-0.244-0.641-0.244-0.885 0l-1.328 1.327c-0.244 0.244-0.244 0.641 0 0.885l3.762 3.762-3.762 3.76c-0.244 0.244-0.244 0.641 0 0.885l1.328 1.328c0.244 0.244 0.641 0.244 0.885 0l3.761-3.762 3.761 3.762c0.244 0.244 0.641 0.244 0.885 0l1.328-1.328c0.244-0.244 0.244-0.641 0-0.885l-3.762-3.76 3.762-3.762z"></path>
                  </svg>
                </button>
							{/if}
						</span>
					</td>
					<td>€{checkout.amount}</td>
					<td>
						<a href={`/staff/user/${checkout.user_email}#overview`}>{checkout.user_email}</a>
					</td>
					{#if hasRole('webmaster')}
						<td>
							{PaymentProviderEnum[checkout.payment_provider]}
						</td>
					{/if}
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
	{#if checkouts.length === 0}
		<div class="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
			<p class="text-gray-500 mb-4">Geen betalingen gevonden met deze filters.</p>
		</div>
	{/if}
</article>

<AddCheckoutModal bind:isOpen={ showAddingNew } bind:startingUserEmail={queryForm.user_email} startingItemId={parseInt(baseQueryParam.get('item_id') ?? "") ?? null}></AddCheckoutModal>

<AddCheckoutBulk bind:isOpen={ bulkUploadModal } startingItemId={parseInt(baseQueryParam.get('item_id') ?? "") ?? null}></AddCheckoutBulk>

<style lang="scss">
		section {
			@apply my-4;
		}

    th {
				@apply align-bottom;

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
          @apply border-blue-900 bg-blue-50 border-2 font-bold;
				};
		}

    .red {@apply border-red-700 text-red-700 bg-red-100;}
    .orange {@apply  border-orange-700 text-orange-700 bg-orange-100;}
    .green {@apply  border-green-700 text-green-700 bg-green-100;}
    .gray {@apply  border-gray-700 text-gray-700 bg-gray-100;}
</style>