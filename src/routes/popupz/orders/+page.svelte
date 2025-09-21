<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';
	import { onDestroy, onMount } from 'svelte';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();

	let orders: [] = $state(data.orders)

	let pendingOrders = $derived(orders.filter(order => {return order["checkout_tracker_status"] == 1}))
	let finishedOrders = $derived(orders.filter(order => {return order["checkout_tracker_status"] == 2}))

	async function refresh() {
		const ordersRes = await fetch(`${PUBLIC_API_URL}/order_tracking`, {
			method: 'GET',
			headers: getAuthorizationHeaders(null,
				{ 'Content-Type': 'application/json',
					'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'}),
		});
		orders = ordersRes.ok ? await ordersRes.json(): [];
	}

	let interval: ReturnType<typeof setInterval>;
	onMount(() => {
		refresh();

		// Set interval to call every 5 seconds
		interval = setInterval(() => {
			refresh();
		}, 5000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
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

	<div class="orders-section">
		<section>
			<h2 class="text-blue-900 bg-ingenium-grey-200">We zijn er mee bezig!</h2>
			<ol class="border-ingenium-grey-200">
				{#each pendingOrders as order (order["id"])}
					<li>{order["id"]}</li>
				{/each}
			</ol>
		</section>

		<section>
				<h2 class="text-white bg-blue-900">Klaar om op te halen!</h2>
			<ol class="border-blue-900">
				{#each finishedOrders as order (order["id"])}
					<li>{order["id"]}</li>
				{/each}
			</ol>
		</section>
	</div>
</main>

<style>
	.orders-section {
			@apply flex flex-row mt-4 bg-ingenium-grey-200;

			section {
					@apply flex-[1];

					h2 {
							@apply p-4 pl-8 rounded-tl-3xl font-extrabold;
					}

					ol {
							@apply border-l-8 p-4 flex gap-4 bg-white h-screen;

							li {
									@apply text-blue-900 font-extrabold text-4xl;
							}
					}
			}
	}
</style>