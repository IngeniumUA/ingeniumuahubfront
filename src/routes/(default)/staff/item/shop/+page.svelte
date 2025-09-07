<script lang="ts">
	import { CoreItemWideAPI } from '$lib/core_api/core_api';
	import AddNewItem from '$lib/components/staff/AddNewItem.svelte';

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
			limit: '20',
		});
		if (onlyShowAvailable) {
			query.set("available", `${onlyShowAvailable}`)
		}
		data.shopitems = await CoreItemWideAPI.queryShopItem(query);
	}

	/**
	 * Boolean state for add new modal
	 */
	let showAddingNew = $state(false);
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>Shop Items</h1>
		<button onclick={() => {showAddingNew = !showAddingNew}} class="ml-auto button button-primary w-24 button-inline">
			<span class="text-white">Add New</span>
		</button>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<div class="alert alert-info mb-4 max-w-3xl">
		<p class="alert-text">Shopitems zijn een soort Item die producten kunnen aanbieden.
			Ze hebben een <span class="italic">display</span> mixin alles van banner en kleur te configureren.
			Via <span class="italic">HubProductBlueprints</span> kan je daarna ook instellen welke producten aangekocht worden.
			Om te kunnen beperken wie er wanneer het item kan bekijken, is er de <span class="italic">Availability</span> mixin.
			Het is niet super verschillen van een event, enkel de start en einddatum atm (8/2025).</p>
	</div>

	<!-- List of Events -->
	<h2>Overzicht van Shop items</h2>
	<div class="py-4 flex justify-between items-center">
		<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
			<h4 class="text-ingenium-grey-800 font-bold">Aantal Actieve:</h4>
			<p class="text-blue-900 font-bold">{data.available_count}</p>
		</div>

		<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
			<h4 class="text-ingenium-grey-800 font-bold">Aantal Inactieve:</h4>
			<p class="text-blue-900 font-bold">{data.total_count}</p>
		</div>

		<label class="inline-flex items-center cursor-pointer my-4">
			<input type="checkbox" bind:checked={onlyShowAvailable} class="sr-only peer">
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
	</div>

	<p>Todo, Tabel van shopitems, hetzelfde als eventitem? Zouden we dat abstracten? Overbodig mis want da zijn de enigste 2 usecases</p>
</main>

<AddNewItem bind:isOpen={ showAddingNew } itemType="shopitem"></AddNewItem>