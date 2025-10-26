<script lang="ts">
	import Modal from '$lib/components/layout/modal.svelte';
	import type { PaymentProviderEnum } from '$lib/models/productsI';

	let { startingItemId = $bindable(null), startingUserEmail = $bindable(null), isOpen = $bindable(false) }: {startingUserEmail: string | null, startingItemId: number | null, isOpen: boolean } = $props();

	let loadingHTTP: boolean = $state(false);
	let createError: string | null = $state(null);

	interface TransactionForm {
		user: string | null,
	}

	interface Form {
		user: string | null,
		itemId: number | null,
		paymentProvider: PaymentProviderEnum | null,
		transactions: TransactionForm[]
	}
	let form: Form = $state({
		user: startingUserEmail,
		itemId: startingItemId,
		paymentProvider: null,
		transactions: [],
	})

	async function createButton() {
		if (loadingHTTP) return;
		loadingHTTP = true;
	}
</script>

<style lang="scss">
	form {
		@apply p-4 flex flex-col md:flex-row gap-4;
	}
	h3 {
		@apply font-bold;
	}
</style>

<Modal title="Checkout Toevoegen" maxWidth="max-w-5xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<!-- Main body -->
		<form class="ingenium-form">
			<fieldset>
				<h3>Core information</h3>
				<div class="form-field">
					<label for="email">User email</label>
					<input id="email" type="text" required bind:value={form.user}/>
					<p>Email van de gebruiker</p>
				</div>
				<div class="form-field">
					<label for="item">Item</label>
					<input id="item" type="text" required bind:value={form.itemId}/>
					<p>Optionally for filtering, which item the product is offered in</p>
				</div>
			</fieldset>

			<fieldset>
				<h3>Payment Information</h3>
				<div class="form-field">
					<label for="email">Payment Provider</label>
					<input id="email" type="text" required bind:value={form.paymentProvider}/>
					<p>Hoe er betaald moet worden</p>
				</div>
			</fieldset>

			<fieldset>
				<h3>Add Transaction</h3>
				<p>Todow :)</p>
			</fieldset>

			<div>
				<h3>Transactions</h3>
				{#each form.transactions as transaction}
					<div>
						{JSON.stringify(transaction)}
					</div>
				{/each}
			</div>
		</form>

		<div class="p-2 flex border-t dark:border-gray-600 border-gray-200">
			<button class="ml-auto button button-primary w-24 button-inline"
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