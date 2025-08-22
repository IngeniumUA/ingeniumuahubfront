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
				<div>
					<a class="font-semibold" href="/webmaster">Webmaster Home</a>

					<hr class="h-px bg-blue-900 border-0 dark:bg-blue-950">
					<a href="/staff/flag">Flags</a>
					<a href="/staff/dashboard">Dashboard</a>
				</div>

				<div class="mt-16">
					<a class="font-semibold" href="/staff">Staff Home</a>

					<hr class="h-px bg-blue-900 border-0 dark:bg-blue-950">
					<a href="/staff/item/event">Events</a>
					<a href="/staff/vacatures">Vacatures</a>
					<a href="/staff/lidkaarten">Lidkaarten</a>
					<a href="/staff/item/notification">Email / App / SMS</a>

				</div>

			</nav>
		</aside>

		<main class="flex-1 max-w-full mx-4">
			{@render children()}
		</main>
	</div>
</div>

