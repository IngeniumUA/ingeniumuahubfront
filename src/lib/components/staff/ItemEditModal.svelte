<script lang="ts">
	import Modal from '$lib/components/layout/modal.svelte';
	import { hexToRGB, makePretty } from '$lib/utilities/style-utilities';
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import type { RecSysPreviewI } from '$lib/models/RecSysI';
	import { toast } from '@zerodevx/svelte-toast';
	import { CoreItemWideAPI } from '$lib/core_api/core_api';
	import type { ItemWideI } from '$lib/models/item/itemwideI';
	import type { EventItemI } from '$lib/models/item/eventI';
	import type { DisplayCompositionI } from '$lib/models/item/displayCompositionI';
	import { handleRequest } from '$lib/utilities/httpUtilities';

	let { itemWide, isOpen = $bindable(false) }: { itemWide: ItemWideI, isOpen: boolean } = $props();

	let itemType: string = $derived(itemWide.derived_type.derived_type_enum);
	let loadingHTTP: boolean = $state(false);
	let itemUpdateError: string | null = $state(null);

	let hasDisplayMixin = ["eventitem", "promoitem", "shopitem"].includes(itemWide.derived_type.derived_type_enum);

	// Extract display object if applicable
	// Derived display optional
	// fixme the typecast at the moment is to EventItemI but that could probably be improved
	let display: DisplayCompositionI | null = hasDisplayMixin ? (itemWide.derived_type as EventItemI).display : null;

	let event: Pick<EventItemI, "event_start" | "event_end"> | null = itemWide.derived_type.derived_type_enum == "eventitem" ? (itemWide.derived_type as EventItemI): null;

	// Form fields as reactive state
	let form = $state({
		name: itemWide.item.name,
		description: itemWide.item.description,

		// Display mixin
		color: display?.color ?? "",
		clickThroughLink: display?.follow_through_link ?? "",
		externalLink: display?.follow_through_link.startsWith("http"),
		preview_description: display?.preview_description ?? "",
		image_landscape: display?.image_landscape ?? null,
		image_square: display?.image_square ?? null,

		// Event
		event_start: event?.event_start ?? null,
		event_end: event?.event_end ?? null,
	});

	/**
	 * Derived attribute reading for fields and creating a recsys component if the item allows it
	 */
	let recsysPreview = $derived.by(() => {
		if (!hasDisplayMixin) {return null}
		let recsysItem: RecSysPreviewI = {
			name: form.name,
			follow_through_link: form.externalLink ? form.clickThroughLink: `/${itemType.slice(0, itemType.length - 4)}/${form.name}`,
			date: null,
			color: 'rgb(255, 255, 255)',
			image_square: null,
			image_landscape: null,
			preview_description: null
		};
		recsysItem.color = hexToRGB(form.color) ?? form.color;
		recsysItem.preview_description = form.preview_description;
		if (itemType === "eventitem") {
			recsysItem.date = form.event_start;
		}
		return recsysItem;
	});

	/**
	 * We do all the checking again, now to construct the final object
	 * As for logic, we copy the Modal's input item and then edit the values depending on the item type
	 */
	function constructUpdateItem(): ItemWideI {
		// The easy part if fetching new values for the item
		let itemObj = itemWide.item;
		itemObj.name = form.name;
		itemObj.description = form.description;

		// But now the harder part :(
		// Start by assigning the initial item
		// Iterate a couple options for form update things
		let derivedObj = itemWide.derived_type;

		if (hasDisplayMixin) {
			(derivedObj as EventItemI).display = {
				color: form.color,
				preview_description: form.preview_description,
				follow_through_link: form.clickThroughLink,
				image_square: form.image_square,
				image_landscape: form.image_landscape,
			};
		}

		if (itemType === "eventitem") {
			// fixme event_start en event_end geen null strings lol da's een dirty workaround
			(derivedObj as EventItemI).event_start = form.event_start ?? "";
			(derivedObj as EventItemI).event_end = form.event_end ?? "";
		}

		return {
			item: itemObj,
			derived_type: derivedObj
		}
	}

	async function updateItem() {
		let itemwide = constructUpdateItem();

		loadingHTTP = true;
		try {
			await CoreItemWideAPI.putItem(itemWide.item.id, itemwide).catch(handleRequest);
			toast.push("Item updated!", {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(72,187,120,0.9)',
					'--toastBarBackground': '#2F855A'
				}
			})
		} catch (error) {
			toast.push(`Failed ${error}`, {
				theme: {
					'--toastColor': 'mistyrose',
					'--toastBackground': 'rgba(229, 62, 62, 0.9)', // red-600
					'--toastBarBackground': '#C53030' // red-700
				}
			});
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}
</script>


<Modal title="Item Bewerken" maxWidth="max-w-5xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<!-- Main body -->
		<form class="p-4 ingenium-form">
			<div class="flex flex-row gap-4 min-w-96">
				<div class="flex-1">
					<h3>Main Item</h3>
					<fieldset>
						<div class="form-field">
							<label for="name">Name</label>
							<input id="name" type="text" required bind:value={form.name}/>
							<p>Display naam</p>
						</div>
					</fieldset>

					<fieldset>
						<div class="form-field">
							<label for="description">Description</label>
							<input id="description" type="text" required bind:value={form.description}/>
							<p>Een beschrijving</p>
						</div>
					</fieldset>

					<!-- Specific Item fields-->
					<h3>{makePretty(itemType === null ? "": itemType)}</h3>
					{#if itemType === "eventitem"}
						<fieldset>
							<div class="form-field">
								<label for="event_start">Event Start</label>
								<input id="event_start" type="date" required bind:value={form.event_start}/>
								<p>Start datum evenement</p>
							</div>
							<div class="form-field">
								<label for="event_end">Event End</label>
								<input id="event_end" type="date" required bind:value={form.event_end}/>
								<p>Eind datum evenement</p>
							</div>
						</fieldset>
					{:else}
						<p>Itemtype {itemType} heeft geen extra data nodig</p>
					{/if}
				</div>

				<!-- Display Composition -->
				{#if (hasDisplayMixin)}
					<div class="flex-1">
						<h3>Display Composition</h3>
						<fieldset>
							<div class="form-field">
								<label for="vacatureColor">Color</label>
								<input id="vacatureColor" type="text" required bind:value={form.color}/>
								<p>Kleur voor de weergave</p>
							</div>
						</fieldset>
						<fieldset>
							<div class="form-field">
								<label for="clickThroughLink">Click Through Link</label>
								{#if (form.externalLink)}
									<input id="clickThroughLink" type="text" required bind:value={form.clickThroughLink}/>
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

				<!-- RecSys Preview -->
				{#if (recsysPreview !== null)}
					<div class="p-4 flex-1 min-w-96">
						<RecSysPreviewItem item={recsysPreview} />
					</div>
				{/if}
			</div>
		</form>

		<!-- Footer -->
		<div class="p-2 flex justify-between items-center border-t dark:border-gray-600 border-gray-200">
			<button class="button button-primary w-24 button-inline"
							disabled={loadingHTTP}
							onclick={updateItem}>
				<span class="text-white">Update</span>
			</button>

			<button class="button button-primary button-inline">
				<span class="text-white">Naar { makePretty(itemType) }</span>
			</button>
		</div>

		{#if (itemUpdateError !== null)}
			<div class="error-message p-4">
				{JSON.stringify(itemUpdateError)}
			</div>
		{/if}

	{/snippet}
</Modal>