<script lang="ts">
	import { CoreItemAPI } from '$lib/core_api/core_api';
	import type { ItemI } from '$lib/models/item/itemI';
	import { failedToast } from '$lib/components/toast/defined_toast';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let items: ItemI[] = $state(data.items);
	let itemCount: number = $state(data.itemCount);

	let httpLoading = $state(false);
	async function refresh() {
		if (httpLoading) return;
		httpLoading = true;
		const queryParam = new URLSearchParams({
			disabled: 'None',
			limit: '20'
		});
		items = await CoreItemAPI.queryItem(null, queryParam);
		itemCount = await CoreItemAPI.countItems(null, queryParam);
		httpLoading = false;
	}

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
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>Items</h1>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>
	<p>Totaal van {itemCount}</p>

	<table class="ingenium-table">
		<thead>
		<tr>
			<th>ID</th>
			<th>Name</th>
			<th>Available</th>
			<th>Disabled</th>
		</tr>
		</thead>
		<tbody>
		{#each items as item (item.id)}
			<tr>
				<th>
					<a href={`${item.id}#overview`}>{item.id}</a>
				</th>
				<td>
					{item.name}
				</td>
				<td>
					{item.availability.available ? "Available": "Not Available"}
				</td>
				<td>
					<button onclick={() => {restore(item.id)}} disabled={httpLoading}
									class="ml-2 button button-primary button-inline">
						<span class="text-white">Reenabled</span>
					</button>
				</td>
			</tr>
		{/each}
		</tbody>
	</table>
</main>