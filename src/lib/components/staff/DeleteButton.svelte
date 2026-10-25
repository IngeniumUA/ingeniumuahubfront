<script lang="ts">

	let {
		loadingHTTP = $bindable(false), // with default
		deleteCallback,
		iconOnly,
		children
	}: {
		loadingHTTP: boolean,
		deleteCallback: () => void,
		iconOnly: boolean,
	} = $props();

	let buffer = $state(false)
	function bufferStep(e: MouseEvent) {
		e.stopPropagation(); // Prevent event bubbling if this button is inside a clickable row/card
		const isMobile = window.matchMedia('(max-width: 768px)').matches;

		if (isMobile) {
			// --- Mobile Flow ---
			if (confirm('Are you absolutely sure you want to delete this item? This cannot be undone.')) {
				deleteCallback();
			}
		} else {
			// --- Desktop Flow ---
			if (buffer) {
				deleteCallback();
				buffer = false;
			} else {
				buffer = true;
			}
		}
	}
</script>

<button class="button button-danger {iconOnly ? "button-icon-only": "button-inline"}"
				disabled={loadingHTTP}
				onclick={bufferStep}>
	{#if (buffer)}
		<p class="text-white">Are you sure?</p>
	{:else}
		{@render children?.()}
	{/if}
</button>