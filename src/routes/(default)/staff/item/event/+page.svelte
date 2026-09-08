<script lang="ts">
	import ItemWideTable from '$lib/components/staff/item/ItemWideTable.svelte';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let items = $state(data.events);
	let itemCount = $state(data.available_count);

	let httpLoading = $state(false);
	const baseQueryParams = new URLSearchParams({
		'available': 'true',
		'disabled': 'false',
	})
</script>

<main class="ingenium-container relative" id="main-content">
	<h1>Events</h1>
	<ItemWideTable
		bind:httpLoading={httpLoading}
		baseQueryParam={baseQueryParams}
		defaultViewMode={'list'}
		startItems={items}
		startItemCount={itemCount}
		forceItemType={"eventitem"}
		showDisabledColumns={false}
	></ItemWideTable>
</main>