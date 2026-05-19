<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';

	let { children } = $props();

	// It's generally best to default to false (mobile-first) for the initial server render,
	let sidebar = $state(true);
	// But, if we then detect we're on a wide screen we can open the sidenav
	$effect(() => {
		sidebar = window.innerWidth >= 1024; // 1024 matching to tailwind lg:
	});
</script>

<header>
	<Header />
</header>

<div class="p-0 lg:p-2 h-full">
	<div class="flex flex-col md:flex-row h-full">
		<aside class={`shrink-0 transition-all duration-300
        ${sidebar ? 'w-full md:w-1/5 lg:w-1/6' : 'w-full md:w-10'}`}>

			<!-- Mobile toggle (visible only on mobile) -->
			<div class="flex items-center justify-start px-4 py-2 md:hidden">
				<button onclick={() => sidebar = !sidebar} aria-label="toggle-menu ml-auto">
					{#if sidebar}
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{:else}
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
						</svg>
					{/if}
				</button>
			</div>

			<!-- Desktop open button (only when closed) -->
			{#if !sidebar}
				<button onclick={() => sidebar = !sidebar} aria-label="toggle-menu"
								class="hidden md:flex items-center justify-center w-10 h-10 mt-4">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				</button>
			{/if}

			<!-- Nav: vertical collapse on mobile, horizontal on desktop -->
			<nav class={`vertical-nav vertical-nav-transparent overflow-hidden transition-all duration-300
          ${sidebar
            ? 'max-h-[1000px] opacity-100 px-4 py-6 md:max-h-none'
            : 'max-h-0 opacity-0 md:max-h-none md:opacity-0 md:w-0 md:px-0'
          }`}>
				<div>
					<a class="font-semibold" href="/staff/webmaster">Webmaster Home</a>
					<hr class="h-px bg-blue-900 border-0 dark:bg-blue-950">
					<a href="/staff/flag">Flags</a>
					<a href="/staff/logs">Logs</a>
					<a href="/staff/group">Groups</a>
					<a href="/staff/item">Items</a>
					<a href="/staff/payment">Payments</a>
					<a href="/staff/praesidium">Praesidium</a>
				</div>

				<div class="mt-16">
					<a class="font-semibold" href="/staff">Staff Home</a>
					<hr class="h-px bg-blue-900 border-0 dark:bg-blue-950">
					<a href="/staff/user">Users</a>
					<a href="/staff/item/event">Events</a>
					<a href="/orders/manage">Orders</a>
					<a href="/staff/item/shop">Shop</a>
					<a href="/staff/item/vacatures">Vacatures</a>
					<a href="/staff/lidkaarten">Lidkaarten</a>
				</div>

				<!-- Desktop close button (inside nav, only on desktop) -->
				<button class="button hidden md:flex mt-4" onclick={() => sidebar = !sidebar}>
					<span>close</span>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</nav>
		</aside>

		<main class="flex-1 min-w-0 md:mr-4">
			{@render children()}
		</main>
	</div>
</div>