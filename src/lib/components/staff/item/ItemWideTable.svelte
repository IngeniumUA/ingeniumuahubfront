<script lang="ts">
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import { onMount } from 'svelte';
	import { CoreItemAPI, CoreItemWideAPI } from '$lib/core_api/core_api';
	import type { ItemWideI } from '$lib/models/item/itemwideI';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import ItemListEntry from '$lib/components/staff/item/ItemListEntry.svelte';
	import ItemEditModal from '$lib/components/staff/item/ItemEditModal.svelte';
	import { makePretty, parseBool, prettyDateTime } from '$lib/utilities/style-utilities';
	import { hasRole } from '$lib/states/auth.svelte';
	import AddNewItem from '$lib/components/staff/item/AddNewItem.svelte';
	import type { ItemI } from '$lib/models/item/itemI';

	let {
		baseQueryParam = $bindable(new URLSearchParams({ limit: '100', offset:'5' })),
		httpLoading = $bindable(false),
		defaultViewMode = $bindable(null), // list or table
		startItemCount = 0,
		startItems = [],
		forceItemType = null,
		showDisabledColumns = false,
	}: {
		baseQueryParam: URLSearchParams,
		httpLoading: boolean,
		defaultViewMode: ViewMode | null,
		startItemCount?: number,
		startItems?: ItemWideI[],
		forceItemType: string | null,
		showDisabledColumns: boolean,
	} = $props();

	let items: ItemWideI[] = $state(startItems);
	let itemCount: number = $state(startItemCount);

	onMount(() => {
		/**
		 * On Mount triggers whenever page is loaded
		 * This is fine, but when using the pre-fetching svelte kit function we might want to just
		 * pass defaults into this component, so we check that first
		 */
		if (items.length === 0 || itemCount === 0) {
			queryData(queryParam);
		} else {
			selectedArray = Array.from({ length: items.length }, () => false)
		}
	});

	/**
	 * Access
	 */
	let isWebmaster = hasRole("webmaster");

	/**
	 * Query logic
	 */
	let queryError: Error | null = $state(null)

	interface QueryFormI {
		itemID: number | null
		itemName: string | null;
		itemType: string | null;
		available: boolean | null;
		disabled: boolean | null;
		queryOffset: number;
		queryLimit: number;
	}
	let queryForm: QueryFormI = $state({
		itemID: null,
		itemName: null,
		available: baseQueryParam.get('available') === "none" ? null: parseBool(baseQueryParam.get('available') ?? 'true') ?? true,
		disabled: baseQueryParam.get('disabled') === "none" ? null: parseBool(baseQueryParam.get('disabled') ?? 'false') ?? false,
		itemType: baseQueryParam.get('item_type') ?? forceItemType,
		queryOffset: 0,
		queryLimit: parseInt(baseQueryParam.get('limit') ?? '50')
	})
	let queryParam = $derived.by(() => {
		let searchParam = new URLSearchParams()

		// From query form
		searchParam.set('offset', (queryForm.queryOffset * queryForm.queryLimit).toString());
		searchParam.set('limit', queryForm.queryLimit.toString());

		if (queryForm.itemID !== null && queryForm.itemID) searchParam.set('item_id', queryForm.itemID.toString());
		if (queryForm.itemName !== null && queryForm.itemName !== "") searchParam.set('item_name_contains', queryForm.itemName);

		if (queryForm.available !== null) searchParam.set("available", queryForm.available.toString());
		searchParam.set("disabled", queryForm.disabled === null ? 'None': queryForm.disabled.toString());

		// Item type
		if (forceItemType !== null) searchParam.set("item_type", forceItemType);
		if (queryForm.itemType !== null) searchParam.set("item_type", queryForm.itemType);

		let queryParam = new URLSearchParams()
		for (const [key, value] of baseQueryParam) {
			queryParam.set(key, value);
		}
		for (const [key, value] of searchParam) {
			queryParam.set(key, value);
		}
		return queryParam
	})

	async function queryData(queryParam: URLSearchParams) {
		if (httpLoading) return;
		httpLoading = true;
		try {
			items = await CoreItemWideAPI.queryItem(null, queryParam);
			itemCount = await CoreItemWideAPI.countItemWide(null, queryParam);
			selectedArray = Array.from({ length: items.length }, () => false)
		} catch (error) {
			queryError = error instanceof Error ? error : Error('Unknown error while querying');
		} finally {
			httpLoading = false;
		}
	}

	async function refresh() {
		await queryData(queryParam)
	}

	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	$effect(() => {
		$state.snapshot(queryForm);
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(refresh, 500);
	});

	/**
	 * Display
	 */
	function getDefaultViewMode(): ViewMode {
		const params = new URLSearchParams(window.location.search);
		const viewModeQuery = Object.fromEntries(params.entries())["view_mode"];
		if (viewModeQuery === 'list') return 'list';
		if (viewModeQuery === 'table') return 'table';
		return defaultViewMode === null ? 'list': defaultViewMode
	}
	type ViewMode = 'list' | 'table';

	let viewMode = $state(getDefaultViewMode());
	let tableView = $derived(viewMode === 'table')
	let tableHeaderName: string = $derived(makePretty((forceItemType?.slice(0, -4)) ?? "items"))
	function toggleViewMode() {
		if (tableView) {
			viewMode = 'list'
		} else {
			viewMode = 'table'
		}
	}

	/**
	 * Bulk Operations selection
	 */
	let allSelected: boolean = $state(false)
	function toggleAllSelected(value: boolean) {
		allSelected = value
		selectedArray = Array.from({ length: items.length }, () => value)
	}
	let selectedArray: boolean[] = $state([])

	/**
	 * Operations
	 */
	async function restore(item_identifier: number | string) {
		if (httpLoading) return;
		try {
			await CoreItemAPI.restoreItem(item_identifier)
		} catch (error) {
			failedToast(error instanceof Error ? error.message : "error");
		} finally {
			httpLoading = false;
		}
	}

	async function toggleAvailable(itemIndex: number, item: ItemI) {
		if (httpLoading) return;
		try {
			items[itemIndex] = await CoreItemAPI.patchAvailable(item.id, !item.availability.available);
			successToast("Updated!")
		} catch (error) {
			failedToast(error instanceof Error ? error.message : "Update failed");
		} finally {
			httpLoading = false;
		}
	}

	/**
	 * Adding New
	 */
	let showAddingNew = $state(false);

	/**
	 * Editing Modal State management
	 * We have to code in an $effect property for when the user clicks the "close" button in the modal
	 */
	let showEditModal: boolean = $state(false);
	let editItemIndex: number = $state(0);
	function setEdit(item_index: number) {
		editItemIndex = item_index;
		showEditModal = true;
	}
	// Reset editItemIndex when showEditModal changes to false
	$effect(() => {
		if (!showEditModal) {
			editItemIndex = 0;
		}
	});
