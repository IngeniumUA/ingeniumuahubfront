<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
	import Modal from '$lib/components/layout/modal.svelte';

	let { isOpen = $bindable(false), origin_item_id }: { isOpen: boolean, origin_item_id: number } = $props();

	let loadingHTTP: boolean = $state(false);
	let createError: string | null = $state(null);

	// Form fields as reactive state
	let form = $state({
		name: '',
		description: '',
		max_total: 5,
		max_individual: 5,
		max_per_checkout: 5,
		allow_individualised: false,
		ordering: 0
	});

	async function createBlueprint() {
		if (loadingHTTP) {return}
		// todo check for form errors

		const postBlueprint = {
			name: form.name,
			description: form.description,
			origin_item_id: origin_item_id,
			max_total: form.max_total,
			max_individual: form.max_individual,
			max_per_checkout: form.max_per_checkout,
			allow_individualised: form.allow_individualised,
			ordering: form.ordering
		};

		loadingHTTP = true;
		try {
			await CoreProductBlueprintAPI.postBlueprint(postBlueprint);
			createError = null;
		} catch (error) {
			createError = error instanceof Error ? error.message : 'Error submitting form';
		} finally {
			if (createError === null) {
				toast.push("Blueprint created!", {
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgba(72,187,120,0.9)',
						'--toastBarBackground': '#2F855A'
					}
				});
				isOpen = false; // Close the modal when the creation was a success :))
			} else {
				toast.push(`Failed`, {
					theme: {
						'--toastColor': 'mistyrose',
						'--toastBackground': 'rgba(229, 62, 62, 0.9)', // red-600
						'--toastBarBackground': '#C53030' // red-700
					}
				});
			}
			loadingHTTP = false; // Reset loading state
		}
	}
</script>

<Modal title="Product Blueprint Aanmaken" maxWidth="max-w-4xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<!-- Main body -->
		<div class="alert alert-info m-4 max-w-3xl">
			<p class="alert-text">Product Bleurpint aanmaken. Price policies en availability komen pas later.</p>
		</div>
		<form class="p-4 ingenium-form">
			<fieldset>
				<div class="form-field">
					<label for="name">Name</label>
					<input id="name" type="text" required bind:value={form.name}/>
					<p>Display naam</p>
				</div>
			</fieldset>

			<div class="flex flex-row gap-3">
				<fieldset class="w-1/3">
					<div class="form-field">
						<label for="description">Description</label>
						<input id="description" type="text" required bind:value={form.description}/>
						<p>Een beschrijving</p>
					</div>
				</fieldset>

				<fieldset class="w-1/3">
					<div class="form-field">
						<label for="max_total">Max Total</label>
						<input id="max_total" type="number" required bind:value={form.max_total}/>
						<p>Hoe veel van deze producten er zijn.</p>
					</div>
					<div class="form-field">
						<label for="max_individual">Max Individual</label>
						<input id="max_individual" type="number" required bind:value={form.max_individual}/>
						<p>Hoe veel er per account kunnen aangekocht worden.</p>
					</div>
					<div class="form-field">
						<label for="max_per_checkout">Max Per Checkout</label>
						<input id="max_per_checkout" type="number" required bind:value={form.max_per_checkout}/>
						<p>Hoe veel er 'tegelijkertijd' (per betaling) kunnen aangekocht worden.</p>
					</div>
				</fieldset>

				<fieldset class="w-1/3">
					<div class="form-field">
						<label for="allow_individualised">Allow Individualised</label>
						<input id="allow_individualised" type="checkbox" required bind:checked={form.allow_individualised}/>
						<p>Of de aankoper het product aan een ander account kan toewijzen.</p>
					</div>
					<div class="form-field">
						<label for="ordering">Ordering</label>
						<input id="ordering" type="number" required bind:value={form.ordering}/>
						<p>Weergave volgorde, hoger cijfer -> hoger/eerst op de pagina.</p>
					</div>
				</fieldset>
			</div>
		</form>

		<div class="p-2 flex border-t dark:border-gray-600 border-gray-200">
			<button class="button button-primary w-24 button-inline"
							disabled={loadingHTTP}
							onclick={createBlueprint}>
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