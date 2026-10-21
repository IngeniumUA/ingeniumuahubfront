<script lang="ts">
	import { onMount } from 'svelte';
	import { OnkostenNotaEnum, OnkostenNotaEnumList, type OnkostenNotaI } from '$lib/models/onkosten/onkostennota';
	import { CoreOnkostenNotaAPI } from '$lib/core_api/onkostennota_api';
	import { makePretty, onkostenIdentifier, prettyDate } from '$lib/utilities/style-utilities';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import OnkostenEditModel from '$lib/components/staff/onkosten/OnkostenEditModel.svelte';


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
	let editSelected: OnkostenNotaI | null = $state(null);
	let showEdit: boolean = $state(false);

	async function setEditItemIndex(index: number) {
		editSelectedIndex = index;
		if (editSelectedIndex !== null && editSelectedIndex < onkostenNota.length) {
			editSelected = onkostenNota.at(editSelectedIndex)!;
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
</script>

<article>
	<div class="flex justify-between items-center">
		<h2>Ingediende Onkostennota</h2>
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
						<button class="button button-danger m-0">Afwijzen</button>
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
	<OnkostenEditModel onkostennota={editSelected} bind:isOpen={showEdit}></OnkostenEditModel>
{/if}

<style>
    .red {@apply border-red-700 text-red-700 bg-red-100;}
    .orange {@apply  border-orange-700 text-orange-700 bg-orange-100;}
    .green {@apply  border-green-700 text-green-700 bg-green-100;}
    .gray {@apply  border-gray-700 text-gray-700 bg-gray-100;}
</style>