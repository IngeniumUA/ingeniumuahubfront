<script lang="ts">
	import Modal from "$lib/components/layout/modal.svelte";
	import { makePretty } from '$lib/utilities/style-utilities';
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import type { RecSysPreviewI } from "$lib/models/RecSysI";

	let { itemType = null, isOpen = $bindable(false) }: { itemType: string | null, isOpen: boolean } = $props();

	let loadingHTTP = false;
	let itemCreateError = null;

	let hasDisplayMixin = $derived(["eventitem", "promoitem", "shopitem"].includes(itemType === null ? "": itemType));

	// Form fields as reactive state
	let form = $state({
		name: '',
		description: '',
		color: '',
		clickThroughLink: '',
		externalLink: false,
		preview_description: null
	});
	let recsysPreview = $derived.by(() => {
		if (!hasDisplayMixin) {return null}

		let recsysItem: RecSysPreviewI = {
			name: form.name,
			follow_through_link: form.externalLink ? form.clickThroughLink: `/${itemType}/${form.name}`,
			date: null,
			color: 'rgb(255, 255, 255)',
			image_square: null,
			image_landscape: null,
			preview_description: null
		};

		if (hasDisplayMixin) {
			recsysItem.color = form.color;
			recsysItem.preview_description = form.preview_description;
		}

		return recsysItem;
	});

	async function createItem() {

	}
</script>

<Modal title="Item Aanmaken" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<!-- Main body -->
		<form class="p-4">
		<div class="flex flex-row gap-4 min-w-96">
			<div class="w-96">
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
			<div class="w-96">
				<h3>{makePretty(itemType === null ? "": itemType)}</h3>
			</div>

			<!-- Display Composition -->
			{#if (hasDisplayMixin)}
			<div class="w-96">
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
				<label class="inline-flex items-center cursor-pointer my-4">
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
				<div class="p-4">
					<RecSysPreviewItem item={recsysPreview} />
				</div>
			{/if}
		</div>
		</form>

		<!-- Footer -->
		<div class="p-2 flex border-t dark:border-gray-600 border-gray-200">
			<button class="button button-primary w-24 button-inline"
							disabled={loadingHTTP}
							onclick={createItem}>
				<span class="text-white">Create</span>
			</button>
		</div>

		{#if (itemCreateError !== null)}
			<div class="error-message">
				{itemCreateError}
			</div>
		{/if}

	{/snippet}
</Modal>