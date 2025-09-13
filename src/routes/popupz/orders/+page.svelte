<script lang="ts">
	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
</script>

<main class="bg-gray-100">
	<!-- Menu	-->
	<div class="p-6 min-h-36
						circle-arcs bg-blue-900 border-none">
		<h1 class="text-7xl text-white">{data.item.item.name}</h1>
		<div class="flex flex-row gap-8 items-center justify-center">
			<h1 class="text-3xl text-center underline text-white"><a href="menu">Our Menu</a></h1>
			<h1 class="text-3xl text-center underline text-white"><a href="orders">Volg Orders</a></h1>
		</div>
	</div>
</main>