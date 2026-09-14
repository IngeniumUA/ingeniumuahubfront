<script lang="ts">
	import ItemWideTable from '$lib/components/staff/item/ItemWideTable.svelte';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let items = $state(data.vacatures);
	let itemCount = $state(data.available_vacatures_count);

	let httpLoading = $state(false);
	const baseQueryParams = new URLSearchParams({
		'available': 'true',
		'disabled': 'false',
	})
</script>

<main class="ingenium-container relative" id="main-content">
	<h1>Vacatures</h1>
	<ItemWideTable
		bind:httpLoading={httpLoading}
		baseQueryParam={baseQueryParams}
		defaultViewMode={'list'}
		startItems={items}
		startItemCount={itemCount}
		forceItemType={"promoitem"}
		showDisabledColumns={false}
	></ItemWideTable>
</main>