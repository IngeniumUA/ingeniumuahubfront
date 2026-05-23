<script lang="ts">
	import { type HubCheckoutTrackerI, HubCheckoutTrackerStatusEnum } from '$lib/models/trackerI';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
	import type { ProductFormI, ProductOutI } from '$lib/models/productsI';
	import { onDestroy, onMount } from 'svelte';
	import { CoreFlagAPI } from '$lib/core_api/flag_api';
	import Header from '$lib/components/layout/header.svelte';

	let statusFilter: null | number = $state(null)
	let categoryFilter: null | string = $state(null)

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let orders: HubCheckoutTrackerI[] = $state(data.orders)

	function showOrder(order: HubCheckoutTrackerI): boolean {
		return (statusFilter === null ? true: order.checkout_tracker_status === statusFilter) &&
			(categoryFilter === null ? true: order.checkout.transactions.some(trans => {
				return trans.purchased_product.product_meta.categorie === categoryFilter;
			})) && !order.disabled;
	}

	let showOrders = $derived(orders.filter(value => {
		return showOrder(value)
	}))

	/**
	 * Refresh query
	 */
	async function refresh() {
		loadingHTTP = true
		const query_param = new URLSearchParams({
			limit: '100'
		})
		if (data.filterStatus !== null) query_param.set('checkout_tracker_status', data.filterStatus);
		try {
			orders = await CoreCheckoutAPI.queryCheckoutTracker(null, query_param);
		} catch (error) {
			console.log(error)
			orders = []
		} finally {
			loadingHTTP = false
		}
	}

	/**
	 * Display logic
	 */
	function parseForm(form: ProductFormI | null | undefined) {
		if (!form) return [];

		try {
			// If form is a string, parse it
			if (typeof form === "string") {
				return JSON.parse(form);
			}

			// If form is already an object, return it directly
			return form;
		} catch (error) {
			console.error("Failed to parse form:", error);
			return [];
		}
	}

	let loadingHTTP: boolean = $state(false)
	let stepError: Error | null = $state(null)
	async function setStatus(index: number, order: HubCheckoutTrackerI, nextStatus: HubCheckoutTrackerStatusEnum) {
		loadingHTTP = true;
		try {
			const returnOrder = await CoreCheckoutAPI.setCheckoutTracker(null, order.id, nextStatus);
			if (!showOrder(returnOrder)) {
				orders.splice(index, 1); // splice is *in place*
			} else {
				orders[index] = returnOrder
			}
			stepError = null;
		} catch (error) {
			stepError = error instanceof Error ? error : Error('Error submitting form');
		} finally {
			if (stepError === null) {
				successToast("Updated!")
			} else {
				failedToast(`Update Failed`)
			}
			loadingHTTP = false;
		}
	}

	/**
	 * Refreshing code
	 */
	let interval: ReturnType<typeof setInterval>;
	onMount(() => {
		refresh();

		// Set interval to call every 5 seconds
		interval = setInterval(() => {
			refresh();
		}, 10000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	/**
	 * Utility
	 */
	export function secondsSinceUtc(utcString: string) {
		const eventTime = new Date(utcString).getTime(); // UTC timestamp in ms
		const now = Date.now(); // Current local time in ms

		return Math.floor((now - eventTime) / 60000) - 120;
	}

	const colorPallete = [
		"#b23638",
		"#f3c5ff",
		"#ffc75f",
		"#00c899",
		"#2c73d2",
		"#936c00",
		"#4ffbdf",
	]
	function getColorForProduct(purchased_product: ProductOutI): string {
		const id = purchased_product.blueprint_id ?? 0;
		return colorPallete[id % colorPallete.length];
	}

	/**
	 *
	 */
	let publicCheckoutEnabled = $state(data.publicCheckoutEnabled)
	async function togglePublicCheckoutEnabled() {
		if (loadingHTTP) return;

		loadingHTTP = true;
		try {
			const patchObject = {
				value: !publicCheckoutEnabled,
				flag_value_type: 1
			}
			await CoreFlagAPI.patchFlag("popupz_shop_enabled", patchObject)
			successToast("Updated!")
		} catch (error) {
			failedToast(`Failed ${error}`);
			publicCheckoutEnabled = !publicCheckoutEnabled
			await refresh()
		}finally {
			loadingHTTP = false;
		}

	}

	/**
	 * Grouping count
	 */
	function groupedByProduct(orders: HubCheckoutTrackerI[]) {
		return orders.reduce<Record<string, number>>((acc, order) => {
			order.checkout.transactions.forEach(transaction => {
				const productName = transaction.product_blueprint_name;

				// Increment count for this product
				acc[productName] = (acc[productName] || 0) + 1;
			});
			return acc;
		}, {});
	}

	let nextFiveOrder = $derived(groupedByProduct(showOrders.slice(0, 5)))
	let summarisedOrders = $derived(groupedByProduct(showOrders))
</script>

<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Signika" />

<style>
	.config_section {
			@apply p-6 flex flex-col md:flex-row gap-2;

			div {
					@apply md:flex-[1];
			}
	}
</style>

<svelte:head>
	<title>Orders | Ingenium UA</title>
</svelte:head>

<header>
	<Header />
</header>

<main>
	<!-- Config Section -->
	<section class="config_section">
		<div>
			<h2>Filters</h2>
			<label class="inline-flex items-center cursor-pointer">
				<p>Online Bestellen</p>
				<input type="checkbox" class="sr-only peer" disabled={loadingHTTP}
							 bind:checked={publicCheckoutEnabled}
							 onclick="{() => togglePublicCheckoutEnabled()}"
				>
				<div class="
					ml-8
					relative w-11 h-6
					bg-red-900 dark:bg-red-900
					rounded-full
					peer-checked:bg-green-900 dark:peer-checked:bg-green-900
					after:content-['']
					after:absolute after:top-[2px] after:start-[2px]
					after:w-5 after:h-5
					after:bg-white after:rounded-full
					after:transition-transform
					peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
					"></div>
				<span class="hidden lg:inline ms-3 text-sm font-medium text-gray-600">{#if (publicCheckoutEnabled)}Aan{:else}Uit{/if}</span>
			</label>

			<div class="form-field max-w-72">
				<label for="status_filter">Filter voor status</label>
				<select id="status_filter" required bind:value={statusFilter}>
					{#each [null, 1, 2] as status}
						<option value={status}>{status === null ? "All": HubCheckoutTrackerStatusEnum[status] ?? "All"}</option>
					{/each}
				</select>
			</div>

			<div class="form-field max-w-72">
				<label for="category_filter">Filter voor categorie</label>
				<select id="category_filter" required bind:value={categoryFilter}>
					{#each [null, "Food", "Drinks"] as category}
						<option value={category}>{category ?? "All"}</option>
					{/each}
				</select>
			</div>
		</div>

		<div>
			<h2>Next Five Orders</h2>
			{#each Object.entries(nextFiveOrder) as [key, value]}
				<h3 class="text-ingenium-grey-800"><span class="font-bold">{key}</span>: {value}</h3>
			{/each}
		</div>

		<div>
			<h2>Upcoming Orders</h2>
			{#each Object.entries(summarisedOrders) as [key, value]}
				<h3 class="text-ingenium-grey-800"><span class="font-bold">{key}</span>: {value}</h3>
			{/each}
		</div>
	</section>

	<!-- Orders Section -->
	<section class="m-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
		{#if orders.length === 0}<h1>Geen Trackers</h1>{/if}
		{#each showOrders as order, index (order.id)}
			<article class="flex flex-col p-2 rounded-md border border-blue-900">
				<div class="flex flex-row gap-2">
					<span class="text-xl font-bold mr-auto">#{ order.order_counter }</span>
					{#each order.checkout.transactions as transaction}
					 <span
						 class="mt-2 w-7 h-7 rounded-full inline-block"
						 style="background-color: {getColorForProduct(transaction.purchased_product)};"
						 title={transaction.purchased_product.name}
					 ></span>
					{/each}
				</div>
					<ul class="list-disc list-inside space-y-1 my-2 flex-1">
						{#each order.checkout.transactions as transaction}
							<li>
								{ transaction.purchased_product.name }
								{#if transaction.purchased_product.product_meta.other_meta_data.form !== null}
									<ul class="ml-6 list-disc list-inside">
										{#each Object.entries(parseForm(transaction.purchased_product.product_meta.other_meta_data.form)) as [form_field_key, form_field_value]}
											<span class="capitalize font-light">{ form_field_key }</span>:
											<span class="font-bold">{ form_field_value.value ?? "" }</span>
										{/each}
									</ul>
								{/if}
							</li>
						{/each}
					</ul>
					<span class="text-center">{ order.checkout.user_email }</span>
					{#if order.checkout.note !== null && order.checkout.note !== '' }
						<span class="text-sm underline">Opmerking:</span>
						<span class="font-bold mb-4">{ order.checkout.note }</span>
					{/if}

				<div class="flex flex-row gap-4">
					<button
						type="button"
						disabled={loadingHTTP || order.checkout_tracker_status === 1}
						onclick={() => setStatus(index, order, order.checkout_tracker_status - 1)}
						class="button button-primary w-32 button-inline flex-[1]"
						style={order.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Ready ? 'button-danger': 'button-primary'}
					><span>Terug</span></button>

					<button
						type="button"
						onclick={() => setStatus(index, order, order.checkout_tracker_status + 1)} disabled={loadingHTTP}
						class="button button-primary w-32 button-inline flex-[1] {order.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Ready ? 'button-danger': 'button-primary'}"
					>
						{#if order.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Ready}
							Afgehaald
						{:else if order.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Pending}
							Klaar
						{:else if order.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Finished}
							Verwerkt
						{/if}
					</button>
				</div>
				<p class="text-right mt-2">{secondsSinceUtc(order.created_timestamp)}m geleden</p>
			</article>
		{/each}
	</section>
</main>