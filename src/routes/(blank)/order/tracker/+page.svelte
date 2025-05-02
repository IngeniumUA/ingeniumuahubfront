<script lang="ts">
	import ingeniumSchild from '$assets/svg/ingenium-schild.svg';
	import urenloopBanner from '$assets/images/12urenloop_2025_banner.jpg';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { captureException } from '@sentry/sveltekit';
	import { HubCheckoutTrackerStatusEnum, type PublicOrderTrackerI } from '$lib/models/trackerI';
	import { handleRequest } from '$lib/utilities/httpUtilities';

	let { data }: PageProps = $props();
	let trackerData = $state(data.trackerData) // Copy as our SSE will be changing the data
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
		setInterval(async () => {
			try {
				const data = await fetch(`${PUBLIC_API_URL}/order_tracking?salt=${(new Date()).getTime().toString()}`).then(handleRequest) as PublicOrderTrackerI[];
				trackerData = [...data];
			} catch (e) {
				console.error(e);
			}
		}, 5000);

		/*if (!browser || eventSource !== undefined) return;

		eventSource = new EventSource(`${PUBLIC_API_URL}/sse/checkout_tracking`);
		eventSource.addEventListener('open', () => {
			console.log('SSE connection opened');
		});
		eventSource.addEventListener('message', (event) => {
			try {
				const tracker = JSON.parse(event.data) as PublicOrderTrackerI;
				console.log(tracker);

				// If the order is done we need to remove it from the array
				console.log(tracker.checkout_tracker_status, HubCheckoutTrackerStatusEnum.Finished, tracker.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Finished);
				if (tracker.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Finished) {
					// Find the order in the array and remove it if found
					const orderIndex = trackerData.findIndex((order) => order.id === tracker.id);
					console.log("Removing order from trackerData: " + orderIndex);
					if (orderIndex !== -1) trackerData.splice(orderIndex, 1);
				}

				// If the order does not exist in the array we need to add it
				const orderIndex = trackerData.findIndex((order) => order.id === tracker.id);
				if (orderIndex === -1) {
					trackerData.push(tracker);
				} else {
					// If the order exists we need to update it
					trackerData[orderIndex].checkout_tracker_status = tracker.checkout_tracker_status;
				}
			} catch (e) {
				captureException(e);
				console.error(e);
			}
		});
		eventSource.addEventListener('error', (event) => {
			eventSource.close();
			console.error(event);
			captureException(event);
		})*/
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
	<main class="relative flex-auto overflow-auto">
		<div class="grid grid-cols-3 h-full">
			<!-- IN PROGRESS -->
			<ul class="grid grid-cols-5 text-3xl text-gray-800 text-center py-4 px-3 overflow-auto h-full auto-rows-min" aria-labelledby="inprogresstitle">
				{#each pendingOrders as order (order.id)}
					<li>{order.id}</li>
				{/each}
			</ul>

			<div class="relative col-span-2 grid grid-cols-5 text-3xl text-gray-800 text-center py-4 overflow-auto h-full border-l-4 border-blue-900 auto-rows-min" aria-labelledby="donetitle">
				<ul>
					{#each readyOrders as order (order.id)}
						<li>{order.id}</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="banner">
			<img src={urenloopBanner} alt="Urenloop banner" />
		</div>
	</main>
</div>

<style lang="scss">
	.banner {
		@apply absolute bottom-0;
		left: 50%;
		transform: translateX(-50%);

    img {
			max-height: 330px;
      @apply mx-auto block rounded-tl-lg;
    }
  }
</style>