<script lang="ts">
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import type { PromoItemWideI } from '$lib/models/item/promoI';
	import { CoreItemAPI, CoreItemWideAPI } from '$lib/core_api/core_api';
	import type { ItemI } from '$lib/models/item/itemI';
	import { handleRequest } from '$lib/utilities/httpUtilities';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	export let data: {
		vacatures: PromoItemWideI[],
		available_vacatures_count: number,
		total_vacatures_count: number;
	};

	/**
	 * Refreshing data
	 */
	let onlyShowActive: boolean = true;
	async function refreshTable() {
		const query = new URLSearchParams({
			item_type: "promoitem",
			limit: '100',
		});
		if (!onlyShowActive) {
			query.set("available", `${!onlyShowActive}`)
		}
		data.vacatures = await CoreItemWideAPI.queryPromoItem(query);
	}
	async function refresh() {
		const query = new URLSearchParams({
			item_type: "promoitem",
			limit: '100',
		});
		data.total_vacatures_count = await CoreItemWideAPI.countItemWide(query);
		if (!onlyShowActive) {
			query.set("available", `${!onlyShowActive}`)
		}
		data.available_vacatures_count = await CoreItemWideAPI.countItemWide(query);
		await refreshTable();
	}

	/**
	 * Edit modal and form
	 */
	let editItemSelectedIndex: null | number = null;
	let editItemSelected: PromoItemWideI | null = null;
	let editItemExternalLink: boolean = false;

	let itemPutError: string | null = null;
	let loadingHTTP: boolean = false;

	function setEditItemIndex(index: number | null) {
		itemPutError = null;
		editItemSelectedIndex = index;
		if (editItemSelectedIndex !== null && editItemSelectedIndex < data.vacatures.length) {
			editItemSelected = data.vacatures.at(editItemSelectedIndex)!;
			editItemExternalLink = editItemSelected.derived_type.display.follow_through_link.startsWith("http")
		}
	}
	function handleImageToggle(value: boolean) {
		if (editItemSelected === null) { return; }
		// Current value of the image field is stored within state variable
		// Square -> true
		// Landscape -> false
		if (value) {
			editItemSelected.derived_type.display.image_square = editItemImage;
			editItemSelected.derived_type.display.image_landscape = null;
		} else {
			editItemSelected.derived_type.display.image_landscape = editItemImage;
			editItemSelected.derived_type.display.image_square = null;
		}
	}
	$: editItemImage = editItemSelected
		? editItemSelected.derived_type.display.image_square ?? editItemSelected.derived_type.display.image_landscape
		: null;
	$: recsysPreview = editItemSelectedIndex !== null && editItemSelected
		? {
			follow_through_link: editItemExternalLink ? editItemSelected.derived_type.display.follow_through_link: `/vacature/${editItemSelected.item.name}`,
			name: editItemSelected.item.name,
			date: "",
			color: editItemSelected.derived_type.display.color,
			image_square: editItemSelected.derived_type.display.image_square,
			image_landscape: editItemSelected.derived_type.display.image_landscape,
			preview_description: editItemSelected.derived_type.display.preview_description
		}
		: null;
	async function handlePut() {
		// Preliminary checks
		if (editItemSelected === null) {
			itemPutError = "Item is null?"
			return;
		}
		loadingHTTP = true;
		// Perform put request
		editItemSelected.derived_type.display.follow_through_link = editItemExternalLink ? editItemSelected.derived_type.display.follow_through_link: `/vacature/${editItemSelected.item.name}`
		try {
			await CoreItemWideAPI.putItem(editItemSelected.item.id, editItemSelected);
		} catch (error) {
			itemPutError = error instanceof Error ? error.message : 'Error submitting form';
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}
	async function handleAvailableButton(nextStatus: boolean) {
		// Preliminary checks
		if (editItemSelected === null) {
			itemPutError = "Item is null?"
			return;
		}

		const putModel = editItemSelected.item;
		putModel.availability.available = nextStatus

		try {
			const resp: ItemI = await CoreItemAPI.putItem(editItemSelected.item.id, putModel).catch(handleRequest);
			editItemSelected.item.availability.available = resp.availability.available;
			await refresh();
		} catch (error) {
			itemPutError = error instanceof Error ? error.message : 'Error submitting form';
		} finally {
			loadingHTTP = false; // Reset loading state
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

</style>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>Vacatures</h1>
		<button on:click={refresh} class="button button-primary w-24 button-inline">
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
					<input type="checkbox" bind:checked={onlyShowActive} on:click={() => refreshTable()} class="sr-only peer">
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



			<table class="ingenium-table">
				<thead>
					<tr>
						<th scope="col"><h4>Item Name</h4></th>
						<th scope="col"><h4>Description</h4></th>
						<th scope="col"><h4>Availability</h4></th>
					</tr>
				</thead>
				<tbody>
				{#each data.vacatures as item, index (item.item.id)}
				<tr>
					<th scope="row">
						{item.item.name}
					</th>
					<td>
						{item.item.description.slice(0, Math.min(item.item.description.length, 200))}
					</td>
					<td>
						<div class="w-32 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg ">
							<p class="block w-full px-1 py-0.5 border-b border-gray-200
							{item.item.availability.available ? 'text-green-800' : 'text-red-800'}"
								>
								{item.item.availability.available ? "Available": "Not Available" }
							</p>
							{#if (item.item.availability.available_from !== null)}
								<p class="block w-full px-1 py-0.5 border-b border-gray-200">
									Available from: {item.item.availability.available_from}
								</p>
							{/if}
							{#if (item.item.availability.available_until !== null)}
								Available until: {item.item.availability.available_until}
							{/if}
						</div>
					</td>
					<td>
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

<!-- Edit Modal (pop-up) -->
<!-- https://flowbite.com/docs/components/modal/#form-element -->
{#if editItemSelectedIndex !== null && editItemSelected !== null}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 cursor-default"
		on:mousedown={(e) => {
					if (e.target === e.currentTarget) {
						setEditItemIndex(null);
						}
					}}
		role="button"
		tabindex="0"
		on:keydown={(e) => {if (e.key === 'Escape') {setEditItemIndex(null);}}}
	>
		<div
			class="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl cursor-default"
			on:click|stopPropagation
			role="button"
			tabindex="0"
			on:keydown={(e) => {if (e.key === 'Escape') {setEditItemIndex(null);}}}
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
				<form class="flex-1 ingenium-form"
							on:submit|preventDefault={handlePut}>
					<fieldset>
						<div class="form-field">
							<label for="vacatureName">Name</label>
							<input id="vacatureName" type="text" required bind:value={ editItemSelected.item.name }/>
							<p>Display naam van de vacature.</p>
						</div>
					</fieldset>

					<fieldset>
						<div class="form-field">
							<label for="vacatureDescription">Description</label>
							<input id="vacatureDescription" type="text" required bind:value={ editItemSelected.item.description }/>
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
									<input id="vacatureColor" type="text" required bind:value={ editItemSelected.derived_type.display.color }/>
									<p>Kleur voor de weergave van de vacature.</p>
								</div>
							</fieldset>
							<fieldset>
								<div class="form-field">
									<label for="vacatureClickThroughLink">Click Through Link</label>
									{#if (editItemExternalLink)}
										<input id="vacatureClickThroughLink" type="text" required bind:value={ editItemSelected.derived_type.display.follow_through_link }/>
									{/if}
									<p>Waar je naartoe wordt gestuurd als je op de vacature klikt.</p>
								</div>
							</fieldset>
							<label class="inline-flex items-center cursor-pointer my-4">
								<input type="checkbox"
											 bind:checked={editItemExternalLink} class="hidden peer">
								<div class="relative w-11 h-6 bg-blue-900 dark:bg-gray-700 rounded-full
													peer-checked:bg-blue-900 dark:peer-checked:bg-blue-900
													after:content-['']
													after:absolute after:top-[2px] after:start-[2px]
													after:w-5 after:h-5
													after:bg-white after:rounded-full
													after:transition-transform
													peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
													"></div>
								<span class="ms-3 text-sm font-medium text-gray-600">
													{#if editItemExternalLink}
														Extern
													{:else}
														Item zelf
													{/if}
												</span>
							</label>

						</div>
						<!-- Right side -->
						<div class="flex-1">
							<fieldset>
								<div class="form-field">
									<label for="vacaturePreviewDescription">Preview Description</label>
									<input id="vacaturePreviewDescription" type="text" required bind:value={ editItemSelected.derived_type.display.preview_description }/>
									<p>Optioneel, extra tekst op de preview.</p>
								</div>
							</fieldset>

							<fieldset>
								<div class="form-field">
									<label for="vacatureImage">Image</label>
									<input id="vacatureImage" type="text" required bind:value={ editItemImage }/>

									<label class="inline-flex items-center cursor-pointer my-4">
										<input type="checkbox"
													 checked={editItemSelected.derived_type.display.image_square !== null}
													 on:change={(e) => handleImageToggle(e.currentTarget.checked)} class="hidden peer">
										<div class="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full
													peer-checked:bg-blue-900 dark:peer-checked:bg-blue-900
													after:content-['']
													after:absolute after:top-[2px] after:start-[2px]
													after:w-5 after:h-5
													after:bg-white after:rounded-full
													after:transition-transform
													peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
													"></div>
										<span class="ms-3 text-sm font-medium text-gray-600">
													{#if editItemSelected.derived_type.display.image_square === null}
														Rectangle
													{:else}
														Square
													{/if}
												</span>
									</label>
								</div>
							</fieldset>
						</div>
					</div>
				</form>

				<!-- Separator lijn -->
				<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

				<!-- Rechterkant recsys preview -->
				<div class="flex-1 p-4">
					{#if recsysPreview}
						<RecSysPreviewItem item={recsysPreview} />
					{/if}
				</div>
			</div>
			{#if (itemPutError !== null)}
				<p class="error-message">{itemPutError}</p>
			{/if}

			<!--- Modal Footer --->
			<div class="p-2 flex justify-between items-center border-t dark:border-gray-600 border-gray-200">
				<button type="button" class="button button-primary w-24 button-inline"
								disabled={loadingHTTP}
								on:click={handlePut}>
					<span class="text-white">Save</span>
				</button>
				{#if (editItemSelected.item.availability.available)}
					<button class="button button-danger w-24 button-inline"
									disabled={loadingHTTP}
									on:click={() => {handleAvailableButton(false)}}
					>
						<span class="text-white">Disable</span>
					</button>
				{:else}
					<button class="button-success button w-24 button-inline"
									disabled={loadingHTTP}
									on:click={() => {handleAvailableButton(true)}}>
						<span class="text-white">Activate</span>
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}