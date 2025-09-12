<script lang="ts">
	import type { ProductBlueprintI } from '$lib/models/product_blueprint/ProductBlueprintI';
	import AvailabilityForm from '$lib/components/staff/AvailabilityForm.svelte';
	import AddPricePolicyModal from '$lib/components/staff/AddPricePolicyModal.svelte';
	import PricePolicyCard from '$lib/components/staff/PricePolicyCard.svelte';
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import type { PricePolicyI } from '$lib/models/product_blueprint/PricePolicyI';
	let { productBlueprint = $bindable() }: { productBlueprint: ProductBlueprintI } = $props();

	let editing: boolean = $state(false);
	function toggleEdit() {
		editing = !editing;
	}

	/**
	 * Form as a reactive state
	 */
	let form = $state({
		name: productBlueprint.name,
		description: productBlueprint.description,

		ordering: productBlueprint.ordering,
		allow_individualised: false,

		availability: {
			available: productBlueprint.availability.available,
			available_from: productBlueprint.availability.available_from,
			available_until: productBlueprint.availability.available_until,
			dynamic_policy_type: productBlueprint.availability.dynamic_policy_type,
		},

		product_blueprint_metadata: {
			track_checkout: productBlueprint.product_blueprint_metadata.upon_completion?.track_checkout !== null,
			category: productBlueprint.product_blueprint_metadata.categorie,
			group: productBlueprint.product_blueprint_metadata.group,
		}
	})

	let selectedArray = $state(Array.from({ length: productBlueprint.price_policies.length }, () => false));
	let addingPricePolicy = $state(false);

	/**
	 * Callback passed to CreatePricePolicy component
	 * @param pricePolicy
	 */
	function appendPricePolicy(pricePolicy: PricePolicyI) {
		productBlueprint.price_policies.push(pricePolicy);
	}

	let loadingHTTP = $state(false);

	/**
	 * 
	 */
	let putError: Error | null = $state(null);
	async function update() {
		if (loadingHTTP) {return}
		// todo check for form errors

		const putProductBlueprint = productBlueprint;
		putProductBlueprint.name = form.name;
		putProductBlueprint.description = form.description;

		putProductBlueprint.max_total = 5;
		putProductBlueprint.max_individual = 5;
		putProductBlueprint.max_per_checkout = 5;

		putProductBlueprint.ordering = form.ordering;

		putProductBlueprint.availability = {
			...form.availability,
			disabled: false,
			dynamic_policy_content: null
		}

		putProductBlueprint.product_blueprint_metadata.categorie = form.product_blueprint_metadata.category;
		putProductBlueprint.product_blueprint_metadata.group = form.product_blueprint_metadata.group;

		// Upon completion
		if (form.product_blueprint_metadata.track_checkout) {
			putProductBlueprint.product_blueprint_metadata.upon_completion = {
				track_checkout: {
					status_queue: [1, 2, 3],
					disabled_on_status: 3
				}
			}
		} else {
			putProductBlueprint.product_blueprint_metadata.upon_completion = null;
		}

		loadingHTTP = true;
		try {
			productBlueprint = await CoreProductBlueprintAPI.putProductBlueprint(putProductBlueprint);
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
</script>

<div class="p-4 flex-1
						bg-white rounded-lg
							min-h-48
							shadow-md hover:shadow-lg transition-shadow">

	<form class="ingenium-form">
		<div class="flex justify-between items-center">
			{#if editing}
				<fieldset>
				<div class="flex-1 form-field max-w-72 mb-2">
					<label for="itemName">Name</label>
					<input id="itemName" type="text" required bind:value={ form.name }/>
					<p>Display naam van de item.</p>
				</div>
				</fieldset>
			{:else}
				<h2>{productBlueprint.name}</h2>
			{/if}

			<button aria-label="edit" onclick="{toggleEdit}">
				<svg fill="#1f2980" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
						 width="20px" height="20px" viewBox="0 0 528.899 528.899"
						 xml:space="preserve">
							<g>
								<path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981
									c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611
									C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069
									L27.473,390.597L0.3,512.69z"/>
							</g>
							</svg>
			</button>
		</div>

		{#if editing}
			<fieldset>
				<label for="description">Description</label>
				<p>Beschrijving van het product.</p>
				<div class="form-field min-h-32 flex max-w-xl">
					<textarea class="flex-1" id="description" required bind:value={ form.description }></textarea>
				</div>
			</fieldset>
		{:else}
			<p>{productBlueprint.description}</p>
		{/if}

		<div class="flex flex-row gap-8">
			<div class="max-w-md">
				<h3 class="font-bold">Allowed Counts</h3>
				<span class="flex flex-row gap-1 mb-2">
					{#each Object.entries({
						"Max Total": productBlueprint.max_total,
						"Max Individual": productBlueprint.max_individual,
						"Max per Checkout": productBlueprint.max_per_checkout}) as [fieldName, fieldValue]}
					<div class="p-4 flex-1 rounded-lg shadow-md hover:shadow-lg transition-shadow">
						<h4 class="text-ingenium-grey-800 font-bold">{fieldName}:</h4>
						<p class="text-blue-900 font-bold">{fieldValue}</p>
					</div>
					{/each}
				</span>

				<h3 class="font-bold">Options</h3>
						<fieldset>
						<label class="inline-flex items-center cursor-pointer my-4">
							<input type="checkbox" class="sr-only peer"
										 bind:checked={form.allow_individualised}
										 disabled={!editing}
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
							<span class="ms-3 text-sm font-medium text-gray-600">
											Individualiseren {#if (form.allow_individualised)}Aan{:else}Uit{/if}
										</span>
						</label>

						<div class="form-field max-w-64">
							<label for="ordering">Ordering</label>
							<input id="ordering" type="number" required bind:value={form.ordering}/>
							<p>Weergave volgorde, hoger cijfer -> hoger/eerst op de pagina.</p>
						</div>
					</fieldset>
			</div>

			<fieldset>
				<h3 class="font-bold">Meta Config</h3>

				<div class="form-field">
					<label for="category">Category</label>
					<input id="category" type="text" required bind:value={form.product_blueprint_metadata.category}/>
					<p>Display category, voor event pagina groepering</p>
				</div>

				<div class="form-field">
					<label for="group">Group</label>
					<input id="group" type="text" required bind:value={form.product_blueprint_metadata.group}/>
					<p>Display groep, voor event pagina groepering</p>
				</div>

				<label class="inline-flex items-center cursor-pointer my-4">
					<input type="checkbox" class="sr-only peer"
								 bind:checked={form.product_blueprint_metadata.track_checkout}
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
					<span class="ms-3 text-sm font-medium text-gray-600">
											Ordertracking {#if (form.product_blueprint_metadata.track_checkout)}Aan{:else}Uit{/if}
										</span>
				</label>

				{#if form.product_blueprint_metadata.track_checkout}
					FUTURE: Custom tracker settings hier
				{/if}

			</fieldset>

			<AvailabilityForm bind:formState={form.availability}></AvailabilityForm>
		</div>
	</form>

	<div class="mt-4 flex justify-end">
		<button class="button button-primary button-inline" onclick={update}>
			<span class="text-white">Update</span>
		</button>
	</div>

	<div class="mt-8">
		<h3 class="font-bold">Price Policies</h3>
		<hr class="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-800">
		{#each productBlueprint.price_policies as pricePolicy, pricePolicyIndex (pricePolicy.id)}
			<PricePolicyCard bind:loadingHTTP={loadingHTTP}
											 isOpen={ selectedArray.at(pricePolicyIndex) ?? false }
											 bind:pricePolicy={productBlueprint.price_policies[pricePolicyIndex]}
											 pricePolicyIndex={pricePolicyIndex}></PricePolicyCard>
			<hr class="h-px bg-gray-200 border-0 dark:bg-gray-800">
		{/each}
	</div>

	<div class="mt-4 flex justify-end">
		<button class="button button-primary button-inline"
		onclick="{() => {addingPricePolicy = true}}">
			<span class="text-white">Add New</span>
		</button>
	</div>
</div>

<AddPricePolicyModal createdCallback={appendPricePolicy} bind:isOpen={addingPricePolicy} product_blueprint_id={productBlueprint.id}></AddPricePolicyModal>
