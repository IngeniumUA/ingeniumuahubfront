<script lang="ts">
	import ingeniumSchild from '$assets/svg/ingenium-schild.svg';
	import type { PageProps } from './$types';
	import { HubCheckoutTrackerStatusEnum, type PublicOrderTrackerI } from '$lib/models/trackerI';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { captureException } from '@sentry/sveltekit';

	let { data }: PageProps = $props();
	const trackerData = $state(data.trackerData) // Copy as our SSE will be changing the data
	let eventSource: EventSource|undefined = undefined;

	const readyOrders = $derived.by(() => {
		if (!trackerData) return [];

		return trackerData.filter((order) => {
			return order.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Ready;
		});
	});

	const pendingOrders = $derived.by(() => {
		if (!trackerData) return [];

		return trackerData.filter((order) => {
			return order.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Pending;
		});
	});

	onMount(() => {
		if (!browser || eventSource !== undefined) return;

		eventSource = new EventSource(`${PUBLIC_API_URL}/sse/checkout_tracking`);
		eventSource.addEventListener('open', () => {
			console.log('SSE connection opened');
		});
		eventSource.addEventListener('message', (event) => {
			try {
				console.log(event.data);
				const tracker = JSON.parse(event.data) as PublicOrderTrackerI;
				console.log(tracker);

				// If the order is done we need to remove it from the array
				if (tracker.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Finished) {
					// Find the order in the array and remove it if found
					const orderIndex = trackerData.findIndex((order) => order.id === tracker.id);
					if (orderIndex !== -1) trackerData.splice(orderIndex, 1);
				}

				// If the order does not exist in the array we need to add it
				const orderIndex = trackerData.findIndex((order) => order.id === tracker.id);
				if (orderIndex === -1) {
					trackerData.push(tracker);
				} else {
					// If the order exists we need to update it
					trackerData[orderIndex] = tracker;
				}
			} catch (e) {
				captureException(e);
				console.error(e);
			}
		});
		eventSource.addEventListener('error', (event) => {
			eventSource.close();

			console.log(event.eventPhase)
			console.error(event);
			captureException(event);
		})
	});
</script>


<div class="flex flex-col h-screen">
	<header class="flex flex-col justify-center bg-gray-100" style="flex: 0 0 auto;">
		<img src={ingeniumSchild} alt="" class="max-h-40 my-4">

		<div class="grid grid-cols-3 w-full">
			<h2 id="inprogresstitle" class="uppercase p-4">We zijn er mee bezig</h2>
			<h2 id="donetitle" class="col-span-2 uppercase p-4 bg-blue-900 text-white rounded-tl-lg">Klaar om op te halen</h2>
		</div>
	</header>
	<main class="flex-auto overflow-auto">
		<div class="grid grid-cols-3 h-full">
			<!-- IN PROGRESS -->
			<ul class="grid grid-cols-5 text-3xl text-gray-800 text-center py-4 overflow-auto h-full auto-rows-min" aria-labelledby="inprogresstitle">
				{#each pendingOrders as order (order.id)}
					<li>{order.id}</li>
				{/each}
			</ul>

			<ul class="col-span-2 grid grid-cols-5 text-3xl text-gray-800 text-center py-4 overflow-auto h-full border-l-4 border-blue-900 auto-rows-min" aria-labelledby="donetitle">
				{#each readyOrders as order (order.id)}
					<li>{order.id}</li>
				{/each}
			</ul>
		</div>
	</main>
</div>

<style lang="scss">
</style>