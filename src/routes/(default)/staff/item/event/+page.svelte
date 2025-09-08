<script lang="ts">
	import { CoreItemAPI, CoreItemWideAPI } from '$lib/core_api/core_api';
	import { makePretty } from '$lib/utilities/style-utilities';
	import { handleRequest } from '$lib/utilities/httpUtilities';
	import { toast } from '@zerodevx/svelte-toast'
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import AddNewItem from '$lib/components/staff/AddNewItem.svelte';
	import ItemEditModal from '$lib/components/staff/ItemEditModal.svelte';
	import { toRecsysPreview } from '$lib/models/RecSysI';
	import { goto } from '$app/navigation';

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
		if (onlyShowAvailable) {
			query.set("available", `${onlyShowAvailable}`)
		}
		data.events = await CoreItemWideAPI.queryEventItem(query);
		toast.push("Refreshed!", {
			theme: {
				'--toastColor': 'mintcream',
				'--toastBackground': 'rgba(72,187,120,0.9)',
				'--toastBarBackground': '#2F855A'
			}
		})
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

		if (data.events.length <= item_index) {return}
		let eventitem = data.events.at(item_index)
		if (eventitem === undefined) {return}
		eventitem.item.availability.available = !eventitem.item.availability.available

		loadingHTTP = true;
		try {
			await CoreItemAPI.putItem(eventitem.item.id, eventitem.item).catch(handleRequest);
			toast.push("Item updated!", {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(72,187,120,0.9)',
					'--toastBarBackground': '#2F855A'
				}
			})
			await refresh();
		} catch (error) {
			toast.push(`Failed ${error}`, {
				theme: {
					'--toastColor': 'mistyrose',
					'--toastBackground': 'rgba(229, 62, 62, 0.9)', // red-600
					'--toastBarBackground': '#C53030' // red-700
				}
			});
			await refresh()
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	async function toggleBlueprintAvailable(product_blueprint_id: number, new_value: boolean) {
		if (loadingHTTP) { return }
		const put_model = { "available": !new_value };
		loadingHTTP = true;
		try {
			await CoreProductBlueprintAPI.patchProductBlueprint(product_blueprint_id, put_model).catch(handleRequest);
			toast.push("Product updated!", {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(72,187,120,0.9)',
					'--toastBarBackground': '#2F855A'
				}
			})
		} catch (error) {
			toast.push(`Failed ${error}`, {
				theme: {
					'--toastColor': 'mistyrose',
					'--toastBackground': 'rgba(229, 62, 62, 0.9)', // red-600
					'--toastBarBackground': '#C53030' // red-700
				}
			});
			await refresh()
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	/**
	 * Boolean state for add new modal
	 */
	let showAddingNew = $state(false);

	/**
	 * Editting Modal State management
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
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>Events</h1>
		<button onclick={() => {showAddingNew = !showAddingNew}} class="ml-auto button button-primary w-24 button-inline">
			<span class="text-white">Add New</span>
		</button>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<div class="alert alert-info mb-4 max-w-3xl">
		<p class="alert-text">Evenementen zijn een soort Item die producten kunnen aanbieden.
			Ze hebben eerst en vooral een <span class="italic">display</span> mixin om te controleren hoe de pagina en de preview er uit ziet.
			Via <span class="italic">HubProductBlueprints</span> kan je daarna ook instellen welke producten aangekocht worden.
			Om te kunnen beperken wie er wanneer het item kan bekijken, is er de <span class="italic">Availability</span> mixin.
			Het is niet super verschillen van een event, enkel de start en einddatum atm (8/2025).</p>
	</div>

	<!-- List of Events -->
	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<h2>Overzicht van Evenementen</h2>
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

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	<section class="flex flex-col gap-4">
		{#each data.events as event, index (event.item.id)}
			<div class="bg-white p-4 rounded-lg
						min-h-48
						shadow-lg hover:shadow-xl transition-shadow">

				<!-- Title and edit -->
				<div class="flex justify-between items-center">
					<h2 class="font-semibold">{makePretty(event.item.name)}</h2>
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
						<h3 class="font-bold">Event Info</h3>
						<p>Description</p>

						<label class="inline-flex items-center cursor-pointer my-4">
							<input type="checkbox" class="sr-only peer"
										 bind:checked={event.item.availability.available}
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
								{#if (event.item.availability.available)}Beschikbaar{:else}Niet Beschikbaar{/if}
							</span>
						</label>
						<div class="overflow-hidden">
							<RecSysPreviewItem item={toRecsysPreview(event)} />
						</div>
					</div>

					<!-- Vertical divider -->
					<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

					<div class="overflow-x-auto self-stretch flex-1">
						<h3 class="font-bold">Producten</h3>
						{#await CoreItemAPI.attachedProductBlueprintTable(event.item.id) then productTable}
							{#if (productTable.length >= 10)}
								Bekijk de pagina
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
						{/await}
					</div>
				</div>

				<div class="flex justify-end items-center my-2">
					<button class="button button-primary w-28 button-inline"
									onclick={() => goto(`/staff/item/${event.item.id}`)}>
						<span class="text-white">Naar Event</span>
					</button>
				</div>
			</div>
		{/each}
	</section>
</main>

<AddNewItem bind:isOpen={ showAddingNew } itemType="eventitem"></AddNewItem>

{#if editItemIndex !== null && editItemIndex >= 0 && editItemIndex < data.events.length}
	<ItemEditModal bind:isOpen={showEditModal} itemWide={data.events[editItemIndex]} />
{/if}