<script lang="ts">
	import type { ItemI } from '$lib/models/item/itemI';
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import type { RecSysPreviewI } from '$lib/models/RecSysI';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	export let data: {
		vacatures: ItemI[],
		available_vacatures_count: number,
		total_vacatures_count: number;
	};

	/**
	 * Query options and configuration
	 */
	let onlyShowActive: boolean = true;

	/**
	 * Edit modal and form
	 */
	let editItemSelectedIndex: null | number = null;
	let editItemSelected: ItemI | null = null;
	let loadingPatch: boolean = false;

	function setEditItemIndex(index: number | null) {
		editItemSelectedIndex = index;
		if (editItemSelectedIndex !== null && editItemSelectedIndex < data.vacatures.length) {
			editItemSelected = data.vacatures.at(editItemSelectedIndex)!;
		}
	}
	function getRecsysPreview(): RecSysPreviewI|null {
		if (editItemSelectedIndex === null) return null;
		const item = data.vacatures.at(editItemSelectedIndex);
		if (item === undefined) return null;

		return {
			follow_through_link: "",
			name: item.name,
			date: "",
			color: "",
			image_square: "",
			image_landscape: "",
			preview_description: ""
		}
	}

	/**
	 * Create New Form Methods and vars
	 */
	function toggleAddNew() {
		addingNew = !addingNew;
	}
	let addingNew = false;
	let loadingPost = false;
</script>

<style>
	table {
			@apply w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400;

			thead {
					@apply text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400;
			}
	}
	.button-success {
			@apply bg-green-600 text-white hover:bg-green-700;
	}
