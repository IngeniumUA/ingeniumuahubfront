<script lang="ts">
	import Modal from '$lib/components/layout/modal.svelte';
	import {
		PaymentProviderEnum,
		PaymentProviderList,
		PaymentProviderUtils,
		type ProductOutI,
		ValidityEnum,
		ValidityList
	} from '$lib/models/productsI';
	import { makePretty } from '$lib/utilities/style-utilities';
	import { CoreItemAPI } from '$lib/core_api/core_api';
	import { PaymentStatusEnum } from '$lib/models/enums';
	import { handleRequest } from '$lib/utilities/httpUtilities';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';

	let { startingItemId = $bindable(null), startingUserEmail = $bindable(null), isOpen = $bindable(false) }: {startingUserEmail: string | null, startingItemId: number | null, isOpen: boolean } = $props();

	let loadingHTTP: boolean = $state(false);
	let createError: string | null = $state(null);

	let addingTransaction: boolean = $state(false);
	let transactionInputUser: boolean = $state(false);

	interface Form {
		forceCreate: boolean;
		createUserIfMissing: boolean;

		user: string | null,
		itemId: number | null,
		paymentProvider: PaymentProviderEnum | null,
		note: string | null,

		transactions: any[]
	}
	let form: Form = $state({
		forceCreate: false,
		createUserIfMissing: true,
		user: startingUserEmail,
		itemId: startingItemId,
		paymentProvider: null,
		transactions: [],
		note: null,
	})

	/**
	 * Transaction form / adding
	 */
	interface TransactionForm {
		user: string | null,
		productOut: ProductOutI | null,
		validity: ValidityEnum,
	}
	let transactionForm: TransactionForm = $state({
		user: null,
		validity: ValidityEnum.valid,
		productOut: null,
	})

	let transactionError: string | null = $state(null);
	async function addTransaction() {
		transactionError = null;

		if (transactionForm.productOut === null) return;

		const user = transactionInputUser ? transactionForm.user: form.user;
		const transactionIn = {
			item_id: form.itemId,
			product_blueprint_id: transactionForm.productOut.blueprint_id,
			price_policy_id: transactionForm.productOut.price_policy?.id,
			validity: transactionForm.validity,
			user: user,
		}
		form.transactions.push(transactionIn);
		addingTransaction = false;
	}

	/**
	 *
	 */
	async function createButton() {
		if (loadingHTTP) return;
		createError = null;

		if (form.transactions.length == 0) {
			createError = "Voeg eerst transacties toe!"
			return;
		}

		const payment_status = PaymentProviderUtils.isExternal(form.paymentProvider) ? PaymentStatusEnum.pending: PaymentStatusEnum.successful;

		const checkoutIn = {
			user_email: form.user,
			payment_provider: form.paymentProvider,
			note: form.note,
			transactions: form.transactions.map((transactionForm) => ({
				// Injecting payment status in each transaction (I gues this could be done better but this aligns with backend)
				status: payment_status,
				...transactionForm
			})),
		};

		const queryParam = new URLSearchParams({
			force_create: `${form.forceCreate}`,
			create_user_if_none: `${form.createUserIfMissing}`
		});

		loadingHTTP = true;
		try {
			await CoreCheckoutAPI.postCheckout(null, checkoutIn, queryParam).catch(handleRequest);
			isOpen = false;
			successToast("Checkout created!")
		} catch (error) {
			failedToast(`Failed ${error}`);
			createError = (error as Error).message;
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}
</script>

<style lang="scss">
	article {
		@apply p-4 flex flex-col md:flex-row gap-4;
	}
	h3 {
		@apply font-bold;
	}
</style>

<Modal title="Checkout Toevoegen" maxWidth="max-w-5xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<!-- Main body -->
		<article>
			<form class="ingenium-form">
				<fieldset>
					<h3>Checkout</h3>
					<div class="form-field">
						<label for="email">User email</label>
						<input id="email" type="text" required bind:value={form.user}/>
						<p>Email van de gebruiker</p>
					</div>
					<div class="form-field">
						<label for="item">Item</label>
						<input id="item" type="text" required bind:value={form.itemId} disabled={startingItemId !== null}/>
						<p>Source Items voor producten in transactions</p>
					</div>

					<h3>Payment Information</h3>
					<div class="form-field">
						<label for="payment_provider">Payment Provider</label>

						<select id="payment_provider" required bind:value={form.paymentProvider}>
							{#each PaymentProviderList as paymentProvider}
								<option value={paymentProvider}>
									{makePretty(PaymentProviderEnum[paymentProvider])}
								</option>
							{/each}
						</select>
						<p>Hoe er betaald moet worden</p>
					</div>
				</fieldset>
			</form>

			<form class="ingenium-form" onsubmit={(e) => { e.preventDefault(); addTransaction(); }}>
				<h3>Transactions</h3>
				{#each form.transactions as transaction}
					<div>
						{JSON.stringify(transaction)}
					</div>
				{/each}

				{#if addingTransaction}
					{#if form.transactions !== null}
						{#await CoreItemAPI.queryProductsForItem(form.itemId ?? 0) then productOutList}
							<div class="flex flex-row gap-2">
								<fieldset>
									<div class="form-field">
										<label for="product_and_policy">Product and Policy</label>
										<select id="product_and_policy" required bind:value={transactionForm.productOut}>
											{#each productOutList as productOut}
												<option value={productOut}>
													{productOut.name} €{productOut.price_policy?.price} {#if productOut.price_policy?.name !== null}({productOut.price_policy?.name}){/if}
												</option>
											{/each}
										</select>
									</div>
								</fieldset>

								<fieldset>
									<div class="form-field">
										<label for="validity">Validity</label>
										<select id="validity" required bind:value={transactionForm.validity}>
											{#each ValidityList as validity}
												<option value={validity}>
													{makePretty(ValidityEnum[validity])}
												</option>
											{/each}
										</select>
									</div>
								</fieldset>

								{#if transactionInputUser}
									<fieldset>
										<div class="form-field">
											<label for="transation_email">User email</label>
											<input id="transation_email" type="text" required bind:value={transactionForm.user}/>
											<p>Email van de gebruiker voor deze transactie</p>
										</div>
									</fieldset>
								{/if}

								<label class="inline-flex items-center cursor-pointer my-4">
									<input type="checkbox"
												 class="hidden peer"
												 bind:checked={transactionInputUser}>
									<div class="
									relative w-11 h-6
									bg-gray-200 dark:bg-gray-700
									rounded-full
									peer-checked:bg-blue-900 dark:peer-checked:bg-blue-900
									after:content-['']
									after:absolute after:top-[2px] after:start-[2px]
									after:w-5 after:h-5
									after:bg-white after:rounded-full
									after:transition-transform
									peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
									"></div>
									<span class="ms-3 text-sm font-medium text-gray-600">{#if (transactionInputUser)}Other user{:else}Same user{/if}</span>
								</label>
							</div>

							<div class="flex flex-row gap-2 items-center">
								<button class="button button-primary">Add</button>
								<button class="button button-secondary" onclick={() => {addingTransaction = false}}>Cancel</button>
							</div>
						{/await}
						{#if (transactionError !== null)}
							<div class="error-message p-4">
								{JSON.stringify(transactionError)}
							</div>
						{/if}
					{:else}
						<p>Select item first</p>
					{/if}
				{:else}
					<button class="button button-primary" onclick={() => {addingTransaction = true}}>Add Transaction</button>
				{/if}
			</form>
		</article>

		<div class="p-2 flex border-t dark:border-gray-600 border-gray-200">
			<label class="inline-flex items-center cursor-pointer my-4">
				<input type="checkbox"
							 class="hidden peer"
							 bind:checked={form.createUserIfMissing}>
				<div class="
									relative w-11 h-6
									bg-gray-200 dark:bg-gray-700
									rounded-full
									peer-checked:bg-blue-900 dark:peer-checked:bg-blue-900
									after:content-['']
									after:absolute after:top-[2px] after:start-[2px]
									after:w-5 after:h-5
									after:bg-white after:rounded-full
									after:transition-transform
									peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
									"></div>
				<span class="ms-3 text-sm font-medium text-gray-600">Create user if missing {#if (form.createUserIfMissing)}On{:else}Off{/if}</span>
			</label>

			<label class="inline-flex items-center cursor-pointer my-4">
				<input type="checkbox"
							 class="hidden peer"
							 bind:checked={form.forceCreate}>
				<div class="
									relative w-11 h-6
									bg-gray-200 dark:bg-gray-700
									rounded-full
									peer-checked:bg-blue-900 dark:peer-checked:bg-blue-900
									after:content-['']
									after:absolute after:top-[2px] after:start-[2px]
									after:w-5 after:h-5
									after:bg-white after:rounded-full
									after:transition-transform
									peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
									"></div>
				<span class="ms-3 text-sm font-medium text-gray-600">Force Create {#if (form.forceCreate)}On{:else}Off{/if}</span>
			</label>

			<button class="ml-auto button button-primary"
							disabled={loadingHTTP}
							onclick={createButton}>
				<span class="text-white">Create</span>
			</button>
		</div>

		{#if (createError !== null)}
			<div class="error-message p-4">
				{JSON.stringify(createError)}
			</div>
		{/if}

	{/snippet}
</Modal>