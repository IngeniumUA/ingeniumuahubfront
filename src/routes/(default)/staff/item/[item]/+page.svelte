<script lang="ts">
	import type { ItemWideI } from '$lib/models/item/itemwideI';
	import { CoreItemAPI, CoreItemWideAPI } from '$lib/core_api/core_api';
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import { toRecsysPreview } from '$lib/models/RecSysI';
	import type { EventItemI } from '$lib/models/item/eventI';
	import type { DisplayCompositionI } from '$lib/models/item/displayCompositionI';
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
	import AddProductBlueprintModal from '$lib/components/staff/AddProductBlueprintModal.svelte';
	import ProductBlueprintCard from '$lib/components/staff/ProductBlueprintCard.svelte';
	import AvailabilityForm from '$lib/components/staff/AvailabilityForm.svelte';
	import { AccessPolicyEnum } from '$lib/models/access_policy/AccessPolicyI';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { makePretty, prettyDate } from '$lib/utilities/style-utilities';
	import { PaymentStatusEnum } from '$lib/models/enums';
	import { hasRole } from '$lib/states/auth.svelte';
	
	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let itemWide: ItemWideI = $state(data.itemWide);
	let trackerCount: number = $state(data.trackerCount);
	let checkoutTrackerStatusGrouped = $state([])

	const productBlueprintCapable: boolean = $derived(["eventitem", "shopitem"].includes(itemWide.derived_type.derived_type_enum));
	const interactionCapable: boolean = $derived(["eventitem", "shopitem", "linkitem"].includes(itemWide.derived_type.derived_type_enum));
	const hasDisplay: boolean = $derived(["eventitem", "shopitem", "promoitem"].includes(itemWide.derived_type.derived_type_enum));

	let productBlueprints = $state(data.productBlueprints);
	let pricePolicyTable = $state(data.pricePoliciesTable);
	let checkoutStatusTable = $state(data.checkoutStatusTable);

	// fixme the typecast at the moment is to EventItemI but that could probably be improved
	let display: DisplayCompositionI | null = $derived(hasDisplay ? (itemWide.derived_type as EventItemI).display : null);

	let hasCheckoutTrackers = $derived(trackerCount > 0 || productBlueprints.some(prod => {
		return prod.product_blueprint_metadata.upon_completion?.track_checkout !== null;
	}));

	/**
	 * Refreshing functions
	 */
	async function refreshBlueprints() {
		const query = new URLSearchParams({
			item: itemWide.item.id.toString(),
			limit: '100'
		});
		productBlueprints = await CoreProductBlueprintAPI.queryProductBlueprints(null, query);
	}
	async function refresh() {
		itemWide = await CoreItemWideAPI.getItem(null, itemWide.item.id);
		trackerCount = await CoreItemAPI.countCheckoutTracker(null, itemWide.item.id);
		await refreshBlueprints()
		pricePolicyTable = await CoreItemAPI.attachedPricePolicyTable(null, itemWide.item.id);
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

		// Item metadata
		item_metadata: {
			payment_configuration: {
				connected_account_id: itemWide.item.item_metadata.payment_configuration?.stripe_payment_configuration?.["connected_account_id"] ?? null,
				application_fee_amount: itemWide.item.item_metadata.payment_configuration?.stripe_payment_configuration?.["application_fee_amount"] ?? null,
			},
			social_media_configuration: {
				facebook_url: itemWide.item.item_metadata.social_media_configuration?.facebook_url,
				instagram_url: itemWide.item.item_metadata.social_media_configuration?.instagram_url,
				linkedin_url: itemWide.item.item_metadata.social_media_configuration?.linkedin_url,
			}
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
	// async function toggleAvailable() {
	// 	loadingHTTP = true;
	// 	try {
	// 		await CoreItemAPI.patchAvailable(itemWide.item.id, !itemWide.item.availability.available).catch(handleRequest);
	// 		successToast("Item updated!")
	// 		await refresh();
	// 	} catch (error) {
	// 		failedToast(`Failed ${error}`);
	// 		await refresh()
	// 	} finally {
	// 		loadingHTTP = false; // Reset loading state
	// 	}
	// }
	
	let putError: Error | null = $state(null);
	async function putItem() {
		if (loadingHTTP) {return}
		// todo check for form errors

		const putItemWide = itemWide;
		putItemWide.item.name = form.name;
		putItemWide.item.description = form.description;
		putItemWide.item.availability.available = form.availability.available
		putItemWide.item.availability.available_from = form.availability.available_from
		putItemWide.item.availability.available_until = form.availability.available_until
		putItemWide.item.availability.dynamic_policy_type = form.availability.dynamic_policy_type

		// Payment configuration
		if (form.item_metadata.payment_configuration.connected_account_id !== null && form.item_metadata.payment_configuration.connected_account_id !== "") {
			putItemWide.item.item_metadata.payment_configuration = {
				stripe_payment_configuration: {
					connected_account_id: form.item_metadata.payment_configuration.connected_account_id,
					application_fee_amount: form.item_metadata.payment_configuration.application_fee_amount,
				}
			}
		} else {
			putItemWide.item.item_metadata.payment_configuration = {
				stripe_payment_configuration: {
					connected_account_id: null,
					application_fee_amount: null
				}
			};
		}

		// Social Media
		putItemWide.item.item_metadata.social_media_configuration = {
			facebook_url: form.item_metadata.social_media_configuration.facebook_url?.startsWith("https") ? form.item_metadata.social_media_configuration.facebook_url: null,
			instagram_url: form.item_metadata.social_media_configuration.instagram_url?.startsWith("https") ? form.item_metadata.social_media_configuration.instagram_url: null,
			linkedin_url: form.item_metadata.social_media_configuration.linkedin_url?.startsWith("https") ? form.item_metadata.social_media_configuration.linkedin_url: null
		}

		loadingHTTP = true;
		try {
			itemWide = await CoreItemWideAPI.putItem(putItemWide.item.id, putItemWide);
			putError = null;
		} catch (error) {
			putError = error instanceof Error ? error : Error('Error submitting form');
		} finally {
			if (putError === null) {
				successToast("Updated!")
			} else {
				failedToast(`Update Failed`)
			}
			loadingHTTP = false;
		}
	}

	/**
	 *
	 */
	interface PricePolicyGroupedMember {
		price_policy_id: number
		price_policy_name: string
		price_eu: number
		transaction_count: number
	}
	interface PricePolicyGrouped {
		product_blueprint_id: number,
		product_blueprint_name: string,
		transaction_count: number,
		price_policies: PricePolicyGroupedMember[]
	}

	/**
	 * Return table is not grouped by the product blueprint
	 * We quickly do that and return a sorted list with summed total transactions
	 * @param input_array
	 */
	function groupPricePolicies(input_array: []): PricePolicyGrouped[] {
		const groupedByBlueprint: Record<string, never[]> = Object.groupBy(input_array, value => value["product_blueprint_id"]);
		return Object.entries(groupedByBlueprint).map(([blueprint_id, policies]) => {
			return {
				product_blueprint_id: parseInt(blueprint_id),
				product_blueprint_name: input_array.find(value => {return value["product_blueprint_id"] === parseInt(blueprint_id)})!["product_blueprint_name"],
				transaction_count: policies.reduce((sum, row) => {
					return sum + row['transaction_count'];
				}, 0),
				price_policies: policies
			}
		})
	}

	/**
	 * Boolean state for add new product blueprint
	 * Adding effect to query blueprints when modal closes
	 * We need the prev value to prevent continuous loops
	 */
	let showAddingNew = $state(false);
	let prevShowAddingNew = false;
	$effect(() => {
		// So trigger on true->false transition
		if (!showAddingNew && prevShowAddingNew) {
			(async () => {
				await refresh();
			})();
		}
		// Setting the prev value to create the latching behavior
		prevShowAddingNew = showAddingNew;
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

	<h1>Item Configuration</h1>
	<form class="ingenium-form">
	<section class="flex flex-row">
		<div>
			<div class="ingenium-form-card">
				<h3 class="font-bold">Core Item</h3>
				<fieldset class="flex flex-row gap-4">
					<div class="flex-1 form-field max-w-72 mb-2">
						<label for="itemName">Name</label>
						<input id="itemName" type="text" required bind:value={ form.name }/>
						<p>Display naam van de item.</p>
					</div>

					<div class="flex-1">
						<h3 class="font-bold pb-2">Info</h3>
							{#each Object.entries({
								"Item Id": itemWide.item.id,
								"Last Update": prettyDate(itemWide.item.last_update_timestamp),
								"Created": prettyDate(itemWide.item.created_timestamp)}) as [fieldName, fieldValue]}
								<h4 class="pl-3 text-blue-900 font-bold">{fieldName}: <span class="text-ingenium-grey-800 font-bold">{fieldValue}</span></h4>
							{/each}
					</div>

				</fieldset>
				<fieldset>
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
		</div>

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
							<a href="#Dashboard" class="font-semibold">Transacties Dashboard</a>
							<a href="#Transacties en Betalingen" class="font-semibold">Betalingen & Transacties</a>
							<a href="#Product Blueprints" class="font-semibold">Product Blueprints</a>
						{/if}
						{#if hasCheckoutTrackers}
							<a href="#Checkout Trackers" class="font-semibold">Checkout Trackers</a>
						{/if}
						{#if interactionCapable}
						<a href="#Interactions" class="font-semibold">Interactions</a>
						{/if}

						{#if hasRole("webmaster")}
							<a href="#webmaster-info" class="font-semibold">Webmaster</a>
							<a href="#keycloak" class="font-semibold">Keycloak</a>
							<a href="#changelog" class="font-semibold">Changelog</a>
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

		<div class="flex flex-row gap-4">
			<fieldset class="flex-1">
				<h3 class="font-bold">Payment Configuration</h3>
				<div class="form-field">
					<label for="connected_account_id">Stripe Connected Account ID</label>
					<input id="connected_account_id" type="text" required bind:value={form.item_metadata.payment_configuration.connected_account_id}/>
					<p>Connected Account ID waar het geld naar moet doorvloeien. Je kan die opzoeken via Stripe.
						 Zie ook <a href="https://wiki.ingeniumua.be/nl/staff/webmaster/Stripe#Connected Account ID">wiki.ingeniumua.be/Stripe</a>.</p>
				</div>

				<div class="form-field">
					<label for="application_fee_amount">Fee</label>
					<input id="application_fee_amount" type="number" required bind:value={form.item_metadata.payment_configuration.application_fee_amount}/>
					<p>Of er een vaste Fee is die moet worden aangerekend.
						Zie ook <a href="https://wiki.ingeniumua.be/nl/staff/webmaster/Stripe#Connected Account ID">wiki.ingeniumua.be/Stripe</a>.</p>
				</div>
			</fieldset>

			<fieldset class="flex-1">
				<h3 class="font-bold">Social Media Configuration</h3>
				<div class="form-field">
					<label for="instagram_url">Instagram Link</label>
					<input id="instagram_url" type="text" required bind:value={form.item_metadata.social_media_configuration.instagram_url}/>
					<p>Deze link komt achter een instagram logo te staan op de item page.</p>
				</div>
				<div class="form-field">
					<label for="facebook_url">Facebook Link</label>
					<input id="facebook_url" type="text" required bind:value={form.item_metadata.social_media_configuration.facebook_url}/>
					<p>Deze link komt achter een Facebook logo te staan op de item page.</p>
				</div>
				<div class="form-field">
					<label for="linkedin_url">LinkedIn Link</label>
					<input id="linkedin_url" type="text" required bind:value={form.item_metadata.social_media_configuration.linkedin_url}/>
					<p>Deze link komt achter een LinkedIn logo te staan op de item page.</p>
				</div>
			</fieldset>
		</div>
	</div>
	</form>

	<div class="flex justify-end mt-4 gap-4">
		<button class="button button-primary button-inline"
						disabled={loadingHTTP}
						onclick={putItem}>
			<span class="text-white">Update Item</span>
		</button>
	</div>

	{#if productBlueprintCapable}
		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
		<h1 id="Dashboard">Dashboard</h1>
		<div class="alert alert-info mb-4 max-w-3xl">
			<p class="alert-text">Hieronder een overzicht van vanalle lopende statistieken verbonden aan de pagina!</p>
		</div>
		<section class="flex">
			<div class="w-2/3">
				<h2>Transacties</h2>
				<p>TODO: Transacties en validity hier?</p>

				<h2 class="font-bold">Betalingen</h2>
				<p>Het is normaal dat sommige betalingen falen. Een gefaalde betaling gebeurt bijvoorbeeld wanneer iemand een betaling start, maar niet genoed geld heeft. Of wanneer hij zijn bank app opent maar er daar iets fout gaat.</p>
				<div class="flex flex-row flex-wrap  gap-x-4">
					{#each Object.entries(checkoutStatusTable) as [status, count] (status)}
						<div class="p-4 min-w-24 min-h-12 rounded-lg shadow-md hover:shadow-lg transition-shadow">
							<h4 class="text-ingenium-grey-800 font-bold">{makePretty(PaymentStatusEnum[parseInt(status)])}: </h4>
							<p class="text-blue-900 font-bold"> {count}</p>
						</div>
					{/each}
				</div>

				<p>TODO Transacties en checkouts als aantallen
					Grafiek ook? Doorheen de tijd
					Mis ook met de pageviews enzo hier?
				</p>
			</div>

			<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

			<div class="w-1/3">
				<h2 class="font-bold">Voltooide Transacties</h2>
				{#each groupPricePolicies(pricePolicyTable) as row (row.product_blueprint_id)}
					<div class="flex justify-between items-center">
						<h3 class="text-blue-900 font-bold">{row.product_blueprint_name}</h3>
						<h4 class="text-ingenium-grey-800 text-right font-bold mr-4">Subtotaal: {row.transaction_count}</h4>
					</div>
					<table class="ingenium-table">
						<tbody>
						{#each row.price_policies as pricePolicyRow, pricePolicyIndex (pricePolicyRow.price_policy_id)}
							<tr>
								<th scope="row">
									<h4 class="text-ingenium-grey-800 font-bold">
										Price {pricePolicyIndex + 1}: {#if pricePolicyRow.price_policy_name !== null}{pricePolicyRow.price_policy_name} -{/if}
										{#if pricePolicyRow.price_eu === 0}Gratis{:else}€{pricePolicyRow.price_eu}{/if}
									</h4>
								</th>
								<td class="text-right">{pricePolicyRow.transaction_count}</td>
							</tr>
						{/each}
						</tbody>
					</table>
				{/each}
				<p class="text-right font-bold mr-4">Eind totaal: {pricePolicyTable.reduce((sum, val) => {
					return sum + val["transaction_count"]
				}, 0)}</p>
				<p>Vanalle beschrijven statistieken. Totalen van transactions/checkouts enzo, maar ook unique users, totaal €, totaal € na fee's.
					Voor zo'n dingen best API calls doen naar de dpu?
				</p>
			</div>
		</section>

		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
		<h1 id="Transacties en Betalingen">Betalingen & Transacties</h1>
		<div class="alert alert-info mb-4 max-w-3xl">
			<p class="alert-text">Een transactie is de 'aankoop' van een product door een gebruiker.
				Een Checkout is de daadwerkelijke betalingen daarvan.
				Er kunnen dus meerdere transacties (voor verschillende gebruikers) in één betaling zitten.</p>
		</div>

		<p>TODO: Aparte CheckoutTransactionRefundTable component</p>

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
		<h1 id="Checkout Trackers">Checkout Trackers</h1>
		<div class="alert alert-info mb-4 max-w-3xl">
			<p class="alert-text">Checkout Trackers zijn de 'ordertracking' van Pop-up Z. Er bestaat steeds één tracker per betaling.</p>
		</div>
		{#if hasCheckoutTrackers}
			<div class="flex flex-row gap-4">
				<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
					<h4 class="text-ingenium-grey-800 font-bold">Aantal Actieve:</h4>
					<p class="text-blue-900 font-bold">0</p>
				</div>
				<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
					<h4 class="text-ingenium-grey-800 font-bold">Aantal Voltooid:</h4>
					<p class="text-blue-900 font-bold">0</p>
				</div>
			</div>
			<div class="flex flex-row">
				{#each checkoutTrackerStatusGrouped as row (row["tracker_status"])}
					<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
						<h4 class="text-ingenium-grey-800 font-bold">Status</h4>
						<p class="text-blue-900 font-bold">Aantal in deze status</p>
					</div>
				{/each}
			</div>
			<p>Groupby per status van links naar rechts met pijlen tussen en aantallen.
			Kleur van de "done" moet groen zijn imo</p>
			<p>TODO Grafiekje hier? Dashboard embed best?</p>
		{/if}
	{/if}

	{#if interactionCapable}
		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
		<h1 id="Interactions">Interactions</h1>
		<div class="alert alert-info mb-4 max-w-3xl">
			<p class="alert-text">Interactions worden aangemaakt telkens wanneer een gebruiker 'iets doet' met een Item.
			Onder de mantel van 'iets doen' zit bijvoorbeeld een transactie.</p>
		</div>

		<p>TODO: Grafiekje en aantallen hier? Mis gwn dashboard embed?</p>
	{/if}


	{#if hasRole("webmaster")}
		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
		<h1 id="webmaster-info">Webmaster Info</h1>
		<h2 id="keycloak">Keycloak</h2>
		<p>TODO 1: Keycloak info voor dit item (met authorizatie opties)</p>

		<h2 id="changelog">Changelog</h2>
		<p>TODO 2: DBLogs voor dit item (als aparte component)</p>

		<div class="flex justify-end mt-4 gap-4">
			<button class="button button-danger button-inline"
							disabled={loadingHTTP}>
				<span class="text-white">Delete (wip)</span>
			</button>
		</div>
	{/if}
</main>

<AddProductBlueprintModal bind:isOpen={ showAddingNew } origin_item_id={itemWide.item.id}></AddProductBlueprintModal>