</style>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>Vacatures</h1>
		<button class="button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>
	<div class="alert alert-info mb-4 max-w-2xl">
		<p class="alert-text">Vacatures zijn een uitbreiding van HubPromoItem, waarbij het type op 'vacature' is gezet.
		Configureer voornamelijk de <span class="italic">display</span> velden. Zoals image_square, image_landscape, click_through_link, etc.</p>
	</div>

	<div class="container flex flex-col md:flex-row">
		<!-- Left hand side, list of vacatures -->
		<div class="md:w-2/3">
			<h2>Actieve Vacatures</h2>
			<div class="flex justify-between items-center mb-6">
				<h3 class="font-bold">Lijst</h3>
				<label class="inline-flex items-center cursor-pointer my-4">
					<input type="checkbox" bind:checked={onlyShowActive} class="sr-only peer">
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
					<span class="ms-3 text-sm font-medium text-gray-600">Toon Enkel Actieve</span>
				</label>
			</div>

			<!-- TODO Alles hieronder herwerken als aparte item table component -->

			<!-- Modal (pop-up) -->
			<!-- https://flowbite.com/docs/components/modal/#form-element -->
			{#if editItemSelectedIndex !== null && editItemSelected !== null}
				<div
					class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 cursor-default"
					on:click={() => setEditItemIndex(null)}
					role="button"
					tabindex="0"
					on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && setEditItemIndex(null)}
				>
					<div
						class="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl cursor-default"
						on:click|stopPropagation
						role="button"
						tabindex="0"
						on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && setEditItemIndex(null)}
					>
					<!--- Modal Header --->
					<div class="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600 border-gray-200">
						<h2>
							Bewerk Vacture
						</h2>
						<button
							type="button"
							class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
							on:click={() => setEditItemIndex(null)}
							>
							<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
								<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
							</svg>
							<span class="sr-only">Close modal</span>
						</button>
					</div>

					<!--- Modal Content --->
					<div class="flex justify-between p-2">
						<!-- Linkerkant form -->
						<form class="flex-1 ingenium-form">
							<fieldset>
								<div class="form-field">
									<label for="vacatureName">Name</label>
									<input id="vacatureName" type="text" required bind:value={ editItemSelected.name }/>
									<p>Display naam van de vacature.</p>
								</div>
							</fieldset>

							<fieldset>
								<div class="form-field">
									<label for="vacatureDescription">Description</label>
									<input id="vacatureDescription" type="text" required bind:value={ editItemSelected.description }/>
									<p>Optioneel, een beschrijving.</p>
								</div>
							</fieldset>

							<!-- Display section -->
							<div class="container flex flex-col md:flex-row gap-2">
								<!-- Left side -->
								<div class="flex-1">
									<fieldset>
										<div class="form-field">
											<label for="vacatureColor">Color</label>
											<input id="vacatureColor" type="text" required bind:value={ editItemSelected }/>
											<p>Kleur voor de weergave van de vacature.</p>
										</div>
									</fieldset>
									<fieldset>
									<div class="form-field">
										<label for="vacatureClickThroughLink">Click Through Link</label>
										<input id="vacatureClickThroughLink" type="text" required bind:value={ editItemSelected }/>
										<p>Waar je naartoe wordt gestuurd als je op de vacature klikt.</p>
									</div>
								</fieldset>
								</div>
								<!-- Right side -->
								<div class="flex-1">
									<fieldset>
										<div class="form-field">
											<label for="vacaturePreviewDescription">Preview Description</label>
											<input id="vacaturePreviewDescription" type="text" required bind:value={ editItemSelected }/>
											<p>Optioneel, extra tekst op de preview.</p>
										</div>
									</fieldset>
								</div>
							</div>
						</form>

						<!-- Separator lijn -->
						<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

						<!-- Rechterkant recsys preview -->
						<div class="flex-1 p-4">
							<RecSysPreviewItem item={getRecsysPreview()} />
						</div>

					</div>
					<!--- Modal Footer --->
						<div class="p-2 flex justify-between items-center border-t dark:border-gray-600 border-gray-200">
							<button type="submit" class="button button-primary w-24 button-inline"
											disabled={loadingPatch}>
								<span class="text-white">Update</span>
							</button>
							{#if (editItemSelected.availability.available)}
								<button class="button button-danger w-24 button-inline"
												disabled={loadingPatch}
												>
									<span class="text-white">Disable</span>
								</button>
							{:else}
								<button class="button-success button w-24 button-inline"
												disabled={loadingPatch}>
									<span class="text-white">Activate</span>
								</button>
							{/if}
						</div>
				</div>
			</div>
			{/if}

			<table>
				<thead>
					<tr>
						<th scope="col" class="pr-6 py-3">
							<h4 class="text-blue-900 font-bold text-sm">Item Name</h4>
						</th>
						<th scope="col" class="px-6 py-3">
							<h4 class="text-blue-900 text-sm">Description</h4>
						</th>
						<th scope="col" class="px-6 py-3">
							<h4 class="text-blue-900 text-sm">Display</h4>
						</th>
						<th scope="col" class="px-6 py-3">
							<h4 class="text-blue-900 text-sm">Availability</h4>
						</th>

					</tr>
					</thead>
					<tbody>
					{#each data.vacatures as item, index (item.id)}
					<tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
						<th scope="row" class="pr-6 py-4 text-gray-800 font-bold whitespace-nowrap dark:text-white">
							{item.name}
						</th>
						<td class="px-6 py-4">
							{item.description.slice(0, Math.min(item.description.length, 200))}
						</td>
						<td class="px-6 py-4">
							<div class="w-32 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg ">
								<p class="block w-full px-1 py-0.5 border-b border-gray-200">
									Click through link
								</p>
								<p class="block w-full px-1 py-0.5 border-b border-gray-200">
									Preview Desc
								</p>
							</div>
						</td>
						<td class="px-6 py-4">
							<div class="w-32 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg ">
								<p class="block w-full px-1 py-0.5 border-b border-gray-200">
									Available: {item.availability.available}
								</p>
								{#if (item.availability.available_from !== null)}
									<p class="block w-full px-1 py-0.5 border-b border-gray-200">
										Available from: {item.availability.available_from}
									</p>
								{/if}
								{#if (item.availability.available_from !== null)}
									Available until: {item.availability.available_until}
								{/if}
							</div>
						</td>
						<td class="pr-4 py-4">
							<button aria-label="edit" on:click={() => setEditItemIndex(index)}>
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
						</td>
					</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Vertical divider -->
		<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

		<!-- Right hand side, brief statistics-->
		<div class="md:w-1/3">
			<h2 class="font-bold">Overzicht</h2>

			<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
				<h4 class="text-ingenium-grey-800 font-bold">Aantal Actieve:</h4>
				<p class="text-blue-900 font-bold">{data.available_vacatures_count}</p>
			</div>

			<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
				<h4 class="text-ingenium-grey-800 font-bold">Aantal Totaal:</h4>
				<p class="text-blue-900 font-bold">{data.total_vacatures_count}</p>
			</div>

		</div>
	</div>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<h2>Dashboard statistics</h2>
	<div class="alert alert-info mb-4 max-w-2xl">
		<p class="alert-text"><a href="dashboard">Dashboard app</a> verzamelt statistieken over vacatures via <a href="umami">Umami</a>.
		Eenvoudige dingen zoals pageviews en unique visitors in de eerste plaats, maar ook het aantal keer dat iemand op een vacature klikt bv.
	</div>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	{#if addingNew}
		<h2>Adding new</h2>

		<div class="flex gap-4 items-center mb-6">
			<button type="submit" class="button button-primary w-24 button-inline"
							disabled={loadingPost}>
				<span class="text-white">Submit</span>
			</button>
			<button class="button button-primary w-24 button-inline"
							disabled={loadingPost}
							on:click={toggleAddNew}>
				<span class="text-white">Cancel</span>
			</button>
		</div>
	{:else}
		<button class="button button-primary w-24 button-inline"
						on:click={toggleAddNew}>
			<span class="text-white">Add New</span>
		</button>
	{/if}
</main>