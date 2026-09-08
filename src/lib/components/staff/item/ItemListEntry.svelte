<script lang="ts">
	import { makePretty } from '$lib/utilities/style-utilities';
	import { toRecsysPreview } from '$lib/models/RecSysI';
	import { CoreItemAPI } from '$lib/core_api/core_api';
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import type { ItemWideI } from '$lib/models/item/itemwideI';
	import { handleRequest } from '$lib/utilities/httpUtilities';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';

	let {
		httpLoading = $bindable(false),
		itemWide = $bindable(),
		tableIndex = $bindable(0),
		setEdit = $bindable<((index: number) => void)>(() => {})
	}: {
		httpLoading: boolean
		itemWide: ItemWideI
		tableIndex: number
		setEdit: ((index: number) => void)
	} = $props();

	/**
	 * Display
	 */
	let productCapable =$derived(["eventitem", "shopitem"].includes(itemWide.derived_type.derived_type_enum))
	let displayCapable = $derived(["eventitem", "shopitem", "promoitem"].includes(itemWide.derived_type.derived_type_enum))

	/**
	 * Will filter blueprint table entries *ONLY IF THEY EXCEED BASE LENGTH*
	 */
	interface ProductTableEntry {
		product_blueprint_id: number;
		product_blueprint_name: string;
		available: boolean;
		transaction_count: number;
		max_available: number
	}

	const productTableForItemLimit = 10; // How many items down the list will have their products prefetched
	const productTableMaxSize = 6;

	function resizeLength(productTable: ProductTableEntry[]): ProductTableEntry[] {
		if (productTable.length < productTableMaxSize) return productTable;
		return productTable.filter((row) => {return row['available']})
	}

	/**
	 * Operations
	 */
	async function patchAvailable() {
		if (httpLoading) { return }

		itemWide.item.availability.available = !itemWide.item.availability.available

		httpLoading = true;
		try {
			itemWide = await CoreItemAPI.putItem(itemWide.item.id, itemWide.item).catch(handleRequest);
			successToast("Item updated!")
		} catch (error) {
			failedToast(`Failed ${error}`);
		} finally {
			httpLoading = false;
		}
	}

	async function toggleBlueprintAvailable(product_blueprint_id: number, new_value: boolean) {
		if (httpLoading) { return }
		const put_model = { "available": !new_value };
		httpLoading = true;
		try {
			await CoreProductBlueprintAPI.patchProductBlueprint(product_blueprint_id, put_model).catch(handleRequest);
			successToast("Product updated!")
		} catch (error) {
			failedToast(`Failed ${error}`);
		} finally {
			httpLoading = false;
		}
	}
</script>


<article class="bg-white p-4 rounded-lg
					min-h-48
					shadow-lg hover:shadow-xl transition-shadow">
	<!-- Title and edit -->
	<div class="flex justify-between items-center">
		<h2 class="font-semibold">{makePretty(itemWide.item.name)}</h2>
		<button aria-label="edit" onclick="{() => setEdit(tableIndex)}">
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
	<div class="container flex flex-col lg:flex-row mr-12">
		<div class="lg:md:w-1/3">
			<label class="inline-flex items-center cursor-pointer my-4">
				<input type="checkbox" class="sr-only peer"
							 bind:checked={itemWide.item.availability.available}
							 onclick="{() => patchAvailable()}"
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
				<span class="hidden lg:inline ms-3 text-sm font-medium text-gray-600">
							{#if (itemWide.item.availability.available)}Beschikbaar{:else}Niet Beschikbaar{/if}
						</span>
			</label>
			<div class="overflow-hidden">
				{#if displayCapable}
					<RecSysPreviewItem item={toRecsysPreview(itemWide)} />
				{/if}
			</div>
		</div>

		<!-- Vertical divider -->
		<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

		<div class="overflow-x-auto self-stretch flex-1 mt-4 lg:mt-0">
			{#if productCapable}
				<h3 class="font-bold">Producten</h3>
				{#if tableIndex < productTableForItemLimit}
					{#await CoreItemAPI.attachedProductBlueprintTable(itemWide.item.id) then productTable}
						<table class="ingenium-table">
							<tbody>
								{#if (resizeLength(productTable).length >= productTableMaxSize)}
									<tr>
										<th scope="row">Totaal transactions</th>
										<td class="text-right">
											{productTable.reduce((sum, val) => {
												return sum + val["transaction_count"]
											}, 0)}
										</td>
									</tr>
								{:else}
									{#each resizeLength(productTable) as row (row["product_blueprint_id"])}
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
								{/if}
							</tbody>
						</table>

						<p class="text-right font-bold">Totaal: {productTable.reduce((sum, val) => {
							return sum + val["transaction_count"]
						}, 0)}</p>
					{/await}
				{:else}
					<p>Only showing products for first {productTableForItemLimit} items in the list.
					Smarter pagination could be a todo :)</p>
				{/if}

			<!-- Else case for 'productCapable' -->
			{:else}
				<h3 class="font-bold">Idk</h3>
				<p>Idk wat hier te zetten, dit is enkel promoitems op dit moment.
				Misschien via de core naar umami de bezoekcijfers opvragen? Zo deze https://umami.is/docs/api/website-stats#get-apiwebsiteswebsiteidstats</p>
			{/if}
		</div>
	</div>

	<div class="flex justify-end items-center my-2">
		<a class="button button-primary button-inline"
			 href={`/staff/item/${itemWide.item.id}#${itemWide.item.name}`}>
			<span class="text-white">Naar pagina</span>
		</a>
	</div>
</article>