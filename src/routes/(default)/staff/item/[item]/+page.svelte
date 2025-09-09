<script lang="ts">
	import type { ItemWideI } from '$lib/models/item/itemwideI';
	import { CoreItemAPI, CoreItemWideAPI } from '$lib/core_api/core_api';
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import { toRecsysPreview } from '$lib/models/RecSysI';
	import { handleRequest } from '$lib/utilities/httpUtilities';
	import { toast } from '@zerodevx/svelte-toast';
	import type { EventItemI } from '$lib/models/item/eventI';
	import type { DisplayCompositionI } from '$lib/models/item/displayCompositionI';
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
	import AddProductBlueprintModal from '$lib/components/staff/AddProductBlueprintModal.svelte';
	import ProductBlueprintCard from '$lib/components/staff/ProductBlueprintCard.svelte';
	import AvailabilityForm from '$lib/components/staff/AvailabilityForm.svelte';
	import { AccessPolicyEnum } from '$lib/models/access_policy/AccessPolicyI';
	
	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let itemWide: ItemWideI = $state(data.itemWide);
	let trackerCount: number = $state(data.trackerCount);

	const productBlueprintCapable: boolean = $derived(["eventitem", "shopitem"].includes(itemWide.derived_type.derived_type_enum));
	const interactionCapable: boolean = $derived(["eventitem", "shopitem", "linkitem"].includes(itemWide.derived_type.derived_type_enum));
	const hasDisplay: boolean = $derived(["eventitem", "shopitem", "promoitem"].includes(itemWide.derived_type.derived_type_enum));

	let productBlueprints = $state(data.productBlueprints);

	// fixme the typecast at the moment is to EventItemI but that could probably be improved
	let display: DisplayCompositionI | null = $derived(hasDisplay ? (itemWide.derived_type as EventItemI).display : null);

	// fixme we kunnen dit ook vinden door alle productBlueprints ff te doorlopen en te kijken of er config is
	let hasCheckoutTrackers = $state(data.trackerCount > 0);

	/**
	 * Refreshing all data on the page
	 */
	async function refresh() {
		console.log("refresh")
		itemWide = await CoreItemWideAPI.getItem(itemWide.item.id);
		trackerCount = await CoreItemAPI.countCheckoutTracker(itemWide.item.id);
		const query = new URLSearchParams({
			item: itemWide.item.id.toString(),
			limit: '100'
		});
		productBlueprints = await CoreProductBlueprintAPI.queryProductBlueprints(query);

		// Derived options
		hasCheckoutTrackers = trackerCount > 0;
	}

	/**
	 * Form as a reactive state
	 */
	let form = $derived({
		name: itemWide.item.name,
		description: itemWide.item.description,

		// Availability
		availability: {
			available: itemWide.item.availability.available,
			available_from: itemWide.item.availability.available_from,
			available_until: itemWide.item.availability.available_until,
			dynamic_policy_type: itemWide.item.availability.dynamic_policy_type ?? AccessPolicyEnum.always_available,
		},

		// Display mixin
		color: display?.color ?? "",
		clickThroughLink: '',
		externalLink: false,
		preview_description: display?.preview_description ?? "",
		image_landscape: display?.image_landscape ?? null,
		image_square: display?.image_square ?? null,

		// todo Event and other derived
	});

	let loadingHTTP: boolean = $state(false);

	/**
	 *
	 */
	async function toggleAvailable() {
		loadingHTTP = true;
		try {
			await CoreItemAPI.patchAvailable(itemWide.item.id, !itemWide.item.availability.available).catch(handleRequest);
			toast.push("Item updated!", {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(72,187,120,0.9)',
					'--toastBarBackground': '#2F855A'
				}
			})
			await refresh();
		} catch (error) {
			toast.push(`Failed ${error}`, {
				theme: {
					'--toastColor': 'mistyrose',
					'--toastBackground': 'rgba(229, 62, 62, 0.9)', // red-600
					'--toastBarBackground': '#C53030' // red-700
				}
			});
			await refresh()
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	/**
	 * Boolean state for add new product blueprint
	 * Adding effect to query blueprints when modal closes
	 */
	let showAddingNew = $state(false);
	$effect(() => {
		if (!showAddingNew) {
			// todo refresh
		}
	});
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1 id="{itemWide.item.name}">{itemWide.item.name}</h1>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<div class="alert alert-info mb-4 max-w-3xl">
		<p class="alert-text">Op deze pagina kan je <span class="italic">alles</span> over een item configureren.
		Volledige configuratie van het item en zijn velden zelf, alle producten, transacties en betalingen die er aan zijn gekoppeld en zelfs enkele dashboarden voor grafieken.<br>
		Gebruik de <span class="italic">'On this page'</span> hier rechts om snel je weg te vinden.</p>
	</div>

	<h2>Item Configuration</h2>
	<section class="flex flex-row">
		<form class="ingenium-form">
			<div class="ingenium-form-card">
				<h3 class="font-bold">Core Item</h3>
				<fieldset>
					<div class="form-field max-w-72 mb-2">
						<label for="itemName">Name</label>
						<input id="itemName" type="text" required bind:value={ form.name }/>
						<p>Display naam van de item.</p>
					</div>

					<label for="itemDescription">Description</label>
					<p>Beschrijving die wordt weergegeven op de pagina.</p>
					<div class="form-field min-h-72 flex">
						<textarea class="flex-1" id="itemDescription" required bind:value={ form.description }></textarea>
					</div>
				</fieldset>
			</div>

			<div class="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 auto-cols-fr">
			<div class="ingenium-form-card">
				<AvailabilityForm bind:formState={form.availability}></AvailabilityForm>
			</div>

			{#if hasDisplay}
				<div class="ingenium-form-card">
					<h3 class="font-bold">Display</h3>
					<fieldset>
						<div class="form-field">
							<label for="itemColor">Color</label>
							<input id="itemColor" type="text" required bind:value={form.color}/>
							<p>Kleur voor de weergave</p>
						</div>
					</fieldset>
					<fieldset>
						<div class="form-field">
							<label for="clickThroughLink">Click Through Link</label>
							{#if (form.externalLink)}
								<input id="clickThroughLink" type="text" required/>
							{/if}
							<p>Waar je naartoe wordt gestuurd als je op het item klikt.</p>
						</div>
					</fieldset>
					<label class="inline-flex items-center cursor-pointer">
						<input type="checkbox"
									 bind:checked={form.externalLink} class="hidden peer">
						<div class="relative w-11 h-6 bg-blue-900 dark:bg-gray-700 rounded-full
											peer-checked:bg-blue-900 dark:peer-checked:bg-blue-900
											after:content-['']
											after:absolute after:top-[2px] after:start-[2px]
											after:w-5 after:h-5
											after:bg-white after:rounded-full
											after:transition-transform
											peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
											"></div>
						<span class="ms-3 text-sm font-medium text-gray-600">{#if (form.externalLink)}Extern{:else}Item zelf{/if}</span>
					</label>

					<fieldset>
						<div class="form-field">
							<label for="preview_description">Preview Description</label>
							<input id="preview_description" type="text" required bind:value={form.preview_description}/>
							<p>Extra display beschrijving</p>
						</div>
					</fieldset>
				</div>
			{/if}
			</div>
		</form>

		<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

		<div class="w-1/3">
			<h2>On this page</h2>
			<aside class="py-6 px-4 sm:px-2 col-span-1 md:col-span-2 w-full">
				<nav class="vertical-nav vertical-nav-transparent">
					<div>
						<a href="#{itemWide.item.name}" class="font-semibold">Item</a>
						{#if hasDisplay}
							<a href="#item" class="font-semibold">Display</a>
						{/if}

						{#if productBlueprintCapable}
							<a href="#Transacties en betalingen" class="font-semibold">Payments</a>
							<a href="#Product Blueprints" class="font-semibold">Product Blueprints</a>
						{/if}
						{#if hasCheckoutTrackers}
							<a href="#Checkout Trackers" class="font-semibold">Checkout Trackers</a>
						{/if}
						{#if interactionCapable}
						<a href="#Interactions" class="font-semibold">Interactions</a>
						{/if}
					</div>
				</nav>
			</aside>
		{#if hasDisplay}
			<div class="flex-1 p-4 min-w-96"><RecSysPreviewItem item={toRecsysPreview(itemWide)} /></div>
		{/if}
		</div>
	</section>

	<div class="p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
		<h3 class="font-bold">Item Metadata</h3>
		<p>TODO 1: Metadata voor andere payment account (nodig voor biomedica site)</p>
		<p>TODO 2: Metadata voor FB / Instagram link</p>
	</div>

	<div class="flex justify-end mt-4 gap-4">
		<button class="button button-primary button-inline"
						disabled={loadingHTTP}>
			<span class="text-white">Update Item</span>
		</button>
	</div>

	{#if productBlueprintCapable}
		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
		<h2 id="Transacties en betalingen">Transacties en betalingen</h2>
		<div class="alert alert-info mb-4 max-w-3xl">
			<p class="alert-text">Een transactie is de 'aankoop' van een product door een gebruiker.
				Een Checkout is de daadwerkelijke betalingen daarvan.
				Er kunnen dus meerdere transacties (voor verschillende gebruikers) in één betaling zitten.</p>
		</div>
		<section class="flex">
			<div class="w-2/3">
				<h3 class="font-bold">Overview</h3>
				<p>TODO Transacties en checkouts als aantallen
					Grafiek ook? Doorheen de tijd
					Mis ook met de pageviews enzo hier?
					Toggle om de emails enzovoort te kunnen zien, maar enkel voor webmaster/manager
				</p>
			</div>

			<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

			<div class="w-1/3">
				<h3 class="font-bold">Summarised</h3>
				<p>Vanalle beschrijven statistieken. Totalen van transactions/checkouts enzo, maar ook unique users, totaal €, totaal € na fee's.
					Voor zo'n dingen best API calls doen naar de dpu?
				</p>
			</div>
		</section>

		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
		<div class="flex justify-between items-center mb-6">
			<h2 id="Product Blueprints">Product Blueprints</h2>
			<button onclick="{() => showAddingNew = true}" class="ml-2 button button-primary w-24 button-inline">
				<span class="text-white">Add New</span>
			</button>
		</div>

		<div class="alert alert-info mb-4 max-w-3xl">
			<p class="alert-text">Een <span class="font-bold">Product Blueprint</span> is een beschrijving van een <span class="font-bold">product</span>.
				Elk <span class="italic">uniek iets</span> heeft een eigen blueprint.
			<span class="font-bold">Price policies</span> laten je configureren hoe dat product kan worden aangekocht.</p>
		</div>

		{#if (productBlueprints.length > 0)}
		<section class="p-6 py-12 flex flex-wrap gap-6 bg-blue-950 dark:bg-blue-950 rounded-3xl">
			{#each productBlueprints as productBlueprint (productBlueprint.id)}
				<ProductBlueprintCard productBlueprint={productBlueprint}></ProductBlueprintCard>
			{/each}
		</section>
		{/if}

		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
		<h2 id="Checkout Trackers">Checkout Trackers</h2>
		<div class="alert alert-info mb-4 max-w-3xl">
			<p class="alert-text">Checkout Trackers zijn de 'ordertracking' van Pop-up Z. Er bestaat steeds één tracker per betaling.</p>
		</div>
		{#if hasCheckoutTrackers}
			<p>TODO Grafiekje en aantallen hier? Mis gwn dashboard embed?</p>
		{:else}
			<p>Geen Trackers</p>
		{/if}
	{/if}

	{#if interactionCapable}
		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
		<h2 id="Interactions">Interactions</h2>
		<div class="alert alert-info mb-4 max-w-3xl">
			<p class="alert-text">Interactions worden aangemaakt telkens wanneer een gebruiker 'iets doet' met een Item.
			Onder de mantel van 'iets doen' zit bijvoorbeeld een transactie.</p>
		</div>

		<p>TODO: Grafiekje en aantallen hier? Mis gwn dashboard embed?</p>
	{/if}

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<h2>Webmaster Info</h2>
	<p>TODO 1: Hier ergens nog de created_timetsamp en last_update_timestamp zetten</p>
	<p>TODO 2: DBLogs voor dit item</p>


	<div class="flex justify-end mt-4 gap-4">
		<button class="button button-danger button-inline"
						disabled={loadingHTTP}>
			<span class="text-white">Delete (wip)</span>
		</button>
	</div>
</main>

<AddProductBlueprintModal bind:isOpen={ showAddingNew } origin_item_id={itemWide.item.id}></AddProductBlueprintModal>
