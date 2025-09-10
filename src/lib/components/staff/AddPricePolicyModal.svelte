<script lang="ts">
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
	import Modal from '$lib/components/layout/modal.svelte';
	import type { PricePolicyInI } from '$lib/models/product_blueprint/PricePolicyI';
	import AvailabilityForm from '$lib/components/staff/AvailabilityForm.svelte';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';

	let { isOpen = $bindable(false), product_blueprint_id }: { isOpen: boolean, product_blueprint_id: number } = $props();

	let loadingHTTP: boolean = $state(false);
	let createError: string | null = $state(null);

	// Form fields as reactive state
	let form = $state({
		name: "",
		price_eu: 0,

		always_display: false,
		allow_invalid_access: false,
		allow_unauthenticated_access: false,

		max_valid_usages: 0,

		ordering: 0,

		availability: {
			available: false,
			available_from: null,
			available_until: null,
			dynamic_policy_type: 0,
		},
	});

	async function createPricePolicy() {
		if (loadingHTTP) {return}
		// todo check for form errors

		const postPricePolicy: PricePolicyInI = {
			product_blueprint_id: product_blueprint_id,
			name: form.name === "" ? null: form.name,
			price_eu: form.price_eu,
			always_display: form.always_display,
			allow_invalid_access: form.allow_invalid_access,
			allow_unauthenticated_access: form.allow_unauthenticated_access,
			max_valid_usages: form.max_valid_usages,
			ordering: form.ordering
		};

		loadingHTTP = true;
		try {
			await CoreProductBlueprintAPI.postPricePolicy(postPricePolicy);
			createError = null;
		} catch (error) {
			createError = error instanceof Error ? error.message : 'Error submitting form';
		} finally {
			if (createError === null) {
				successToast("Price Policy created!");
				isOpen = false; // Close the modal when the creation was a success :))
			} else {
				failedToast(`Failed`);
			}
			loadingHTTP = false; // Reset loading state
		}
	}
</script>

<Modal title="Price Policy Aanmaken" maxWidth="max-w-5xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<!-- Main body -->
		<div class="alert alert-info m-4 max-w-3xl">
			<p class="alert-text">Price Policy Aanmaken.</p>
		</div>

		<form class="p-4 ingenium-form flex flex-row gap-4">
			<fieldset class="flex-1">
				<div class="form-field">
					<label for="name">Name</label>
					<input id="name" type="text" required bind:value={form.name}/>
					<p>Display naam (optioneel!)</p>
				</div>

				<div class="form-field">
					<label for="price_eu">Price</label>
					<input id="price_eu" type="text" required bind:value={form.price_eu}/>
					<p>Prijs in euro (0 voor gratis)</p>
				</div>

			</fieldset>

			<fieldset class="flex-1">
				<label for="always_display">Always Display</label>
				<div class="form-field mb-4">
					<label class="inline-flex items-center cursor-pointer">
						<input type="checkbox" class="hidden peer" id="always_display"
									 bind:checked={form.always_display}
						>
						<span class="relative inline-block w-11 h-6 bg-red-900 dark:bg-red-900 rounded-full peer-checked:bg-green-900 dark:peer-checked:bg-green-900
				after:content-['']
				after:absolute after:top-[2px] after:start-[2px]
				after:w-5 after:h-5
				after:bg-white after:rounded-full
				after:transition-transform
				peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
				"></span>
						<span class="ms-3 text-sm font-medium text-gray-600">
							{#if (form.always_display)}Aan{:else}Uit{/if}
						</span>
					</label>
					<p>Of deze prijs <span class="font-bold">altijd</span> te zien moet zijn.</p>
				</div>

				<label for="allow_unauthenticated_access">Always Display</label>
				<div class="form-field mb-4">
					<label class="inline-flex items-center cursor-pointer">
						<input type="checkbox" class="hidden peer"
									 id="allow_unauthenticated_access"
									 bind:checked={form.allow_unauthenticated_access}
						>
						<span class="relative w-11 h-6 bg-red-900 dark:bg-red-900 rounded-full peer-checked:bg-green-900 dark:peer-checked:bg-green-900
				after:content-['']
				after:absolute after:top-[2px] after:start-[2px]
				after:w-5 after:h-5
				after:bg-white after:rounded-full
				after:transition-transform
				peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
				"></span>
						<span class="ms-3 text-sm font-medium text-gray-600">
							{#if (form.allow_unauthenticated_access)}Aan{:else}Uit{/if}
						</span>
					</label>
					<p>Of je deze prijs kan aankopen zonder ingelogd te zijn.</p>
				</div>

				<label for="allow_invalid_access">Allow Invalid Access</label>
				<div class="form-field">
					<label class="inline-flex items-center cursor-pointer">
						<input type="checkbox" class="hidden peer"
									 id="allow_invalid_access"
									 bind:checked={form.allow_invalid_access}
						>
						<span class="relative w-11 h-6 bg-red-900 dark:bg-red-900 rounded-full peer-checked:bg-green-900 dark:peer-checked:bg-green-900
				after:content-['']
				after:absolute after:top-[2px] after:start-[2px]
				after:w-5 after:h-5
				after:bg-white after:rounded-full
				after:transition-transform
				peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
				"></span>
						<span class="ms-3 text-sm font-medium text-gray-600">
							{#if (form.allow_invalid_access)}Aan{:else}Uit{/if}
						</span>
					</label>
					<p>Of deze prijs <span class="font-bold">invalid (oranje) kan aankopen</span> bijvoorbeeld als je geen lid bent toch de ledenprijs aankopen.</p>
				</div>
			</fieldset>

			<fieldset class="flex-1">
				<div class="form-field max-w-32">
					<label for="max_valid_usages">Max valid usages</label>
					<input id="max_valid_usages" type="number" required bind:value={form.ordering}/>
					<p><span class="italic">Zet 0 voor oneindig</span>, hoe vaak je iemand deze prijs valid kan aankopen (bv één ledenticket per persoon).</p>
				</div>

				<div class="form-field max-w-32">
					<label for="ordering">Ordering</label>
					<input id="ordering" type="number" required bind:value={form.ordering}/>
					<p>Weergave volgorde, hoger cijfer -> hoger/eerst op de pagina.</p>
				</div>
			</fieldset>

			<AvailabilityForm bind:formState={form.availability}></AvailabilityForm>
		</form>

		<div class="p-2 flex border-t dark:border-gray-600 border-gray-200">
			<button class="button button-primary w-24 button-inline"
							disabled={loadingHTTP}
							onclick={createPricePolicy}>
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