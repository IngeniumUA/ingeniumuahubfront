<script lang="ts">
	import type { ItemWideI } from '$lib/models/item/itemwideI';
	import { CoreItemAPI, CoreItemWideAPI } from '$lib/core_api/core_api';
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import { toRecsysPreview } from '$lib/models/RecSysI';
	import type { EventItemI, LocationCompositionI } from '$lib/models/item/eventI';
	import type { DisplayCompositionI } from '$lib/models/item/displayCompositionI';
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
	import AddProductBlueprintModal from '$lib/components/staff/AddProductBlueprintModal.svelte';
	import ProductBlueprintCard from '$lib/components/staff/ProductBlueprintCard.svelte';
	import AvailabilityForm from '$lib/components/staff/AvailabilityForm.svelte';
	import { AccessPolicyEnum } from '$lib/models/access_policy/AccessPolicyI';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { makePretty, prettyDate } from '$lib/utilities/style-utilities';
	import { hasRole } from '$lib/states/auth.svelte';
	import PaymentTable from '$lib/components/staff/payment/PaymentTable.svelte';
	import Modal from '$lib/components/layout/modal.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';
	import DBLogTable from '$lib/components/staff/dblog/DBLogTable.svelte';
	import { ValidityEnum } from '$lib/models/enums';
	import { PaymentProviderEnum } from '$lib/models/productsI';
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
	
	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let itemWide: ItemWideI = $state(data.itemWide);
	let trackerCount: number = $state(data.trackerCount);
	let checkoutTrackerStatusGrouped = $state([])

	const productBlueprintCapable: boolean = $derived(["eventitem", "shopitem"].includes(itemWide.derived_type.derived_type_enum));
	const hasDisplay: boolean = $derived(["eventitem", "shopitem", "promoitem"].includes(itemWide.derived_type.derived_type_enum));
	const hasLocation: boolean = $derived(["eventitem"].includes(itemWide.derived_type.derived_type_enum));

	let productBlueprints = $state(data.productBlueprints);
	let pricePolicyTable = $state(data.pricePoliciesTable);
	let transactionValidityGrouped = $state(data.transactionValidityGrouped)

	// fixme the typecast at the moment is to EventItemI but that could probably be improved
	let display: DisplayCompositionI | null = $derived(hasDisplay ? (itemWide.derived_type as EventItemI).display : null);
	let location: LocationCompositionI | null = $derived(hasLocation ? (itemWide.derived_type as EventItemI).location : null);

	let hasCheckoutTrackers = $derived(trackerCount > 0 || productBlueprints.some(prod => {
		const trackCheckout = prod.product_blueprint_metadata.upon_completion?.track_checkout ?? null;
		return trackCheckout !== null || trackCheckout !== undefined;
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
		transactionValidityGrouped = await CoreItemAPI.attachedValidityGrouped(null, itemWide.item.id);
		await refreshBlueprints()
		pricePolicyTable = await CoreItemAPI.attachedPricePolicyTable(null, itemWide.item.id);
	}

	/**
	 * Form as a reactive state
	 */
	interface FormState {
		item: {
			name: string;
			description: string;
			availability: {
				available: boolean;
				available_from: string | null;
				available_until: string | null;
				dynamic_policy_type: AccessPolicyEnum | null
			};
			item_metadata: {
				payment_configuration: {
					connected_account_id: string | number | null,
					application_fee_amount: number | string | null,
				},
				social_media_configuration: {
					facebook_url: string | null,
					instagram_url: string | null,
					linkedin_url: string | null,
				}
			},
		}
		derived_type: {
			externalLink: boolean,
			display: Partial<DisplayCompositionI>
			location: Partial<LocationCompositionI>
		}
	}

	let form: FormState = $derived({
		item: {
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
					facebook_url: itemWide.item.item_metadata.social_media_configuration?.facebook_url ?? null,
					instagram_url: itemWide.item.item_metadata.social_media_configuration?.instagram_url ?? null,
					linkedin_url: itemWide.item.item_metadata.social_media_configuration?.linkedin_url ?? null,
				}
			},
		},
		derived_type: {
			externalLink: false,
			display: {
				// Display mixin
				color: display?.color ?? "",
				follow_through_link: '',
				externalLink: false,
				preview_description: display?.preview_description ?? "",
				image_landscape: display?.image_landscape ?? null,
				image_square: display?.image_square ?? null,
			},
			// Location mixin
			location: {
				location_display_name: location?.location_display_name ?? null,
				location_search_name: location?.location_search_name ?? null,
				latitude: location?.latitude ?? null,
				longitude: location?.longitude ?? null,
			}
		}
	});

	let loadingHTTP: boolean = $state(false);

	/**
	 *
	 */
	function assembleDerivedItem() {
		let derivedItem = itemWide.derived_type;
		const itemType = derivedItem.derived_type_enum
		const externalLink = (derivedItem as EventItemI).display.follow_through_link.includes('http')
		const internalLink = `/${itemType.slice(0, itemType.length - 4)}/${form.item.name}`

		if (hasDisplay) {
			(derivedItem as EventItemI).display.image_square = form.derived_type.display.image_square === "" ? null: form.derived_type.display.image_square ?? null;
			(derivedItem as EventItemI).display.image_landscape = form.derived_type.display.image_landscape === "" ? null: form.derived_type.display.image_landscape ?? null;
			(derivedItem as EventItemI).display.color = form.derived_type.display.color === "" ? "#FFF": form.derived_type.display.color ?? "#FFF";
			(derivedItem as EventItemI).display.preview_description = form.derived_type.display.preview_description === "" ? "": form.derived_type.display.preview_description ?? "";
			(derivedItem as EventItemI).display.follow_through_link = externalLink ? form.derived_type.display.follow_through_link ?? internalLink: internalLink
		}
		return derivedItem
	}

	let putError: Error | null = $state(null);
	async function putItem() {
		if (loadingHTTP) {return}
		// todo check for form errors
		let putItemWide = structuredClone($state.snapshot(itemWide));
		putItemWide.derived_type = assembleDerivedItem()

		putItemWide.item.name = form.item.name;
		putItemWide.item.description = form.item.description;
		putItemWide.item.availability.available = form.item.availability.available
		putItemWide.item.availability.available_from = form.item.availability.available_from
		putItemWide.item.availability.available_until = form.item.availability.available_until
		putItemWide.item.availability.dynamic_policy_type = form.item.availability.dynamic_policy_type

		// Payment configuration
		if (form.item.item_metadata.payment_configuration.connected_account_id !== null && form.item.item_metadata.payment_configuration.connected_account_id !== "") {
			putItemWide.item.item_metadata.payment_configuration = {
				stripe_payment_configuration: {
					connected_account_id: form.item.item_metadata.payment_configuration.connected_account_id,
					application_fee_amount: form.item.item_metadata.payment_configuration.application_fee_amount,
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
			facebook_url: form.item.item_metadata.social_media_configuration.facebook_url?.startsWith("https") ? form.item.item_metadata.social_media_configuration.facebook_url: null,
			instagram_url: form.item.item_metadata.social_media_configuration.instagram_url?.startsWith("https") ? form.item.item_metadata.social_media_configuration.instagram_url: null,
			linkedin_url: form.item.item_metadata.social_media_configuration.linkedin_url?.startsWith("https") ? form.item.item_metadata.social_media_configuration.linkedin_url: null
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

	/**
	 * Bulk importing state and functions
	 */
	let showBulkImport: boolean = $state(false);
	let files: FileList | undefined = $state()
	let uploadError: Error | null = $state(null);

	async function handleUpload() {
		if (loadingHTTP) return;
		loadingHTTP = true;
		if (files === undefined) return;

		try {
			const formData = new FormData();
			formData.append('file', files[0]);
			const res = await fetch(`${PUBLIC_API_URL}/blueprint/import`, {
				method: 'POST',
				headers: getAuthorizationHeaders(null),
				body: formData
			});
			if (res.ok) {
				showBulkImport = false;
				successToast("Imported!")
				return res.json();
			} else {
				const text = await res.text();
				uploadError = new Error(`Failed to Upload: ${text}`);
			}
		} catch (error) {
			uploadError = error instanceof Error ? error : Error(`Error during Upload: ${error}`);
		} finally {
			loadingHTTP = false;
		}
	}

	/**
	 * Special state (showing modal) and query for profit calculation
	 */
	let profitError: Error | null = $state(null)
	let profitStruct: { [s: string]: number; } | null = $state(null)
	let showProfitModal = $state(false)
	async function calculateProfit() {
		if (loadingHTTP) return;
		showProfitModal = true;

		const queryParam = new URLSearchParams({
			'payment_provider': PaymentProviderEnum.Stripe.toString(),
			'from_created_timestamp': itemWide.item.created_timestamp,
			'until_created_timestamp': new Date().toISOString(),
			'item_id': itemWide.item.id.toString()
		});

		loadingHTTP = true;
		try {
			profitStruct = await CoreCheckoutAPI.analyseBreakdown(null, queryParam);
			profitError = null;
		} catch (error) {
			profitError = error instanceof Error ? error : Error('Error fetching profit');
		} finally {
			loadingHTTP = false;
		}
	}
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
	<section class="flex flex-col lg:flex-row">
		<div class="order-1 lg:flex-[1] lg:order-3">
			<h2>On this page</h2>
			<aside class="py-6 px-4 sm:px-2 col-span-1 md:col-span-2 w-full">
				<nav class="vertical-nav vertical-nav-transparent">
					<div>
						<a href="#{itemWide.item.name}" class="font-semibold">Item</a>
						{#if hasDisplay}
							<a href="#item" class="font-semibold">Display</a>
						{/if}

						{#if productBlueprintCapable}
							<a href="#Dashboard" class="font-semibold">Dashboard</a>
							<a href="#Transacties en Betalingen" class="font-semibold">Betalingen & Transacties</a>
							<a href="#Product Blueprints" class="font-semibold">Product Blueprints</a>
						{/if}
						{#if hasCheckoutTrackers}
							<a href="#Checkout Trackers" class="font-semibold">Checkout Trackers</a>
						{/if}

						<a href="#traffic" class="font-semibold">Traffic</a>

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

		<div class="order-2 hidden lg:block w-px mx-4 bg-gray-200 "></div>

		<div class="order-3 lg:flex-[2] lg:order-1">
			<div class="ingenium-form-card">
				<h3 class="font-bold">Core Item</h3>
				<fieldset class="flex flex-row gap-4">
					<div class="flex-1 form-field max-w-72 mb-2">
						<label for="itemName">Name</label>
						<input id="itemName" type="text" required bind:value={ form.item.name }/>
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
						<textarea class="flex-1" id="itemDescription" required bind:value={ form.item.description }></textarea>
					</div>
				</fieldset>
			</div>

			<div class="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 auto-cols-fr">
			<div class="ingenium-form-card">
				<AvailabilityForm bind:formState={form.item.availability}></AvailabilityForm>
			</div>

			{#if hasDisplay}
				<div class="ingenium-form-card">
					<h3 class="font-bold">Display</h3>
					<fieldset>
						<div class="form-field">
							<label for="itemColor">Color</label>
							<input id="itemColor" type="text" required bind:value={form.derived_type.display.color}/>
							<p>Kleur voor de weergave</p>
						</div>
					</fieldset>
					<fieldset>
						<div class="form-field">
							<label for="clickThroughLink">Click Through Link</label>
							{#if (form.derived_type.externalLink)}
								<input id="clickThroughLink" type="text" required/>
							{/if}
							<p>Waar je naartoe wordt gestuurd als je op het item klikt.</p>
						</div>
					</fieldset>
					<label class="inline-flex items-center cursor-pointer">
						<input type="checkbox"
									 bind:checked={form.derived_type.externalLink} class="hidden peer">
						<div class="relative w-11 h-6 bg-blue-900 dark:bg-gray-700 rounded-full
											peer-checked:bg-blue-900 dark:peer-checked:bg-blue-900
											after:content-['']
											after:absolute after:top-[2px] after:start-[2px]
											after:w-5 after:h-5
											after:bg-white after:rounded-full
											after:transition-transform
											peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
											"></div>
						<span class="ms-3 text-sm font-medium text-gray-600">{#if (form.derived_type.display.follow_through_link)}Extern{:else}Item zelf{/if}</span>
					</label>

					<fieldset>
						<div class="form-field">
							<label for="preview_description">Preview Description</label>
							<input id="preview_description" type="text" required bind:value={form.derived_type.display.preview_description}/>
							<p>Extra display beschrijving</p>
						</div>
					</fieldset>

					<fieldset>
						<div class="form-field">
							<label for="image_landscape">Image Landscape</label>
							<input id="image_landscape" type="text" required bind:value={form.derived_type.display.image_landscape}/>
							<p>Landscape Image :)</p>
						</div>
						<div class="form-field">
							<label for="image_square">Image Square</label>
							<input id="image_square" type="text" required bind:value={form.derived_type.display.image_square}/>
							<p>Square Image :)</p>
						</div>
					</fieldset>
				</div>
			{/if}
			</div>
		</div>
	</section>

	<div class="p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
		<h3 class="font-bold">Item Metadata</h3>

		<div class="flex flex-col md:flex-row gap-4">
			{#if hasLocation}
				<fieldset class="flex-1">
					<h3 class="font-bold">Location</h3>
					<p>{form.derived_type.location.location_display_name}</p>
					<p>{form.derived_type.location.location_search_name}</p>
					<p>{form.derived_type.location.longitude}</p>
					<p>{form.derived_type.location.latitude}</p>
				</fieldset>
			{/if}

			<fieldset class="flex-1">
				<h3 class="font-bold">Payment Configuration</h3>
				<div class="form-field">
					<label for="connected_account_id">Stripe Connected Account ID</label>
					<input id="connected_account_id" type="text" required bind:value={form.item.item_metadata.payment_configuration.connected_account_id}/>
					<p>Connected Account ID waar het geld naar moet doorvloeien. Je kan die opzoeken via Stripe.
						 Zie ook <a href="https://wiki.ingeniumua.be/nl/staff/webmaster/Stripe#Connected Account ID">wiki.ingeniumua.be/Stripe</a>.</p>
				</div>

				<div class="form-field">
					<label for="application_fee_amount">Fee</label>
					<input id="application_fee_amount" type="number" required bind:value={form.item.item_metadata.payment_configuration.application_fee_amount}/>
					<p>Of er een vaste Fee is die moet worden aangerekend.
						Zie ook <a href="https://wiki.ingeniumua.be/nl/staff/webmaster/Stripe#Connected Account ID">wiki.ingeniumua.be/Stripe</a>.</p>
				</div>
			</fieldset>

			<fieldset class="flex-1">
				<h3 class="font-bold">Social Media Configuration</h3>
				<div class="form-field">
					<label for="instagram_url">Instagram Link</label>
					<input id="instagram_url" type="text" required bind:value={form.item.item_metadata.social_media_configuration.instagram_url}/>
					<p>Deze link komt achter een instagram logo te staan op de item page.</p>
				</div>
				<div class="form-field">
					<label for="facebook_url">Facebook Link</label>
					<input id="facebook_url" type="text" required bind:value={form.item.item_metadata.social_media_configuration.facebook_url}/>
					<p>Deze link komt achter een Facebook logo te staan op de item page.</p>
				</div>
				<div class="form-field">
					<label for="linkedin_url">LinkedIn Link</label>
					<input id="linkedin_url" type="text" required bind:value={form.item.item_metadata.social_media_configuration.linkedin_url}/>
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

		<article class={`my-4 py-2 ${profitStruct !== null ? 'rounded-lg shadow-md hover:shadow-lg transition-shadow': ''}`}>
			{#if (profitStruct !== null)}
				<h3>Profit Analysis</h3>

				<p class="font-bold">
					Inkomsten: {profitStruct?.amount}<br>
					Transactiekosten: {profitStruct?.fee}<br>
					Winst: {profitStruct?.net}<br>
				</p>

				<p class="font-bold">
					Checkout Count: {profitStruct?.checkout_count}<br>
					Charge Count: {profitStruct?.charge_count}<br>
					Als deze twee getallen niet overeen komen is het bedrag waarschijnlijk ook niet juist.
				</p>
			{/if}

			<button class="button button-primary" onclick={calculateProfit}>Profit</button>
		</article>

		<section class="flex flex-col lg:flex-row gap-4">
			<div class="order-1 lg:flex-[2]">
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
				<p class="text-right font-bold mr-4">
					{#if (profitStruct !== null)}Winst: {profitStruct["net"]} &nbsp &nbsp &nbsp {/if}
					Inkomsten: €{pricePolicyTable.reduce((sum, val) => {
					return sum + val["transaction_count"] * val["price_eu"]
				}, 0)} &nbsp &nbsp &nbsp Eind totaal: {pricePolicyTable.reduce((sum, val) => {
					return sum + val["transaction_count"]
				}, 0)}</p>

				<p>TODO Transacties en checkouts als aantallen
					Grafiek ook? Doorheen de tijd
					Mis ook met de pageviews enzo hier?
				</p>
			</div>

			<div class="order-2 hidden md:block w-px mx-4 bg-gray-200"></div>

			<div class="order-3 lg:flex-[1]">
				<h2 class="font-bold">Extra</h2>
				<table class="ingenium-table">
					<thead>
					<tr>
						<th scope="col"><h4>Validity</h4></th>
						<th scope="col"><h4>Aantal</h4></th>
					</tr>
					</thead>
					<tbody>
					{#each Object.entries(transactionValidityGrouped) as validityPair}
						<tr>
							<th scope="row">
								{makePretty(ValidityEnum[parseInt(validityPair[0])])}
							</th>
							<td>
								{validityPair[1]}
							</td>
						</tr>
					{/each}
					</tbody>
				</table>

				<p>TODO: Vanalle extra beschrijven statistieken. Unique users, totaal €, totaal € na fee's.
					Voor zo'n dingen best API calls doen naar de dpu? -> Of gwn op core houden .. zonder polars gaat da best nog wel
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
		<PaymentTable baseQueryParam={new URLSearchParams({item_id: `${itemWide.item.id}`, limit: '20'})} baseSelectedTable="transacties"></PaymentTable>

		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
		<div class="flex justify-between items-center mb-6">
			<h1 id="Product Blueprints">Product Blueprints</h1>
			<button class="ml-auto button button-primary w-24 button-inline" onclick={() => {showBulkImport = true}}>
				<span class="text-white">Import</span>
			</button>
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
		<section class="flex flex-wrap gap-6">
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

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<h1 id="traffic">Traffic</h1>
	<div class="alert alert-info mb-4 max-w-3xl">
		<p class="alert-text">Met Umami houden we analytics bij over wie er onze site bezoekt.
			Die gegevens kan je rechstreeks <a href="https://traffic.ingeniumua.be">op umami bekijken</a>.
			Hieronder enkele cijfers opgehaald uit umami.</p>
	</div>
	<p>TODO: https://umami.is/docs/api/website-stats#get-apiwebsiteswebsiteidstats</p>

	{#if hasRole("webmaster")}
		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
		<h1 id="webmaster-info">Webmaster Info</h1>
		<h2 id="keycloak">Keycloak</h2>
		<p>TODO 1: Keycloak info voor dit item (met authorizatie opties)</p>

		<h2 id="changelog">Changelog</h2>
		<DBLogTable baseQueryParam={new URLSearchParams({table_name: 'hubitem', row_primary_key: itemWide.item.id.toString()})}></DBLogTable>

		<div class="flex justify-end mt-4 gap-4">
			<button class="button button-danger button-inline"
							disabled={loadingHTTP}>
				<span class="text-white">Delete (wip)</span>
			</button>
		</div>
	{/if}
</main>

<AddProductBlueprintModal bind:isOpen={ showAddingNew } origin_item_id={itemWide.item.id}></AddProductBlueprintModal>

<Modal title="Bulk Import" maxWidth="max-w-xl" bind:isOpen={ showBulkImport } closable={ true }>
	{#snippet children()}
		<article class="m-4">
			<label for="file">Upload Product Blueprints</label>
			<input accept="text/csv" bind:files id="file" name="avatar" type="file" />

			{#each Array.from(files ?? []) as file}
				<p>{file.name} ({file.size} bytes)</p>
			{/each}

			<div class="p-2 flex justify-end items-center">
				<button type="button" class="button button-primary w-24 button-inline"
								disabled={loadingHTTP || files === undefined}
								onclick={handleUpload}>
					<span class="text-white">Upload</span>
				</button>
			</div>

			{#if uploadError !== null}
				{uploadError.message}
			{/if}
		</article>
	{/snippet}
</Modal>

<Modal title="Profit analysis" maxWidth="max-w-xl" bind:isOpen={ showProfitModal } closable={ true }>
	{#snippet children()}
		<article class="m-4">
			<div class="alert alert-info mb-4 max-w-3xl">
				<p class="alert-text">Berekening van de fee is niet super eenvoudig om efficient te doen. Als je het exacte getal wilt best op stripe zelf kijken.</p>
			</div>

			<p class="font-bold">
				Inkomsten: {profitStruct?.amount}<br>
				Transactiekosten: {profitStruct?.fee}<br>
				Winst: {profitStruct?.net}<br>
			</p>

			<p class="font-bold">
				Checkout Count: {profitStruct?.checkout_count}<br>
				Charge Count: {profitStruct?.charge_count}<br>
				Als deze twee getallen niet overeen komen is het bedrag waarschijnlijk ook niet juist.
			</p>

			<div class="p-2 flex justify-end items-center">
				<button type="button" class="button button-primary w-24 button-inline"
								disabled={loadingHTTP}
								onclick={handleUpload}>
					<span class="text-white">Refresh</span>
				</button>
			</div>

			{#if profitError !== null}
				{profitError.message}
			{/if}
		</article>
	{/snippet}
</Modal>