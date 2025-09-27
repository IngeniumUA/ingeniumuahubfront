<script lang="ts">
	import Modal from "$lib/components/layout/modal.svelte";
	import { hexToRGB, makePretty } from '$lib/utilities/style-utilities';
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import type { RecSysPreviewI } from "$lib/models/RecSysI";
	import { toast } from '@zerodevx/svelte-toast'
	import { CoreItemWideAPI } from '$lib/core_api/core_api';
	import { PromoItemTypeEnum, PromoItemTypes } from '$lib/models/item/promoI';
	import { successToast } from '$lib/components/toast/defined_toast';

	let { itemType = null, isOpen = $bindable(false) }: { itemType: string | null, isOpen: boolean } = $props();

	let loadingHTTP: boolean = $state(false);
	let itemCreateError: string | null = $state(null);

	let hasDisplayMixin = $derived(["eventitem", "promoitem", "shopitem"].includes(itemType === null ? "": itemType));

	// Form fields as reactive state
	let form = $state({
		name: '',
		description: '',
		color: "#1f2980",
		clickThroughLink: '',
		externalLink: false,
		preview_description: null,
		image_landscape: null,
		image_square: null,
		event_start: null,
		event_end: null,
		promo_type: PromoItemTypes[0]
	});

	/**
	 * Derived attribute reading for fields and creating a recsys component if the item allows it
	 */
	let recsysPreview = $derived.by(() => {
		if (!hasDisplayMixin) {return null}
		let recsysItem: RecSysPreviewI = {
			name: form.name,
			follow_through_link: form.externalLink ? form.clickThroughLink: `/${itemType === null ? "item": itemType.slice(0, itemType.length - 4)}/${form.name}`,
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

	async function createItem() {
		// todo check for form errors

		// Constructing item first
		const item = {
			name: form.name,
			description: form.description,
			availability: null
		}

		// Derived item is a cascade of optional edits
		// Might become its own method?
		let derived_item = {
			derived_type_enum: itemType,
			display: {},
		};
		if (hasDisplayMixin) {
			derived_item["display"] = {
				color: form.color,
				follow_through_link: form.externalLink ? form.clickThroughLink : `/${itemType === null ? "item": itemType.slice(0, itemType.length - 4)}/${form.name}`,
				image_square: form.image_square,
				image_landscape: form.image_landscape,
				preview_description: form.preview_description
			}
		}

		// Specific fields
		if (itemType === "eventitem") {
			const event_specific = {
				event_end: form.event_end,
				event_start: form.event_start,
			}
			derived_item = { ...derived_item, ...event_specific}
		} else if (itemType === "promoitem") {
			const promo_specific = {
				promo_type: form.promo_type
			}
			derived_item = { ...derived_item, ...promo_specific}
		}

		// Final construction and POST
		const itemWide = {
			item: item,
			derived_type: derived_item
		}
		loadingHTTP = true;
		try {
			await CoreItemWideAPI.postItem(itemWide);
			itemCreateError = null;
			successToast("Item Created!")
			isOpen = false; // Close the modal when the creation was a success :))
		} catch (error) {
			itemCreateError = error instanceof Error ? error.message : 'Error submitting form';
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}
</script>

<Modal title="Item Aanmaken" maxWidth="max-w-7xl" bind:isOpen={ isOpen } closable={ true }>
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
			</div>

			<!-- Available Composition -->


			<!-- Specific Item fields-->
			<div class="flex-1">
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
				{:else if itemType === "promoitem"}
					<fieldset>
						<div class="form-field">
							<label for="promo_type">Promo type</label>
							<select id="promo_type" required bind:value={form.promo_type}>
								<option value="" disabled selected>Select a promo</option>
								{#each PromoItemTypes as promo_type}
									<option value={promo_type}>{makePretty(PromoItemTypeEnum[promo_type])}</option>
								{/each}
							</select>
							<p>Type van promoitem</p>
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
						<input id="preview_description" type="text" bind:value={form.preview_description}/>
						<p>Extra display beschrijving</p>
					</div>
				</fieldset>
			</div>
			{/if}

			<!-- RecSys Preview -->
			{#if (recsysPreview !== null)}
				<!-- Separator lijn -->
				<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

				<div class="p-4 flex-1">
					<RecSysPreviewItem item={recsysPreview} />
				</div>
			{/if}
		</div>
		</form>

		<!-- Footer -->
		<div class="p-2 flex border-t border-gray-200">
			<button class="button button-primary w-24 button-inline"
							disabled={loadingHTTP}
							onclick={createItem}>
				<span class="text-white">Create</span>
			</button>
		</div>

		{#if (itemCreateError !== null)}
			<div class="error-message p-4">
				{JSON.stringify(itemCreateError)}
			</div>
		{/if}

	{/snippet}
</Modal>