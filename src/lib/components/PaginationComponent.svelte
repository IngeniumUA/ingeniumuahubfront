<script lang="ts">
	let {
		fetchedTotal = $bindable(0),
		currentOffset = $bindable(0),
		currentLimit = $bindable(20),
		maxTotal = $bindable(0),
		httpLoading = $bindable(false),
	}: {
		httpLoading: boolean
		fetchedTotal: number
		currentOffset: number
		currentLimit: number
		maxTotal: number
	} = $props();

	let maxPage = $derived(Math.ceil(maxTotal / currentLimit))

	function tick(tickValue: number) {
		currentOffset += tickValue;
		currentOffset = Math.min(currentOffset, maxPage-1);
		currentOffset = Math.max(currentOffset, 0);
	}
</script>

<style lang="scss">
  article {
    @apply m-0 p-0
	}
	div {
		@apply m-0 p-0 flex flex-row items-center justify-center;

		button {
      @apply px-1.5 py-1 border border-gray-200;
		}
		p {
			@apply text-nowrap normal-case m-0 px-2 border border-gray-200;
		}
	}
</style>

<article>
	<p class="text-ingenium-grey-700 normal-case text-center w-full">{fetchedTotal} out of {maxTotal}</p>
	<div>
		<button disabled={httpLoading} onclick={() => {tick(-1)}} class="border-l rounded-l-md">Prev</button>
		<p>Page {currentOffset + 1}/{maxPage}</p>
		<button disabled={httpLoading} onclick={() => {tick(1)}} class="border-r rounded-r-md">Next</button>
	</div>
</article>