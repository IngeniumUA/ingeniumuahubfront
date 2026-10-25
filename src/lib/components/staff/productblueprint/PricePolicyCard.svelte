<script lang="ts">
	import AvailabilityForm from '$lib/components/staff/availability/AvailabilityForm.svelte';
	import type { PricePolicyI } from '$lib/models/product_blueprint/PricePolicyI';
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import DeleteButton from '$lib/components/staff/DeleteButton.svelte';

	let {
		isOpen = $bindable(),
		loadingHTTP = $bindable(),
		pricePolicy = $bindable(),
		pricePolicyIndex = null,
		refreshCallback
	}: {
		isOpen: boolean,
		loadingHTTP: boolean,
		pricePolicy: PricePolicyI,
		pricePolicyIndex: number | null,
		refreshCallback: () => void,
	} = $props();

	let form = $derived({
		name: pricePolicy.name,
		price_eu: pricePolicy.price,

		always_display: pricePolicy.always_display,
		allow_invalid_access: pricePolicy.allow_invalid_access,
		allow_unauthenticated_access: pricePolicy.allow_unauthenticated_access,

		max_valid_usages: pricePolicy.max_valid_usages,

		ordering: pricePolicy.ordering,

		availability: pricePolicy.availability
	});

	let putError: Error | null = $state(null);
	async function update() {
		if (loadingHTTP) {return}
		// todo check for form errors

		const putPricePolicy: PricePolicyI = {
			...pricePolicy,
			name: form.name === "" ? null : form.name,
			price: form.price_eu,
			always_display: form.always_display,
			allow_invalid_access: form.allow_invalid_access,
			allow_unauthenticated_access: form.allow_unauthenticated_access,
			max_valid_usages: form.max_valid_usages,
			ordering: form.ordering,
			availability: {
				...pricePolicy.availability,
				available: form.availability.available,
				available_from: form.availability.available_from,
				available_until: form.availability.available_until,
				dynamic_policy_type: form.availability.dynamic_policy_type
			}
		};

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

	/**
	 * Deleting
	 */
	let deleteError: Error | null = $state(null);
	async function deletePricePolicy() {
		loadingHTTP = true;
		try {
			await CoreProductBlueprintAPI.deletePricePolicy(pricePolicy.id);
		} catch (error) {
			deleteError = error instanceof Error ? error : Error('Error submitting form');
		} finally {
			if (deleteError === null) {
				successToast('Deleted!');
				refreshCallback()
			} else {
				failedToast('Delete failed');
			}
			loadingHTTP = false;
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
		<form class="pt-2 ingenium-form flex flex-col lg:flex-row gap-4">
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

	<div class="pt-4 flex justify-end">
		<DeleteButton bind:loadingHTTP={loadingHTTP} iconOnly={true} deleteCallback={deletePricePolicy}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 456 511.82">
				<path fill="#fff" d="M48.42 140.13h361.99c17.36 0 29.82 9.78 28.08 28.17l-30.73 317.1c-1.23 13.36-8.99 26.42-25.3 26.42H76.34c-13.63-.73-23.74-9.75-25.09-24.14L20.79 168.99c-1.74-18.38 9.75-28.86 27.63-28.86zM24.49 38.15h136.47V28.1c0-15.94 10.2-28.1 27.02-28.1h81.28c17.3 0 27.65 11.77 27.65 28.01v10.14h138.66c.57 0 1.11.07 1.68.13 10.23.93 18.15 9.02 18.69 19.22.03.79.06 1.39.06 2.17v42.76c0 5.99-4.73 10.89-10.62 11.19-.54 0-1.09.03-1.63.03H11.22c-5.92 0-10.77-4.6-11.19-10.38 0-.72-.03-1.47-.03-2.23v-39.5c0-10.93 4.21-20.71 16.82-23.02 2.53-.45 5.09-.37 7.67-.37zm83.78 208.38c-.51-10.17 8.21-18.83 19.53-19.31 11.31-.49 20.94 7.4 21.45 17.57l8.7 160.62c.51 10.18-8.22 18.84-19.53 19.32-11.32.48-20.94-7.4-21.46-17.57l-8.69-160.63zm201.7-1.74c.51-10.17 10.14-18.06 21.45-17.57 11.32.48 20.04 9.14 19.53 19.31l-8.66 160.63c-.52 10.17-10.14 18.05-21.46 17.57-11.31-.48-20.04-9.14-19.53-19.32l8.67-160.62zm-102.94.87c0-10.23 9.23-18.53 20.58-18.53 11.34 0 20.58 8.3 20.58 18.53v160.63c0 10.23-9.24 18.53-20.58 18.53-11.35 0-20.58-8.3-20.58-18.53V245.66z"/></svg>
		</DeleteButton>
		<button class="button button-primary button-inline ml-4" onclick={update}>
			<span class="text-white">Update Policy</span>
		</button>
	</div>

	{#if (putError !== null)}
		<div class="error-message p-4">
			{JSON.stringify(putError)}
		</div>
	{/if}
{/if}