</script>

<article>
	<div class="flex justify-between items-center mb-6 gap-4">
		<h2>{tableHeaderName} {viewMode}</h2>
		<button onclick={() => {showAddingNew = !showAddingNew}} class="ml-auto button button-primary w-24 button-inline">
			<span class="text-white">Add New</span>
		</button>

		<button
			onclick={toggleViewMode}
			class="button button-primary flex flex-row text-gray-700 transition duration-150 ease-in-out"
		>
			{#if tableView}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="!m-0"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M4 4h16v16h-16z" />
					<path d="M4 10h16" />
					<path d="M10 4v16" />
				</svg>
				<span>Show List</span>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="!m-0"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M9 6l11 0" />
					<path d="M9 12l11 0" />
					<path d="M9 18l11 0" />
					<path d="M5 6l0 0.01" />
					<path d="M5 12l0 0.01" />
					<path d="M5 18l0 0.01" />
				</svg>
				<span>Show Table</span>
			{/if}
		</button>

		<button onclick={() => {refresh(); successToast("Refreshed!")}} class="button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	{#if (queryError !== null)}
		<div class="error-message p-4">
			{JSON.stringify(queryError)}
		</div>
	{/if}

	{#if tableView}
	<table class="ingenium-table">
		<thead>
		<tr>
			<th>
				<div class="flex flex-col items-center justify-end h-full">
					<h4 class="flex-end">Select</h4>
					<input type="checkbox" class="p-0.5 rounded-md border-ingenium-grey-300 placeholder-ingenium-grey-300 font-thin" checked={allSelected} onclick={() => toggleAllSelected(!allSelected)}/>
				</div>
			</th>
			<th><div class="form-field">
				<h4>ID</h4>
				<input class="max-w-14" type="number" placeholder="ID" bind:value={queryForm.itemID}>
			</div></th>
			<th>
				<div class="form-field">
					<h4>Name</h4>
					<input class="max-w-32" type="text" placeholder="Item name" bind:value={queryForm.itemName}>
				</div>
			</th>
			<th>
				<h4>Item Type</h4>
				<div class="form-field min-w-24 max-w-32">
					<select id="item_type" required bind:value={queryForm.itemType}>
						{#each [null, 'eventitem', 'shopitem', 'promoitem'] as itemType}
							<option value={itemType}>
								{itemType === null ? "All": makePretty(itemType)}
							</option>
						{/each}
					</select>
				</div>
			</th>
			<th>
				<h4>Available</h4>
				<div class="form-field min-w-24 max-w-32">
					<select id="available" required bind:value={queryForm.available}>
						{#each [null, true, false] as availableOption}
							<option value={availableOption}>
								{availableOption === null ? "All": availableOption.toString()}
							</option>
						{/each}
					</select>
				</div>
			</th>
			{#if isWebmaster && showDisabledColumns}<th>
				<h4>Disabled</h4>
				<div class="form-field min-w-24 max-w-32">
					<select id="disabled" required bind:value={queryForm.disabled}>
						{#each [null, true, false] as disabledOption}
							<option value={disabledOption}>
								{disabledOption === null ? "All": disabledOption.toString()}
							</option>
						{/each}
					</select>
				</div>
			</th>{/if}
			<th><h4>Updated</h4></th>
<!--			<th><h4>Created</h4></th>-->
			<th class="p-0"><PaginationComponent
				bind:maxTotal={itemCount}
				bind:fetchedTotal={items.length}
				bind:currentOffset={queryForm.queryOffset}
				bind:currentLimit={queryForm.queryLimit}
				bind:httpLoading={httpLoading}
				refresh={refresh}
			>
			</PaginationComponent></th>
		</tr>
		</thead>
		<tbody>
		{#each items as itemWide, tableIndex (itemWide.item.id)}
			<tr>
				<th class="flex justify-center">
					<input class="p-0.5 rounded-md border-ingenium-grey-300 placeholder-ingenium-grey-300 font-thin" type="checkbox" checked={selectedArray[tableIndex]}/>
				</th>
				<th>
					<a href={`/staff/item/${itemWide.item.id}#overview`}>{itemWide.item.id}</a>
				</th>
				<td>
					{itemWide.item.name}
				</td>
				<td>
					{makePretty(itemWide.derived_type.derived_type_enum)}
				</td>
				<td>
					<label class="inline-flex items-center cursor-pointer my-4">
						<input type="checkbox" class="sr-only peer"
									 disabled={httpLoading}
									 bind:checked={itemWide.item.availability.available}
									 onclick="{() => toggleAvailable(tableIndex, itemWide.item)}"
						>
						<div class="relative w-11 h-6 bg-red-900 dark:bg-red-900 rounded-full peer-checked:bg-green-900 dark:peer-checked:bg-green-900 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
						<span class="ms-3 text-sm font-medium text-gray-600">
														{#if itemWide.item.availability.available}Beschikbaar{:else}Niet Beschikbaar{/if}
													</span>
					</label>
				</td>

				{#if isWebmaster && showDisabledColumns}
				<td>
					<button onclick={() => {restore(itemWide.item.id)}} disabled={httpLoading}
									class="ml-2 button button-primary button-inline">
						<span class="text-white">Reenable</span>
					</button>
				</td>
				{/if}
				<td>
					{prettyDateTime(itemWide.item.last_update_timestamp)}
				</td>
				<td>
					{prettyDateTime(itemWide.item.created_timestamp)}
				</td>

				<td>
					<button onclick={() => setEdit(tableIndex)}>
						<span>...</span>
					</button>
				</td>
			</tr>
		{/each}
		</tbody>
	</table>
	{:else}
	<!-- List view -->
		<label class="inline-flex items-center cursor-pointer my-4 ml-auto">
			<input type="checkbox" bind:checked={queryForm.available} class="sr-only peer">
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
		{#each items as itemWide, tableIndex (itemWide.item.id)}
			<ItemListEntry
				bind:httpLoading={httpLoading}
				bind:itemWide={items[tableIndex]}
				tableIndex={tableIndex}
				setEdit={setEdit}>
			</ItemListEntry>
		{/each}
	{/if}

	{#if items.length === 0}
		<div class="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
			<p class="text-gray-500 mb-4">Geen {tableHeaderName}s gevonden met deze filters.</p>
			<button onclick="{() => showAddingNew = true}" class="button button-primary button-inline">
				Maak er een aan
			</button>
		</div>
	{/if}
</article>

<AddNewItem bind:isOpen={ showAddingNew } itemType={queryForm.itemType}></AddNewItem>

{#if showEditModal}
	<ItemEditModal bind:isOpen={showEditModal} itemWide={items[editItemIndex]} />
{/if}