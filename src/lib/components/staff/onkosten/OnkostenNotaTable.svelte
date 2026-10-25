<script lang="ts">
	import { onMount } from 'svelte';
	import { OnkostenNotaEnum, OnkostenNotaEnumList, type OnkostenNotaI } from '$lib/models/onkosten/onkostennota';
	import { CoreOnkostenNotaAPI } from '$lib/core_api/onkostennota_api';
	import {
		currentQuarter,
		makePretty,
		onkostenIdentifier,
		prettyDate,
		quarterRange
	} from '$lib/utilities/style-utilities';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import OnkostenEditModel from '$lib/components/staff/onkosten/OnkostenEditModel.svelte';
	import type { OnkostenNotaWideI } from '$lib/models/onkosten/onkostennota.ts';
	import DeleteButton from '$lib/components/staff/DeleteButton.svelte';


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
		status: OnkostenNotaEnum;
		date_kosten_gemaakt: string | null;
		date_kosten_voldaan: string | null;

		periode: string | null;
	}
	let queryForm: QueryFormI = $state({
		user_email: null,
		volgNr: null,
		status: OnkostenNotaEnum.in_afwachting,
		queryOffset: 0,
		queryLimit: parseInt(baseQueryParam.get('limit') ?? '50'),
		date_kosten_gemaakt: null,
		date_kosten_voldaan: null,
		periode: null,
	})
	let queryParam = $derived.by(() => {
		let searchParam = new URLSearchParams()
		// From query form
		searchParam.set('offset', (queryForm.queryOffset * queryForm.queryLimit).toString());
		searchParam.set('limit', queryForm.queryLimit.toString());
		if (queryForm.user_email !== null && queryForm.user_email !== "") searchParam.set('user_email_contains', queryForm.user_email);

		if (queryForm.status !== null) searchParam.set("onkostennota_status", queryForm.status.toString());
		if (queryForm.volgNr !== null) searchParam.set("volgnummer", queryForm.volgNr.toString());
		if (queryForm.date_kosten_gemaakt !== null) searchParam.set("kosten_gemaakt_timestamp", queryForm.date_kosten_gemaakt.toString());
		if (queryForm.date_kosten_voldaan !== null) searchParam.set("onkosten_voldaan_timestamp", queryForm.date_kosten_voldaan.toString());

		// Kwartaal query
		if (queryForm.date_kosten_gemaakt === null && queryForm.periode !== null) {
			const [year, quarter] = queryForm.periode.split('-').map(Number);
			const { from, to } = quarterRange(year, quarter);
			searchParam.set('from_onkosten_voldaan_timestamp', from);
			searchParam.set('until_onkosten_voldaan_timestamp', to);
		}

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
	/** Last `count` quarters, newest first, e.g. { value: '2026-4', label: 'Q4 2026' } */
	export function quarterOptions(count = 8): { value: string; label: string }[] {
		const now = new Date();
		let year = now.getFullYear();
		let q = currentQuarter(now);
		const out: { value: string; label: string }[] = [];
		for (let i = 0; i < count; i++) {
			out.push({ value: `${year}-${q}`, label: `Q${q} ${year}` });
			q--;
			if (q === 0) {
				q = 4;
				year--;
			}
		}
		return out;
	}

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
		<button onclick={download} disabled class="ml-auto button button-primary w-24 button-inline">
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

	<section class="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg border border-ingenium-grey-300 p-4 my-4">
		<!-- Left: quarter selection -->
		<div class="flex flex-col gap-2">
			<h3 class="font-bold">Kwartaal</h3>
			<div class="flex items-end gap-2">
				<div class="form-field">
					<select bind:value={queryForm.periode} disabled={queryForm.date_kosten_gemaakt !== null}>
						<option value={null}>Alle</option>
						{#each quarterOptions() as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>
				{#if queryForm.periode !== null}
					<button class="button button-inline" onclick={() => (queryForm.periode = null)}>Wis</button>
				{/if}
			</div>
			{#if queryForm.periode !== null}
				<p class="text-gray-500">Door deze filter wordt er automatisch enkel<br>gekeken naar afgewerkte onkostennota's</p>
			{/if}
			{#if queryForm.date_kosten_gemaakt !== null}
				<p class="text-sm text-gray-500">Genegeerd: een specifieke datum is ingesteld.</p>
			{/if}
		</div>

		<!-- Right: summary (placeholder for now) -->
		<div class="flex flex-col gap-2 md:border-l md:pl-6 border-ingenium-grey-300">
			<h3 class="font-bold">Samenvatting</h3>
			<p class="text-gray-500">{onkostenCount} onkostennota's in deze selectie</p>
		</div>
	</section>

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
				<th>
					<div class="form-field">
						<h4>Datum Kosten gemaakt</h4>
						<input class="max-w-36" type="date" bind:value={queryForm.date_kosten_gemaakt}>
					</div>
				</th>
				<th>
					<div class="form-field">
						<h4>Datum Kosten voldaan</h4>
						<input class="max-w-36" type="date" bind:value={queryForm.date_kosten_voldaan}>
					</div>
				</th>
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
						{onkosten.datum_onkosten_voldaan === null ? "onvoldaan": prettyDate(onkosten.datum_onkosten_voldaan)}
					</td>
					<td>
						€{Number(onkosten.price_eu).toFixed(2)}
					</td>
					<td>
						<span class="rounded-lg py-1 px-2 {statusToColor(onkosten.onkostennota_status)}">{makePretty(OnkostenNotaEnum[onkosten.onkostennota_status])}</span>
					</td>
					<td>
						<div class="flex items-stretch gap-2">
							<button class="button button-primary" onclick={() => setEditItemIndex(tableIndex)}>
								Openen & Aanvullen
							</button>
							<DeleteButton bind:loadingHTTP={loadingHTTP} iconOnly={true} deleteCallback={() => deleteRow(onkosten)}>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 456 511.82">
									<path fill="#fff" d="M48.42 140.13h361.99c17.36 0 29.82 9.78 28.08 28.17l-30.73 317.1c-1.23 13.36-8.99 26.42-25.3 26.42H76.34c-13.63-.73-23.74-9.75-25.09-24.14L20.79 168.99c-1.74-18.38 9.75-28.86 27.63-28.86zM24.49 38.15h136.47V28.1c0-15.94 10.2-28.1 27.02-28.1h81.28c17.3 0 27.65 11.77 27.65 28.01v10.14h138.66c.57 0 1.11.07 1.68.13 10.23.93 18.15 9.02 18.69 19.22.03.79.06 1.39.06 2.17v42.76c0 5.99-4.73 10.89-10.62 11.19-.54 0-1.09.03-1.63.03H11.22c-5.92 0-10.77-4.6-11.19-10.38 0-.72-.03-1.47-.03-2.23v-39.5c0-10.93 4.21-20.71 16.82-23.02 2.53-.45 5.09-.37 7.67-.37zm83.78 208.38c-.51-10.17 8.21-18.83 19.53-19.31 11.31-.49 20.94 7.4 21.45 17.57l8.7 160.62c.51 10.18-8.22 18.84-19.53 19.32-11.32.48-20.94-7.4-21.46-17.57l-8.69-160.63zm201.7-1.74c.51-10.17 10.14-18.06 21.45-17.57 11.32.48 20.04 9.14 19.53 19.31l-8.66 160.63c-.52 10.17-10.14 18.05-21.46 17.57-11.31-.48-20.04-9.14-19.53-19.32l8.67-160.62zm-102.94.87c0-10.23 9.23-18.53 20.58-18.53 11.34 0 20.58 8.3 20.58 18.53v160.63c0 10.23-9.24 18.53-20.58 18.53-11.35 0-20.58-8.3-20.58-18.53V245.66z"/></svg>
							</DeleteButton>
						</div>
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