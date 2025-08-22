<script lang="ts">
	import { CoreItemAPI, CoreItemWideAPI } from '$lib/core_api/core_api';
	import { makePretty } from '$lib/utilities/style-utilities';
	import type { ItemI } from '$lib/models/item/itemI';
	import { handleRequest } from '$lib/utilities/httpUtilities';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();

	/**
	 * Query parameter for showing available
	 */
	let onlyShowAvailable: boolean = $state(true);

	/**
	 * Refreshing all data on the page
	 */
	async function refresh() {
		const query = new URLSearchParams({
			item_type: "eventitem",
			limit: '20',
		});
		if (!onlyShowAvailable) {
			query.set("available", `${!onlyShowAvailable}`)
		}
		data.events = await CoreItemWideAPI.queryEventItem(query);
	}

	/**
	 * State for blocking buttons when http is in progress
	 */
	let loadingHTTP: boolean = false;

	/**
	 *
	 */
	async function patchAvailable(item_index: number) {
		if (loadingHTTP) { return }

		if (data.events.length >= item_index) {return}
		let eventitem = data.events.at(item_index)
		if (eventitem === undefined) {return}
		eventitem.item.availability.available = !eventitem.item.availability.available

		loadingHTTP = true;
		try {
			await CoreItemAPI.putItem(eventitem.item.id, eventitem.item).catch(handleRequest);
			await refresh();
		} catch (error) {
			// todo
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>Events</h1>
		<button class="button button-primary w-24 button-inline" onclick="{refresh}">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<div class="alert alert-info mb-4 max-w-2xl">
		<p class="alert-text">Evenementen zijn een soort Item die producten kunnen aanbieden.
			Ze hebben eerst en vooral een <span class="italic">display</span> mixin om te controleren hoe de pagina en de preview er uit ziet.
		Via <span class="italic">HubProductBlueprints</span> kan je daarna ook instellen welke producten aangekocht worden.
		Om te kunnen beperken wie er wanneer het item kan bekijken, is er de <span class="italic">Availability</span> mixin.</p>
	</div>

	<div class="container flex flex-col md:flex-row">
		<!-- Left hand side, list of Events -->
		<div class="md:w-2/3">
			<h2>Recent Events</h2>
			<label class="inline-flex items-center cursor-pointer my-4">
				<input type="checkbox" bind:checked={onlyShowAvailable} onclick={refresh} class="sr-only peer">
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
				<span class="ms-3 text-sm font-medium text-gray-600">Enkel Available</span>
			</label>

			{#each data.events as event (event.item.id)}
				<div class="bg-white p-4 rounded-lg
							min-h-48
							shadow-md hover:shadow-lg transition-shadow">

					<!-- Title and edit -->
					<div class="flex justify-between items-center">
						<h2 class="font-semibold">{makePretty(event.item.name)}</h2>
						<button aria-label="edit">
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

					<!-- Main Body -->
					<div class="container flex flex-col md:flex-row">
						<div class="md:w-2/3">
							<h3 class="font-bold">Event Info</h3>
							<p>Description</p>

							<label class="inline-flex items-center cursor-pointer my-4">
								<input type="checkbox" class="sr-only peer"
											 bind:checked={event.item.availability.available}
											 onclick="{() => patchAvailable(event.item)}"
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
									{#if (event.item.availability.available)}Beschikbaar{:else}Niet Beschikbaar{/if}
								</span>
							</label>
						</div>

						<!-- Vertical divider -->
						<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

						<div class="md:w-1/3">
							<h3 class="font-bold">Product Data</h3>
							<table class="ingenium-table">
								<tbody>
									<tr>
										<th scope="row">Aantal Betalingen</th>
										<td>{#await CoreItemAPI.countSuccessCheckout(event.item.id) then checkoutCount}
											{checkoutCount}
										{/await}</td>
									</tr>
									<tr>
										<th scope="row">Aantal Verkocht</th>
										<td>{#await CoreItemAPI.countSuccessTransaction(event.item.id) then transactionCount}
												{transactionCount}
											{/await}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Vertical divider -->
		<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

		<!-- Right hand side, brief statistics-->
		<div class="md:w-1/3">
			<h2 class="font-bold">Overzicht</h2>

			<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
				<h4 class="text-ingenium-grey-800 font-bold">Aantal Actieve:</h4>
				<p class="text-blue-900 font-bold">{data.available_count}</p>
			</div>
		</div>
	</div>
</main>