<script lang="ts">
	import { onMount } from 'svelte';
	import { successToast } from '$lib/components/toast/defined_toast';
	import { makePretty, prettyDateTime } from '$lib/utilities/style-utilities';
	import { DBLogAPI } from '$lib/core_api/dblog_api';
	import type { DBLogI } from '$lib/models/dblog';

	let { baseQueryParam = $bindable(new URLSearchParams({ limit: '100', offset:'5' })) }: { baseQueryParam: URLSearchParams } = $props();

	let dblogCount: number = $state(0);
	let dblogs: DBLogI[] = $state([])

	onMount(() => {
		queryData(queryParam);
	});

	/**
	 * Query logic
	 */
	interface QueryFormI {
		requestIdQuery: null | string,
		tableNameQuery: null | string,
		rowPrimaryKeyQuery: null | number,
	}
	let queryForm: QueryFormI = $state({
		requestIdQuery: null,
		tableNameQuery: null,
		rowPrimaryKeyQuery: null,
	})
	let queryParam = $derived.by(() => {
		let searchParam = new URLSearchParams()
		if (queryForm.requestIdQuery !== null && queryForm.requestIdQuery !== "") searchParam.set('request_id', queryForm.requestIdQuery);
		if (queryForm.tableNameQuery !== null && queryForm.tableNameQuery !== "") searchParam.set('table_name', queryForm.tableNameQuery);
		if (queryForm.rowPrimaryKeyQuery !== null && queryForm.rowPrimaryKeyQuery) searchParam.set('row_primary_key', queryForm.rowPrimaryKeyQuery.toString());

		let queryParam = new URLSearchParams()
		for (const [key, value] of baseQueryParam) {
			queryParam.append(key, value);
		}
		for (const [key, value] of searchParam) {
			queryParam.append(key, value);
		}
		return queryParam
	})
	let loadingHTTP = $state(false);

	let queryError: Error | null = $state(null)
	async function queryData(queryParam: URLSearchParams) {
		if (loadingHTTP) return;
		dblogs = await DBLogAPI.queryCoreDBLog(null, queryParam);
		dblogCount = await DBLogAPI.countCoreDBLog(null, queryParam);
	}

	/**
	 *
	 */
	async function refresh() {
		await queryData(queryParam)
		successToast("Refreshed!")
	}

	/**
	 * Bulk Operations selection
	 */
	// let selectedArray: boolean[] = $state([])

	/**
	 * Downloading
	 */
	async function download() {
		if (loadingHTTP) return;
		loadingHTTP = true;
		try {
			await DBLogAPI.downloadDblog(null, queryParam);
			queryError = null;
		} catch (error) {
			queryError = error instanceof Error ? error : Error('Error download');
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}
</script>

<style>
    section {
        @apply mt-4 p-4 pl-0 rounded-lg shadow-sm;

        h3 {
            @apply font-bold;
        }
    }

    form {
        @apply flex flex-col md:flex-row gap-4;
    }
</style>

<article>
	<div class="flex justify-between items-center">
		<h2 id="dblog-table">Dblogs</h2>
		<button onclick={download} disabled={loadingHTTP} class="ml-auto button button-primary button-inline">
			<span class="text-white">Export</span>
		</button>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<section class="filter-selector">
		<h3>Filter</h3>
		<form class="ingenium-form">
			<fieldset>
			</fieldset>
		</form>
	</section>

	<section class="bulk-operation">
		<h3>Apply</h3>

	</section>

	{#if (queryError !== null)}
		<div class="error-message p-4">
			{JSON.stringify(queryError)}
		</div>
	{/if}

	<section>
		<h3>Table</h3>
		<table class="ingenium-table">
			<thead>
			<tr>
				<th><h4>Select</h4> <input type="checkbox"/></th>
				<th><h4>Dblog ID</h4></th>
				<th><h4>Request</h4></th>
				<th><h4>Table</h4></th>
				<th><h4>Row Primary Key</h4></th>
				<th><h4>Edits</h4></th>
				<th><h4>Created</h4></th>
				<th><h4>Showing {dblogs.length} / {dblogCount}</h4></th>
			</tr>
			</thead>
			<tbody>
			{#each dblogs as dblog (dblog.log_id)}
				<tr>
					<th>
						<input type="checkbox"/>
					</th>
					<th>{dblog.log_id}</th>
					<td>{dblog.request_id.slice(0, 6)}</td>
					<td>{makePretty(dblog.table_name)}</td>
					<td>{dblog.row_primary_key}</td>
					<td>{dblog.dblog_fields_edited.length} edits</td>
					<td>
						{prettyDateTime(dblog.created_timestamp)}
					</td>
					<td>
						<button>
							<span>...</span>
						</button>
					</td>
				</tr>
			{/each}
			</tbody>
		</table>
	</section>
</article>