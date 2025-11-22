<script lang="ts">
	import ItemWideTable from '$lib/components/staff/item/ItemWideTable.svelte';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let items = $state(data.items);
	let itemCount = $state(data.itemCount);

	let httpLoading = $state(false);
	const baseQueryParams = new URLSearchParams({
		'available': 'none',
		'disabled': 'None',
	})
</script>

<main class="ingenium-container relative" id="main-content">
	<h1>Items</h1>

	<ItemWideTable
		bind:httpLoading={httpLoading}
		baseQueryParam={baseQueryParams}
		defaultViewMode={'table'}
		startItems={items}
		startItemCount={itemCount}
	></ItemWideTable>
</main>