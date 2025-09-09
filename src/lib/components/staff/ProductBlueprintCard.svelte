<script lang="ts">
	import type { ProductBlueprintI } from '$lib/models/product_blueprint/ProductBlueprintI';
	import AvailabilityForm from '$lib/components/staff/AvailabilityForm.svelte';

	let { productBlueprint = $bindable() }: { productBlueprint: ProductBlueprintI } = $props();

	let editing: boolean = $state(false);
	function toggleEdit() {
		editing = !editing;
		// selectedArray = Array.from({ length: selectedArray.length }, () => false);
	}

	/**
	 * Form as a reactive state
	 */
	let form = $state({
		name: productBlueprint.name,
		description: productBlueprint.description,

		ordering: productBlueprint.ordering,
		allow_individualised: false,

		// Availability
		availability: {
			available: productBlueprint.availability.available,
			available_from: productBlueprint.availability.available_from,
			available_until: productBlueprint.availability.available_until,
			dynamic_policy_type: productBlueprint.availability.dynamic_policy_type,
		},

		track_checkout: productBlueprint.product_blueprint_metadata.upon_completion?.track_checkout !== null
	})

	let selectedArray = $state(Array.from({ length: productBlueprint.price_policies.length }, () => false));
</script>

<div class="p-4 flex-1
						bg-white rounded-lg
							min-h-48
							shadow-md hover:shadow-lg transition-shadow">
	<div class="flex justify-between items-center">
		<h2>{productBlueprint.name}</h2>
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

	<p>{productBlueprint.description}</p>
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

			<h3 class="font-bold">Misc Configuration</h3>
				<div>
				<label class="inline-flex items-center cursor-pointer my-4">
					<input type="checkbox" class="sr-only peer"
								 bind:checked={form.allow_individualised}
					>
					<div class="
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
						"></div>
					<span class="ms-3 text-sm font-medium text-gray-600">
									Individualiseren {#if (form.allow_individualised)}Aan{:else}Uit{/if}
								</span>
				</label>
				</div>
				<div>
				<label class="inline-flex items-center cursor-pointer my-4">
					<input type="checkbox" class="sr-only peer"
								 bind:checked={form.track_checkout}
					>
					<div class="
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
						"></div>
					<span class="ms-3 text-sm font-medium text-gray-600">
									Ordertracking {#if (form.track_checkout)}Aan{:else}Uit{/if}
								</span>
				</label>

					<div class="form-field max-w-64">
						<label for="ordering">Ordering</label>
						<input id="ordering" type="number" required bind:value={form.ordering}/>
						<p>Weergave volgorde, hoger cijfer -> hoger/eerst op de pagina.</p>
					</div>
			</div>
		</div>

		<div>
			<AvailabilityForm bind:formState={form.availability}></AvailabilityForm>
		</div>
	</div>

	<div class="mt-4 flex justify-end">
		<button class="button button-primary button-inline">
			<span class="text-white">Update</span>
		</button>
	</div>

	<div class="mt-8">
		<h3 class="font-bold">Price Policies</h3>
		<hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800">
		{#each productBlueprint.price_policies as pricePolicy, pricePolicyIndex (pricePolicy.id)}
			<div>
				<div class="flex justify-between items-center mb-6">
					<h4 class="text-ingenium-grey-800 font-bold">Price {pricePolicyIndex + 1}: {pricePolicy.name}</h4>


					<button type="button" class="button button-primary button-icon-only relative inline-flex items-center justify-center"
									aria-controls="mobile-menu" aria-expanded="{selectedArray.at(pricePolicyIndex) ?? false}"
									onclick={ () => selectedArray[pricePolicyIndex] = !selectedArray[pricePolicyIndex] }
					>
						<span class="sr-only">Open navigatie</span>
						{#if selectedArray.at(pricePolicyIndex) ?? false}
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
				{#if selectedArray.at(pricePolicyIndex) ?? false}
					Todo: Hierboven ook nog een toggle steken om price policy aan en uit te zetten
					Todo: form hierzo, aparte component voor maken?
				{/if}
			</div>
			<hr class="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-800">
		{/each}
	</div>

	<div class="mt-4 flex justify-end">
		<button class="button button-primary button-inline">
			<span class="text-white">Add New (wip)</span>
		</button>
	</div>
</div>