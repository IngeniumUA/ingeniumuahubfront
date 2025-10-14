<script lang="ts">
	import Modal from '$lib/components/layout/modal.svelte';
	import type { PaymentProviderEnum } from '$lib/models/productsI';

	let { startingItemId = $bindable(null), startingUserEmail = $bindable(null), isOpen = $bindable(false) }: {startingUserEmail: string | null, startingItemId: number | null, isOpen: boolean } = $props();

	let loadingHTTP: boolean = $state(false);
	let createError: string | null = $state(null);

	interface Form {
		user: string | null,
		itemId: number | null,
		paymentProvider: PaymentProviderEnum | null,
	}
	let form: Form = $state({
		user: startingUserEmail,
		itemId: startingItemId,
		paymentProvider: null
	})

</script>

<Modal title="Checkout Toevoegen" maxWidth="max-w-7xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<!-- Main body -->
		<form class="p-4 flex flex-col md:flex-row gap:4 ingenium-form">
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
				<h3>Transactions</h3>
				<p>Todow :)</p>
			</fieldset>
		</form>
	{/snippet}
</Modal>