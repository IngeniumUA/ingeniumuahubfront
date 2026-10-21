<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from '$lib/components/layout/modal.svelte';
	import type { OnkostenNotaI, OnkostenNotaWideI } from '$lib/models/onkosten/onkostennota';
	import { CoreOnkostenNotaAPI } from '$lib/core_api/onkostennota_api';

	let {
		isOpen = $bindable(false),
		onkostennota,
	}: {
		isOpen: boolean,
		onkostennota: OnkostenNotaI,
	} = $props();

	let onkostennotaWide: OnkostenNotaWideI | null = $state(null)

	async function refresh() {
		onkostennotaWide = await CoreOnkostenNotaAPI.getOnkostennota(null, onkostennota.volgnummer);
	}

	onMount(() => {
		refresh();
	});
</script>

<Modal title="Onkostennota afwerken" maxWidth="max-w-6xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<article class="m-4">
			<div class="flex flew-row gap-4">
				<form class="flex-1 ingenium-form">
					<div class="ingenium-description-component">

						<h3 class="font-bold pb-2">Overview</h3>
						{#if (onkostennotaWide !== null)}
							<pre class="text-xs text-ingenium-grey-900">{JSON.stringify(onkostennotaWide, null, 2)}</pre>
						{/if}
					</div>
				</form>
			</div>
		</article>
	{/snippet}
</Modal>