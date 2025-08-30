<script lang="ts">
	import { CoreItemWideAPI } from '$lib/core_api/core_api';

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
		data.events = await CoreItemWideAPI.queryShopItem(query);
	}
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>Shop Items</h1>
		<button class="ml-auto button button-primary w-24 button-inline">
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
	<p>TODO: Aantal available count toevoegen (gewoon alle met available op True)</p>

	<p>Todo, Tabel van shopitems, hetzelfde als eventitem? Zouden we dat abstracten? Overbodig mis want da zijn de enigste 2 usecases</p>
</main>