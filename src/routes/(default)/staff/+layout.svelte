<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';

	let { children } = $props();
</script>

<header>
	<Header />
</header>

<div class="ingenium-container ingenium-container--no-padding-y h-full">
	<div class="flex flex-col md:flex-row h-full">
		<aside class="py-6 px-4 sm:px-2 col-span-1 md:col-span-2 w-full md:w-1/4 lg:w-1/5">
			<nav class="vertical-nav vertical-nav-transparent">
				<a href="/staff">Staff Home</a>
				<a href="/staff/flag">Flags</a>
			</nav>
		</aside>

		<main class="flex-1 max-w-full mx-4 my-8">
			{@render children()}
		</main>
	</div>
</div>

