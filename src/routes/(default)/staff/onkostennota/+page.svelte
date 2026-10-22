<script lang="ts">
	import OnkostenNotaTable from '$lib/components/staff/onkosten/OnkostenNotaTable.svelte';
	import type { HubFlag } from '$lib/models/flag/HubFlagI';
	import FlagCard from '$lib/components/staff/FlagCard.svelte';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();

	let flag: HubFlag = $derived(data.flag)
</script>

<main class="ingenium-container relative" id="main-content">
	<h1>Quaestor Pagina</h1>

	<section class="ingenium-form-card mt-4">
		<section class="flex flex-col lg:flex-row">
			<div class="order-1 lg:flex-[1] lg:order-3">
				<h2>On this page</h2>
				<aside class="py-6 px-4 sm:px-2 col-span-1 md:col-span-2 w-full">
					<nav class="vertical-nav vertical-nav-transparent">
						<div>
							<a href="#settings" class="font-semibold">Settings</a>
							<a href="#onkostennota_table" class="font-semibold">Table</a>
						</div>
					</nav>
				</aside>
			</div>

			<div class="order-2 hidden lg:block w-px mx-4 bg-gray-200 "></div>

			<div class="order-3 lg:flex-[2] lg:order-1">
				<h2 id="settings">Instellingen</h2>
				<FlagCard hubFlag={flag}></FlagCard>
			</div>
		</section>
	</section>

	<section class="ingenium-form-card mt-4">
		<OnkostenNotaTable baseQueryParam={new URLSearchParams({ limit: '20', offset:'0' })}></OnkostenNotaTable>
	</section>
</main>