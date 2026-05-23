<script lang="ts">
	import Modal from '$lib/components/layout/modal.svelte';
	import { hexToRGB, makePretty } from '$lib/utilities/style-utilities';
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import type { RecSysPreviewI } from '$lib/models/RecSysI';
	import { CoreItemWideAPI } from '$lib/core_api/core_api';
	import type { ItemWideI } from '$lib/models/item/itemwideI';
	import type { EventItemI } from '$lib/models/item/eventI';
	import type { DisplayCompositionI } from '$lib/models/item/displayCompositionI';
	import { handleRequest } from '$lib/utilities/httpUtilities';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';

	let { itemWide, isOpen = $bindable(false) }: { itemWide: ItemWideI, isOpen: boolean } = $props();

	let itemType: string = $derived(itemWide.derived_type.derived_type_enum);
	let loadingHTTP: boolean = $state(false);
	let itemUpdateError: string | null = $state(null);

	let hasDisplayMixin = ["eventitem", "promoitem", "shopitem"].includes(itemWide.derived_type.derived_type_enum);
	const modelTitle = makePretty(itemWide.derived_type.derived_type_enum.slice(0, -4)) // Everything but the last four

	// Extract display object if applicable
	// fixme the typecast at the moment is to EventItemI but that could probably be improved
	let display: DisplayCompositionI | null = hasDisplayMixin ? (itemWide.derived_type as EventItemI).display : null;

	let event: Pick<EventItemI, "event_start" | "event_end"> | null = itemWide.derived_type.derived_type_enum == "eventitem" ? (itemWide.derived_type as EventItemI): null;

	// Form fields as reactive state
	let form = $state({
		name: itemWide.item.name,

		// Display mixin
		color: display?.color ?? "",
		clickThroughLink: display?.follow_through_link ?? "",
		externalLink: display?.follow_through_link.startsWith("http"),
		preview_description: display?.preview_description ?? "",
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
			image_square: form.image_square,
			preview_description: form.preview_description
		};
		recsysItem.color = hexToRGB(form.color) ?? form.color;
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

		// But now the harder part :(
		// Start by assigning the initial item
		// Iterate a couple options for form update things
		let derivedObj = itemWide.derived_type;

		if (hasDisplayMixin) {
			(derivedObj as EventItemI).display = {
				color: form.color,
				preview_description: form.preview_description,
				follow_through_link: form.externalLink ? form.clickThroughLink: `/${itemType.slice(0, itemType.length - 4)}/${form.name}`,
				image_square: form.image_square,
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
			successToast("Item updated!")
		} catch (error) {
			failedToast(`Failed ${error}`);
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	/**
	 * File upload logic
	 */
	let files: FileList | undefined = $state();
	let singleFile = $derived(files && files.length > 0 ? files[0] : null);

	let isUploading: boolean = $state(false);
	let uploadError: Error | null = $state(null);

	async function handleFileUpload() {
		if (!singleFile) return;
		if (isUploading) return;

		isUploading = true;
		uploadError = null;

		try {
			const formData = new FormData();
			formData.append('blob_data', singleFile);
			const res = await fetch(`${PUBLIC_API_URL}/file/media?filename=${form.name}`, {
				method: 'POST',
				headers: getAuthorizationHeaders(null),
				body: formData
			});
			if (res.ok) {
				successToast("Uploaded image!")
				form.image_square = await res.json();
			} else {
				const text = await res.text();
				uploadError = new Error(`Failed to Upload: ${text}`);
			}
		} catch (error) {
			uploadError = error instanceof Error ? error : Error(`Error during Upload: ${error}`);
		} finally {
			isUploading = false;
		}
	}
</script>


<Modal title={`${modelTitle} Bewerken`} maxWidth="max-w-3xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<!-- Main body -->
		<form class="p-4 ingenium-form flex flex-col lg:flex-row gap-4">
				<div class="flex-1">
					<fieldset>
						<div class="form-field">
							<label for="name">Name</label>
							<input id="name" type="text" required bind:value={form.name}/>
							<p>Display naam</p>
						</div>
					</fieldset>

					<!-- Specific Item fields-->
					<fieldset class="flex-[1]">
					{#if itemType === "eventitem"}
						<div class="flex flex-col md:flex-row gap-2">
							<div class="form-field">
								<label for="event_start">Event Start</label>
								<input id="event_start" type="datetime-local" required bind:value={form.event_start}/>
								<p>Start datum evenement</p>
							</div>
							<div class="form-field">
								<label for="event_end">Event End</label>
								<input id="event_end" type="datetime-local" required bind:value={form.event_end}/>
								<p>Eind datum evenement</p>
							</div>
						</div>
					{:else}
						<p>Itemtype {itemType} heeft geen extra data nodig</p>
					{/if}
					</fieldset>

					<!-- Display Composition -->
					{#if (hasDisplayMixin)}
						<div class="flex-[1]">
							<fieldset class="flex flex-row gap-4">
								<div class="form-field">
									<label for="vacatureColor">Color</label>
									<input id="vacatureColor" type="text" required bind:value={form.color}/>
									<p>Kleur voor de weergave</p>
								</div>

								<div class="form-field flex-grow">
									<label for="preview_description">Preview Description</label>
									<input id="preview_description" type="text" required bind:value={form.preview_description}/>
									<p>Extra display beschrijving</p>
								</div>
							</fieldset>

							<label for="file">Upload Banner</label>
							<input
								accept="image/*"
								bind:files
								onchange={handleFileUpload}
								id="file"
								type="file"
								disabled={isUploading}
							/>
						</div>
					{/if}
				</div>

			<div class="hidden md:block w-px bg-gray-200"></div>

			<!-- RecSys Preview -->
			{#if (recsysPreview !== null)}
				<article class="flex-1 lg:min-w-72">
					<RecSysPreviewItem item={recsysPreview} />
				</article>
			{/if}
		</form>

		<!-- Footer -->
		<div class="p-2 flex justify-between items-center border-t dark:border-gray-600 border-gray-200">
			<button class="button button-primary w-24 button-inline"
							disabled={loadingHTTP}
							onclick={updateItem}>
				<span class="text-white">Update</span>
			</button>

			<a href={`/staff/item/${itemWide.item.id}#${itemWide.item.name}`} class="button button-primary button-inline">
				<span class="text-white">Naar { makePretty(itemType) }</span>
			</a>
		</div>

		{#if uploadError !== null}
			<div class="error-message p-4">
				{JSON.stringify(uploadError.message)}
			</div>
		{/if}

		{#if (itemUpdateError !== null)}
			<div class="error-message p-4">
				{JSON.stringify(itemUpdateError)}
			</div>
		{/if}

	{/snippet}
</Modal>