<script lang="ts">
	let { children, data } = $props();

	let item = $state(data.item);
</script>

<style>
	div {
	}
</style>

<!-- Pop-up Z Custom Header -->
{@render children()}