<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';

	let { children } = $props();

	let sidebar = $state(true)
</script>

<header>
	<Header />
</header>

<style lang="scss">

</style>

<div class="p-0 lg:p-2 h-full">
	<div class="flex flex-col md:flex-row h-full">
		<aside class={`py-6 transition-all duration-300
									${sidebar ? 'px-4 sm:px-2 col-span-1 md:col-span-2 w-full md:w-1/4 lg:w-1/5' : 'w-6'}`}>
			{#if !sidebar}
			<button onclick={() => sidebar = !sidebar} aria-label="toggle-menu">
					<svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
			</button>
			{/if}

			<nav class={`vertical-nav vertical-nav-transparent
									transform transition-transform duration-300 ${sidebar ? 'translate-x-0' : '-translate-x-[18rem]'}`}>
				<div>
					<a class="font-semibold" href="/webmaster">Webmaster Home</a>
					<hr class="h-px bg-blue-900 border-0 dark:bg-blue-950">
					<a href="/staff/flag">Flags</a>
					<a href="/staff/logs">Logs</a>
					<a href="/staff/group">Groups</a>
					<a href="/staff/item">Items</a>
					<a href="/staff/payment">Payments</a>
				</div>

				<div class="mt-16">
					<a class="font-semibold" href="/staff">Staff Home</a>
					<hr class="h-px bg-blue-900 border-0 dark:bg-blue-950">
					<a href="/staff/dashboard">Dashboard</a>
					<a href="/staff/item/event">Events</a>
					<a href="/staff/item/shop">Shop</a>
					<a href="/staff/item/vacatures">Vacatures</a>
					<a href="/staff/lidkaarten">Lidkaarten</a>
					<a href="/staff/item/notification">Email / App / SMS</a>
				</div>
			</nav>

			{#if sidebar}
				<button class="button" onclick={() => sidebar = !sidebar}>
					<span>close</span>
					<svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</aside>

		<main class="flex-1 max-w-full md:mr-4">
			{@render children()}
		</main>
	</div>
</div>

