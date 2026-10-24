<script lang="ts">
	import { onMount } from 'svelte';
	import { OnkostenNotaEnum, OnkostenNotaEnumList, type OnkostenNotaI } from '$lib/models/onkosten/onkostennota';
	import { CoreOnkostenNotaAPI } from '$lib/core_api/onkostennota_api';
	import { makePretty, onkostenIdentifier, prettyDate } from '$lib/utilities/style-utilities';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import OnkostenEditModel from '$lib/components/staff/onkosten/OnkostenEditModel.svelte';
	import type { OnkostenNotaWideI } from '$lib/models/onkosten/onkostennota.ts';


	let {
		baseQueryParam = $bindable(new URLSearchParams({ limit: '100', offset:'5' }))
	}: {
		baseQueryParam: URLSearchParams
	} = $props();

	let onkostenCount: number = $state(0);
	let onkostenNota: OnkostenNotaI[] = $state([])

	let showUserColumn = true;

	onMount(() => {
		queryData(queryParam);
	});

	/**
	 * Query logic
	 */
	interface QueryFormI {
		user_email: string | null;
		volgNr: number | null;
		queryOffset: number;
		queryLimit: number;
		status: OnkostenNotaEnum
	}
	let queryForm: QueryFormI = $state({
		user_email: null,
		volgNr: null,
		status: OnkostenNotaEnum.in_afwachting,
		queryOffset: 0,
		queryLimit: parseInt(baseQueryParam.get('limit') ?? '50')
	})
	let queryParam = $derived.by(() => {
		let searchParam = new URLSearchParams()
		// From query form
		searchParam.set('offset', (queryForm.queryOffset * queryForm.queryLimit).toString());
		searchParam.set('limit', queryForm.queryLimit.toString());
		if (queryForm.user_email !== null && queryForm.user_email !== "") searchParam.set('user_email_contains', queryForm.user_email);

		let queryParam = new URLSearchParams()
		for (const [key, value] of baseQueryParam) {
			queryParam.set(key, value);
		}
		for (const [key, value] of searchParam) {
			queryParam.set(key, value);
		}
		return queryParam
	})
	let loadingHTTP = $state(false);

	let queryError: Error | null = $state(null);
	async function queryData(queryParam: URLSearchParams) {
		if (loadingHTTP) return;
		onkostenNota = await CoreOnkostenNotaAPI.queryOnkostenNota(null, queryParam);
		onkostenCount = await CoreOnkostenNotaAPI.countOnkostenNota(null, queryParam);

		selectedArray = Array.from({ length: onkostenNota.length }, () => false)
	}

	/**
	 *
	 */
	async function refresh() {
		await queryData(queryParam)
	}

	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	$effect(() => {
		$state.snapshot(queryForm);
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(refresh, 1000);
	});

	/**
	 * Bulk Operations selection
	 */
	let allSelected: boolean = $state(false)
	function toggleAllSelected(value: boolean) {
		allSelected = value
		selectedArray = Array.from({ length: onkostenNota.length }, () => value)
	}
	let selectedArray: boolean[] = $state([])

	/**
	 * Downloading
	 */
	let downloadError: Error | null = $state(null);
	async function download() {
		if (loadingHTTP) return;
		loadingHTTP = true;
		try {
			await CoreOnkostenNotaAPI.downloadOnkostenTable(null, queryParam);
			downloadError = null;
		} catch (error) {
			downloadError = error instanceof Error ? error : Error('Error download');
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	/**
	 * State management for transaction edit model
	 */
	let editSelectedIndex: null | number = $state(null);
	let editSelected: OnkostenNotaWideI | null = $state(null);
	let showEdit: boolean = $state(false);

	async function setEditItemIndex(index: number) {
		editSelectedIndex = index;
		if (editSelectedIndex !== null && editSelectedIndex < onkostenNota.length) {
			editSelected = await CoreOnkostenNotaAPI.getOnkostennota(null, onkostenNota.at(index)!.volgnummer);
			showEdit = true;
		}
	}

	/**
	 *
	 */
	function statusToColor(status: OnkostenNotaEnum) {
		switch (status) {
			case OnkostenNotaEnum.in_afwachting: return 'orange';
			case OnkostenNotaEnum.afgewerkt: return 'green';
			case OnkostenNotaEnum.afgewezen: return 'red';
		}
	}

	/**
	 *
	 */
	async function deleteRow(onkosten: OnkostenNotaI) {
		if (loadingHTTP) return;
		loadingHTTP = true;
		try {
			await CoreOnkostenNotaAPI.deleteOnkostennota(null, onkosten.volgnummer);
			queryError = null;
		} catch (error) {
			queryError = error instanceof Error ? error : Error('Error deleting');
		} finally {
			loadingHTTP = false; // Reset loading state
			await refresh()
		}
	}
</script>

<article>
	<div class="flex justify-between items-center">
		<h2 id="onkostennota_table">Ingediende Onkostennota</h2>
		<button onclick={download} class="ml-auto button button-primary w-24 button-inline">
			<span class="text-white">Download</span>
		</button>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	{#if (queryError !== null)}
		<div class="error-message p-4">
			{JSON.stringify(queryError)}
		</div>
	{/if}
	{#if (downloadError !== null)}
		<div class="error-message p-4">
			{JSON.stringify(downloadError)}
		</div>
	{/if}

	<div class="overflow-x-auto w-full">
		<table class="ingenium-table">
			<thead>
			<tr>
				<th>
					<div class="flex flex-col items-center justify-end h-full">
						<h4 class="flex-end">Select</h4>
						<input type="checkbox" class="p-0.5 rounded-md border-ingenium-grey-300 placeholder-ingenium-grey-300 font-thin" checked={allSelected} onclick={() => toggleAllSelected(!allSelected)}/>
					</div>
				</th>
				<th>
					<div class="form-field">
						<h4>VolgNr.</h4>
						<input class="max-w-32" type="number" placeholder="ID" bind:value={queryForm.volgNr}>
					</div>
				</th>
				{#if showUserColumn}
					<th>
						<div class="form-field">
							<h4>User</h4>
							<input class="max-w-32" type="email" placeholder="Email" bind:value={queryForm.user_email}>
						</div>
					</th>
				{/if}
				<th><h4>Datum Kosten</h4></th>
				<th><h4>Totaal</h4></th>
				<th>
					<div class="form-field">
						<h4>Status</h4>
						<div class="form-field max-w-32">
							<select id="validity" required bind:value={queryForm.status}>
								{#each [null, ...OnkostenNotaEnumList] as status}
									<option value={status}>
										{status === null ? "All": makePretty(OnkostenNotaEnum[status])}
									</option>
								{/each}
							</select>
						</div>
					</div>
				</th>
				<th class="p-0"><PaginationComponent
					bind:maxTotal={onkostenCount}
					bind:fetchedTotal={onkostenNota.length}
					bind:currentOffset={queryForm.queryOffset}
					bind:currentLimit={queryForm.queryLimit}
					bind:httpLoading={loadingHTTP}
					refresh={refresh}
				>
				</PaginationComponent></th>
			</tr>
			</thead>
			<tbody>
			{#each onkostenNota as onkosten, tableIndex (onkosten.volgnummer)}
				<tr>
					<th class="flex justify-center">
						<input class="p-0.5 rounded-md border-ingenium-grey-300 placeholder-ingenium-grey-300 font-thin" type="checkbox" checked={selectedArray[tableIndex]}/>
					</th>
					<td>
						{onkostenIdentifier(onkosten.volgnummer, onkosten.billing_information.given_name, onkosten.billing_information.family_name)}
					</td>
					{#if showUserColumn}
						<td>
							<a href={`/staff/user/${onkosten.user_email}#overview`}>{onkosten.user_email}</a>
						</td>
					{/if}
					<td>
						{prettyDate(onkosten.datum_gemaakte_kosten)}
					</td>
					<td>
						€{onkosten.price_eu}
					</td>
					<td>
						<span class="rounded-lg py-1 px-2 {statusToColor(onkosten.onkostennota_status)}">{makePretty(OnkostenNotaEnum[onkosten.onkostennota_status])}</span>
					</td>
					<td>
						<button class="button button-primary" onclick={() => setEditItemIndex(tableIndex)}>Openen & Aanvullen</button>
						<button class="button button-danger m-0" aria-label="Delete" onclick={() => deleteRow(onkosten)}>
							<svg fill="#7F1E1D" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 0 408.483 408.483" xml:space="preserve">
								<g id="SVGRepo_bgCarrier" stroke-width="0"/>
								<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
								<g id="SVGRepo_iconCarrier"> <g> <g> <path d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316 H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293 c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329 c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355 c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356 c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"/> <path d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916 c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z"/> </g> </g> </g>
							</svg>
						</button>
					</td>
				</tr>
			{/each}
			</tbody>
		</table>
	</div>

	{#if onkostenNota.length === 0}
		<div class="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
			<p class="text-gray-500 mb-4">Geen onkostennota gevonden met deze filters.</p>
		</div>
	{/if}
</article>

{#if editSelectedIndex !== null && editSelectedIndex >= 0 && editSelectedIndex < onkostenNota.length && editSelected !== null}
	<OnkostenEditModel nota={editSelected} bind:isOpen={showEdit} refresh={refresh}></OnkostenEditModel>
{/if}

<style>
    .red {@apply border-red-700 text-red-700 bg-red-100;}
    .orange {@apply  border-orange-700 text-orange-700 bg-orange-100;}
    .green {@apply  border-green-700 text-green-700 bg-green-100;}
    .gray {@apply  border-gray-700 text-gray-700 bg-gray-100;}
</style>