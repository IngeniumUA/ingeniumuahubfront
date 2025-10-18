<script lang="ts">
	import { CoreItemAPI, CoreItemWideAPI } from '$lib/core_api/core_api';
	import AddNewItem from '$lib/components/staff/AddNewItem.svelte';
	import { makePretty } from '$lib/utilities/style-utilities';
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import { toRecsysPreview } from '$lib/models/RecSysI';
	import { handleRequest } from '$lib/utilities/httpUtilities';
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
	import ItemEditModal from '$lib/components/staff/ItemEditModal.svelte';
	import { goto } from '$app/navigation';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let shopItems = $state(data.shopItems);
	let availableCount = $state(data.available_count);
	let totalCount = $state(data.total_count);

	/**
	 * Query parameter for showing available
	 */
	let onlyShowAvailable: boolean = $state(true);
	$effect(() => {
		if (onlyShowAvailable !== undefined) {
			refresh();
		}
	});

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
		shopItems = await CoreItemWideAPI.queryShopItem(null, query);

		const countQuery = new URLSearchParams({
			item_type: 'shopitem',
		});
		totalCount = await CoreItemWideAPI.countItemWide(null, countQuery);

		countQuery.set('available', 'true');
		availableCount = await CoreItemWideAPI.countItemWide(null, countQuery);
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

		if (shopItems.length <= item_index) {return}
		let shopItem = shopItems.at(item_index)
		if (shopItem === undefined) {return}
		shopItem.item.availability.available = !shopItem.item.availability.available

		loadingHTTP = true;
		try {
			await CoreItemAPI.putItem(shopItem.item.id, shopItem.item).catch(handleRequest);
			successToast("Item updated!")
			await refresh();
		} catch (error) {
			failedToast(`Failed ${error}`);
			await refresh()
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	/**
	 *
	 * @param product_blueprint_id
	 * @param new_value
	 */
	async function toggleBlueprintAvailable(product_blueprint_id: number, new_value: boolean) {
		if (loadingHTTP) { return }
		const put_model = { "available": !new_value };
		loadingHTTP = true;
		try {
			await CoreProductBlueprintAPI.patchProductBlueprint(product_blueprint_id, put_model).catch(handleRequest);
			successToast("Product updated!")
		} catch (error) {
			failedToast(`Failed ${error}`);
			await refresh()
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	/**
	 * Editing Modal State management
	 * We have to code in an $effect property for when the user clicks the "close" button in the modal
	 */
	let showEditModal: boolean = $state(false);
	let editItemIndex: number | null = $state(null);
	function setEdit(item_index: number) {
		editItemIndex = item_index;
		showEditModal = true; // Open the modal
	}
	// Reset editItemIndex when showEditModal changes to false
	$effect(() => {
		if (!showEditModal) {
			editItemIndex = null;
		}
	});

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

	<h2>Overzicht van Shop items</h2>
	<div class="py-4 gap-4 sm:flex-row sm:items-center flex flex-col justify-between">
		<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
			<h4 class="text-ingenium-grey-800 font-bold">Aantal Actieve:</h4>
			<p class="text-blue-900 font-bold">{availableCount}</p>
		</div>

		<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
			<h4 class="text-ingenium-grey-800 font-bold">Aantal Inactieve:</h4>
			<p class="text-blue-900 font-bold">{totalCount}</p>
		</div>

		<label class="inline-flex items-center cursor-pointer my-4 ml-auto">
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

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	<section class="flex flex-col gap-4">
		{#each shopItems as shopItem, index (shopItem.item.id)}
			<div class="bg-white p-4 rounded-lg
						min-h-48
						shadow-lg hover:shadow-xl transition-shadow">

				<!-- Title and edit -->
				<div class="flex justify-between items-center">
					<h2 class="font-semibold">{makePretty(shopItem.item.name)}</h2>
					<button aria-label="edit" onclick="{() => setEdit(index)}">
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
				<div class="container flex flex-col md:flex-row mr-12">
					<div class="md:w-1/3">
						<h3 class="font-bold">ShopItem Info</h3>
						<p>Description</p>

						<label class="inline-flex items-center cursor-pointer my-4">
							<input type="checkbox" class="sr-only peer"
										 bind:checked={shopItem.item.availability.available}
										 onclick="{() => patchAvailable(index)}"
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
								{#if (shopItem.item.availability.available)}Beschikbaar{:else}Niet Beschikbaar{/if}
							</span>
						</label>
						<div class="overflow-hidden">
							<RecSysPreviewItem item={toRecsysPreview(shopItem)} />
						</div>
					</div>

					<!-- Vertical divider -->
					<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

					<div class="overflow-x-auto self-stretch flex-1">
						<h3 class="font-bold">Producten</h3>
						{#await CoreItemAPI.attachedProductBlueprintTable(shopItem.item.id) then productTable}
							{#if (productTable.length >= 10)}
								...
							{:else}
								<table class="ingenium-table">
									<tbody>
									{#each productTable as row (row["product_blueprint_id"])}
										<tr>
											<th scope="row">{row["product_blueprint_name"]}</th>
											<td class="text-right">
												<label class="inline-flex items-center cursor-pointer my-4">
													<input type="checkbox" class="sr-only peer"
																 bind:checked={row["available"]}
																 onclick="{() => toggleBlueprintAvailable(row['product_blueprint_id'], row['available'])}"
													>
													<div class="relative w-11 h-6 bg-red-900 dark:bg-red-900 rounded-full peer-checked:bg-green-900 dark:peer-checked:bg-green-900 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
													<span class="ms-3 text-sm font-medium text-gray-600">
														{#if row["available"]}Beschikbaar{:else}Niet Beschikbaar{/if}
													</span>
												</label>
											</td>
											<td>{row["transaction_count"]} / {row["max_available"]}</td>
										</tr>
									{/each}
									</tbody>
								</table>
							{/if}
							<p class="text-right font-bold">Eind totaal: {productTable.reduce((sum, val) => {
								return sum + val["transaction_count"]
							}, 0)}</p>
						{/await}
					</div>
				</div>

				<div class="flex justify-end items-center my-2">
					<button class="button button-primary w-28 button-inline"
									onclick={() => goto(`/staff/item/${shopItem.item.id}#${shopItem.item.name}`)}>
						<span class="text-white">Naar Shop Item</span>
					</button>
				</div>
			</div>
		{/each}
	</section>
</main>

<AddNewItem bind:isOpen={ showAddingNew } itemType="shopitem"></AddNewItem>

{#if editItemIndex !== null && editItemIndex >= 0 && editItemIndex < shopItems.length}
	<ItemEditModal bind:isOpen={showEditModal} itemWide={shopItems[editItemIndex]} />
{/if}