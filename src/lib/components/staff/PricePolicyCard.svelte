<script lang="ts">
	import AvailabilityForm from '$lib/components/staff/AvailabilityForm.svelte';
	import type { PricePolicyI } from '$lib/models/product_blueprint/PricePolicyI';
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';

	let { isOpen = $bindable(), loadingHTTP = $bindable(), pricePolicy = $bindable(), pricePolicyIndex = null }: { isOpen: boolean, loadingHTTP: boolean, pricePolicy: PricePolicyI, pricePolicyIndex: number | null } = $props();

	let form = $derived({
		name: pricePolicy.name,
		price_eu: pricePolicy.price,

		always_display: pricePolicy.always_display,
		allow_invalid_access: pricePolicy.allow_invalid_access,
		allow_unauthenticated_access: pricePolicy.allow_unauthenticated_access,

		max_valid_usages: pricePolicy.max_valid_usages,

		ordering: pricePolicy.ordering,

		availability: {
			available: pricePolicy.availability.available,
			available_from: pricePolicy.availability.available_from,
			available_until: pricePolicy.availability.available_until,
			dynamic_policy_type: pricePolicy.availability.dynamic_policy_type,
		},
	});

	let putError: Error | null = $state(null);
	async function update() {
		if (loadingHTTP) {return}
		// todo check for form errors

		const putPricePolicy = pricePolicy;
		putPricePolicy.name = form.name === "" ? null: form.name;
		putPricePolicy.price = form.price_eu;
		putPricePolicy.always_display = form.always_display;
		putPricePolicy.allow_invalid_access = form.allow_invalid_access;
		putPricePolicy.allow_unauthenticated_access = form.allow_unauthenticated_access;
		putPricePolicy.max_valid_usages = form.max_valid_usages;
		putPricePolicy.ordering = form.ordering;
		putPricePolicy.availability.available = form.availability.available
		putPricePolicy.availability.available_from = form.availability.available_from
		putPricePolicy.availability.available_until = form.availability.available_until
		putPricePolicy.availability.dynamic_policy_type = form.availability.dynamic_policy_type

		loadingHTTP = true;
		try {
			pricePolicy = await CoreProductBlueprintAPI.putPricePolicy(putPricePolicy);
			putError = null;
		} catch (error) {
			putError = error instanceof Error ? error : Error('Error submitting form');
		} finally {
			if (putError === null) {
				successToast("Updated!")
			} else {
				failedToast(`Update Failed`)
			}
			loadingHTTP = false;
		}
	}

	async function togglePricePolicy() {
		if (loadingHTTP) return;

		loadingHTTP = true;
		try {
			pricePolicy = await CoreProductBlueprintAPI.patchAvailablePricePolicy(pricePolicy.id, !pricePolicy.availability.available);
			putError = null;
		} catch (error) {
			putError = error instanceof Error ? error : Error('Error submitting form');
		} finally {
			if (putError === null) {
				successToast("Updated!");
			} else {
				failedToast(`Failed`);
			}
			loadingHTTP = false; // Reset loading state
		}
	}
</script>


<div class="flex justify-between items-center">
	<h4 class="text-ingenium-grey-800 font-bold">
		Price {#if pricePolicyIndex !== null}{pricePolicyIndex + 1}{/if}: {#if pricePolicy.name !== null}{pricePolicy.name} -{/if}
		{#if pricePolicy.price === 0}Gratis{:else}€{pricePolicy.price}{/if}
	</h4>

	<label class="inline-flex items-center cursor-pointer my-4 mx-2 ml-auto">
		<input type="checkbox" class="sr-only peer"
					 bind:checked={pricePolicy.availability.available}
					 onclick={togglePricePolicy}
					 disabled={loadingHTTP}
		>
		<span class="
					relative w-11 h-6
					bg-red-900 dark:bg-red-900
					rounded-full
					peer-checked:bg-green-900 dark:peer-checked:bg-green-900
					after:content-['']
					after:absolute after:top-[2px] after:start-[2px]
					after:w-5 after:h-5
					after:bg-white after:rounded-full
					after:transition-transform
					peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
					"></span>
	</label>

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
		<form class="ingenium-form flex flex-col lg:flex-row gap-4">
			<fieldset class="flex-1">
				<div class="form-field">
					<label for="name">Name</label>
					<input id="name" type="text" required bind:value={form.name}/>
					<p>Display naam (optioneel!)</p>
				</div>

				<div class="form-field">
					<label for="price_eu">Price</label>
					<input id="price_eu" type="number" required bind:value={form.price_eu}/>
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

					<label for="allow_unauthenticated_access">Allow Unauthenticated</label>
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
				<div class="form-field">
					<label for="max_valid_usages">Max valid usages</label>
					<input id="max_valid_usages" type="number" required bind:value={form.max_valid_usages}/>
					<p><span class="italic">Zet 0 voor oneindig</span>, hoe vaak je iemand deze prijs valid kan aankopen (bv één ledenticket per persoon).</p>
				</div>

				<div class="form-field">
					<label for="ordering">Ordering</label>
					<input id="ordering" type="number" required bind:value={form.ordering}/>
					<p>Weergave volgorde, hoger cijfer -> hoger/eerst op de pagina.</p>
				</div>
			</fieldset>

			<AvailabilityForm bind:formState={form.availability}></AvailabilityForm>
		</form>

	<div class="mt-4 flex justify-end">
		<button class="button button-primary button-inline" onclick={update}>
			<span class="text-white">Update</span>
		</button>
	</div>

	{#if (putError !== null)}
		<div class="error-message p-4">
			{JSON.stringify(putError)}
		</div>
	{/if}
{/if}
