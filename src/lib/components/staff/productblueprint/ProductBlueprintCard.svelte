<script lang="ts">
	import type { ProductBlueprintI, UponCompletionMetaData } from '$lib/models/product_blueprint/ProductBlueprintI';
	import type { PricePolicyI } from '$lib/models/product_blueprint/PricePolicyI';
	import AvailabilityForm from '$lib/components/staff/availability/AvailabilityForm.svelte';
	import AddPricePolicyModal from '$lib/components/staff/productblueprint/AddPricePolicyModal.svelte';
	import PricePolicyCard from '$lib/components/staff/productblueprint/PricePolicyCard.svelte';
	import { CoreProductBlueprintAPI } from '$lib/core_api/blueprint_api';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import DeleteButton from '$lib/components/staff/DeleteButton.svelte';

	let {
		loadingHTTP = $bindable(false), // with default
		refreshCallback,
		productBlueprint = $bindable()
	}: {
		loadingHTTP: boolean,
		refreshCallback: () => void,
		productBlueprint: ProductBlueprintI,
	} = $props();

	type Section = 'product' | 'limits' | 'meta' | 'availability' | 'completion';
	let openSection = $state<Section | null>('product');

	function toggle(section: Section) {
		openSection = openSection === section ? null : section;
	}

	function parseForForm(): string {
		if ('other_meta_data' in productBlueprint.product_blueprint_metadata) {
			const meta = productBlueprint.product_blueprint_metadata?.other_meta_data;
			if (meta && 'form' in meta) {
				return JSON.stringify((meta as { form: unknown }).form);
			}
		}
		return '';
	}

	let form = $state({
		name: productBlueprint.name,
		description: productBlueprint.description,
		ordering: productBlueprint.ordering,

		max_total: productBlueprint.max_total,
		max_per_checkout: productBlueprint.max_per_checkout,
		max_individual: productBlueprint.max_individual,

		availability: productBlueprint.availability,

		product_blueprint_metadata: {
			track_checkout: (productBlueprint.product_blueprint_metadata.upon_completion?.track_checkout ?? null) !== null,
			add_to_group: (productBlueprint.product_blueprint_metadata.upon_completion?.add_to_group ?? null) !== null,
			add_to_group_value: '',
			category: productBlueprint.product_blueprint_metadata.categorie,
			group: productBlueprint.product_blueprint_metadata.group,
			other_meta_data: {
				form: parseForForm()
			}
		}
	});

	let addingPricePolicy = $state(false);
	let putError: Error | null = $state(null);

	function appendPricePolicy(pricePolicy: PricePolicyI) {
		productBlueprint.price_policies.push(pricePolicy);
	}

	async function update() {
		if (loadingHTTP) return;

		const putProductBlueprint = productBlueprint;
		putProductBlueprint.name = form.name;
		putProductBlueprint.description = form.description;
		putProductBlueprint.max_total = form.max_total;
		putProductBlueprint.max_individual = form.max_individual;
		putProductBlueprint.max_per_checkout = form.max_per_checkout;
		putProductBlueprint.ordering = form.ordering;
		putProductBlueprint.availability = form.availability;
		putProductBlueprint.product_blueprint_metadata.categorie = form.product_blueprint_metadata.category;
		putProductBlueprint.product_blueprint_metadata.group = form.product_blueprint_metadata.group;

		const upon_completion: UponCompletionMetaData = {
			track_checkout: null,
			add_to_group: null
		};
		if (form.product_blueprint_metadata.track_checkout) {
			upon_completion.track_checkout = { status_queue: [1, 2, 3], disabled_on_status: 3 };
		}
		if (form.product_blueprint_metadata.add_to_group) {
			upon_completion.add_to_group = form.product_blueprint_metadata.add_to_group_value;
		}
		putProductBlueprint.product_blueprint_metadata.upon_completion = upon_completion;

		const formStr = form.product_blueprint_metadata.other_meta_data.form;
		if (formStr !== null && formStr !== '' && formStr !== undefined) {
			putProductBlueprint.product_blueprint_metadata.other_meta_data = {
				form: JSON.parse(formStr as string)
			};
		}

		loadingHTTP = true;
		try {
			productBlueprint = await CoreProductBlueprintAPI.putProductBlueprint(putProductBlueprint);
			putError = null;
		} catch (error) {
			putError = error instanceof Error ? error : Error('Error submitting form');
		} finally {
			if (putError === null) {
				successToast('Updated!');
			} else {
				failedToast('Update failed');
			}
			loadingHTTP = false;
		}
	}

	/**
	 * Price policy refreshing
	 * (NO HTTPLOADING CHECK) because I don't think we need it? And most of all I don't want this to block
	 */
	async function refreshPricePolicies() {
		try {
			productBlueprint.price_policies = await CoreProductBlueprintAPI.queryPricePolicyForBlueprint(null, productBlueprint.id);
			putError = null;
		} catch (error) {
			putError = error instanceof Error ? error : Error('Error submitting form');
		}
	}

	/**
	 * Deleting
	 */
	let deleteError: Error | null = $state(null);
	async function deleteProductBlueprint() {
		loadingHTTP = true;
		try {
			await CoreProductBlueprintAPI.deleteProductBlueprint(productBlueprint.id);
		} catch (error) {
			deleteError = error instanceof Error ? error : Error('Error submitting form');
		} finally {
			if (deleteError === null) {
				successToast('Deleted!');
				refreshCallback();
			} else {
				failedToast('Delete failed');
			}
			loadingHTTP = false;
		}
	}
</script>

<style lang="scss">
  .accordion-button {
    @apply w-full flex items-center gap-3 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-12;

    // Icon container
    span:nth-of-type(1) {
      @apply flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-ingenium-grey-100;
    }

    // Title
    span:nth-of-type(2) {
      @apply text-sm font-bold text-blue-900;
    }

    // Description
    span:nth-of-type(3) {
      @apply text-xs text-gray-400 truncate;
    }
  }

	.ingenium-form {
		label {
			@apply text-sm;
		}
	}
</style>

<article class="my-4 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden">

	<!-- Header -->
	<div class="flex items-center gap-3 px-4 py-3 bg-ingenium-grey-100 border-b border-gray-200">
		<h2>{productBlueprint.name}</h2>
		<!-- Active toggle pill -->
		<span class="ml-auto text-xs px-2 py-1 rounded-full
			{productBlueprint.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
			{productBlueprint.availability ? 'Active' : 'Inactive'}
		</span>
	</div>

	<!-- Summary stat cards -->
	<div class="flex flex-row gap-2 p-4 bg-ingenium-grey-100 border-b border-gray-200">
		<div class="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-200">
			<p class="text-xs text-gray-500">Max total</p>
			<p class="text-xl font-medium text-gray-900">{productBlueprint.max_total}</p>
		</div>
		<div class="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-200">
			<p class="text-xs text-gray-500">Per checkout</p>
			<p class="text-xl font-medium text-gray-900">{productBlueprint.max_per_checkout}</p>
		</div>
		<div class="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-200">
			<p class="text-xs text-gray-500">Per Account</p>
			<p class="text-xl font-medium text-gray-900">{productBlueprint.max_individual}</p>
		</div>
	</div>

	<!-- Accordion sections -->
	<div class="px-4 divide-y divide-gray-200">
	<!-- Product details -->
		<button
			type="button"
			onclick={() => toggle('product')}
			class="accordion-button"
			aria-expanded={openSection === 'product'}
		>
			<span>
				<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
				</svg>
			</span>
			<span>Product details</span>
			<span>Name · description · ordering · {form.product_blueprint_metadata.category || '–'} · {form.product_blueprint_metadata.group || '–'}</span>
		</button>
		{#if openSection === 'product'}
			<form class="ingenium-form">
				<fieldset>
					<div class="form-field">
						<label for="productName">Name</label>
						<input id="productName" type="text" required bind:value={form.name} />
					</div>
					<div class="form-field">
						<label for="productDescription">Description</label>
						<textarea id="productDescription" class="w-full min-h-16" required bind:value={form.description}></textarea>
					</div>
					<div class="form-field">
						<label for="ordering">Ordering</label>
						<input id="ordering" type="number" class="w-20" required bind:value={form.ordering} />
						<p class="text-xs text-gray-400">Higher number → shown first</p>
					</div>
				</fieldset>
				<fieldset class="grid grid-cols-2 gap-2">
					<div class="form-field">
						<label for="category">Category</label>
						<input id="category" type="text" bind:value={form.product_blueprint_metadata.category} />
					</div>
					<div class="form-field">
						<label for="group">Group</label>
						<input id="group" type="text" bind:value={form.product_blueprint_metadata.group} />
					</div>
				</fieldset>
			</form>
		{/if}
	</div>

	<!-- Limits -->
	<div class="px-4 divide-y divide-gray-200">
		<button
			type="button"
			onclick={() => toggle('limits')}
			class="accordion-button"
			aria-expanded={openSection === 'limits'}
		>
			<span>
				<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
				</svg>
			</span>
			<span>Limits</span>
			<span>Max total · per checkout · per account</span>
		</button>
		{#if openSection === 'limits'}
			<form class="ingenium-form">
				<fieldset class="grid grid-cols-3 gap-2">
					<div class="form-field">
						<label for="max_total">Total</label>
						<input id="max_total" type="number" required bind:value={form.max_total} />
					</div>
					<div class="form-field">
						<label for="max_per_checkout">Per checkout</label>
						<input id="max_per_checkout" type="number" required bind:value={form.max_per_checkout} />
					</div>
					<div class="form-field">
						<label for="max_individual">Per account</label>
						<input id="max_individual" type="number" required bind:value={form.max_individual} />
					</div>
				</fieldset>
			</form>
		{/if}
	</div>

	<!-- Availability -->
	<div class="px-4 divide-y divide-gray-200">
		<button
			type="button"
			onclick={() => toggle('availability')}
			class="accordion-button"
			aria-expanded={openSection === 'availability'}
		>
			<span>
				<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
				</svg>
			</span>
			<span>Availability</span>
			<span>Dates · dynamic policy</span>
		</button>
		{#if openSection === 'availability'}
			<AvailabilityForm bind:formState={form.availability} />
		{/if}
	</div>

	<!-- Completion -->
	<div class="px-4 divide-y divide-gray-200">
		<button
			type="button"
			onclick={() => toggle('completion')}
			class="accordion-button"
			aria-expanded={openSection === 'completion'}
		>
			<span>
				<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
				</svg>
			</span>
			<span>Completion</span>
			<span>Order tracking · group assignment</span>
		</button>
		{#if openSection === 'completion'}
			<form class="ingenium-form">
				<!-- Track checkout toggle -->
				<label class="flex items-center gap-3 cursor-pointer">
					<input type="checkbox" class="sr-only peer" bind:checked={form.product_blueprint_metadata.track_checkout} />
					<span class="
						relative w-10 h-6 rounded-full flex-shrink-0
						bg-red-900 peer-checked:bg-green-900
						after:content-[''] after:absolute after:top-1 after:start-1
						after:w-4 after:h-4 after:bg-white after:rounded-full
						after:transition-transform peer-checked:after:translate-x-4
					"></span>
					<div>
						<p class="text-sm text-gray-900">Order tracking</p>
						<p class="text-xs text-gray-400">Voor Pop-up Z ordertracking</p>
					</div>
				</label>

				<!-- Add to group toggle -->
				<label class="flex items-center gap-3 cursor-pointer">
					<input type="checkbox" class="sr-only peer" bind:checked={form.product_blueprint_metadata.add_to_group} />
					<span class="
						relative w-10 h-6 rounded-full flex-shrink-0
						bg-red-900 peer-checked:bg-green-900
						after:content-[''] after:absolute after:top-1 after:start-1
						after:w-4 after:h-4 after:bg-white after:rounded-full
						after:transition-transform peer-checked:after:translate-x-4
					"></span>
					<div>
						<p class="text-sm text-gray-900">Add to group</p>
						<p class="text-xs text-gray-400">Keycloak group assignment</p>
					</div>
				</label>

				{#if form.product_blueprint_metadata.add_to_group}
					<fieldset>
						<div class="form-field">
							<label for="add_to_group_value">Keycloak group UUID</label>
							<input id="add_to_group_value" type="text" bind:value={form.product_blueprint_metadata.add_to_group_value} />
						</div>
					</fieldset>
				{/if}
			</form>
		{/if}
	</div>


	<!-- Meta config -->
	<div class="px-4 divide-y divide-gray-200">
		<button
			type="button"
			onclick={() => toggle('meta')}
			class="accordion-button"
			aria-expanded={openSection === 'meta'}
		>
			<span>
				<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"/>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z"/>
				</svg>
			</span>
			<span>Meta config</span>
			<span>{form.product_blueprint_metadata.category || '–'} · {form.product_blueprint_metadata.group || '–'}</span>
		</button>
		{#if openSection === 'meta'}
			<form class="ingenium-form">
				<fieldset>
					<div class="form-field">
						<label for="meta_form">Meta form</label>
						<input id="meta_form" type="text" bind:value={form.product_blueprint_metadata.other_meta_data.form} />
					</div>
				</fieldset>
			</form>
		{/if}
	</div>

	<!-- Save Button -->
	<div class="flex px-4">
		<button
			type="button"
			onclick={update}
			disabled={loadingHTTP}
			class="button button-primary ml-auto"
		>
			{loadingHTTP ? 'Saving…' : 'Save changes'}
		</button>
		{#if (putError !== null)}
			<div class="error-message p-4">
				{JSON.stringify(putError)}
			</div>
		{/if}
	</div>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	<!-- Price policies -->
	<div class="flex items-center justify-between px-4 py-3">
		<h3 class="font-bold">Price policies</h3>
		<button
			type="button"
			onclick={() => { addingPricePolicy = true; }}
			class="button button-primary"
		>
			Add new
		</button>
	</div>

	<div class="px-4 divide-y divide-gray-200">
		{#each productBlueprint.price_policies as pricePolicy, pricePolicyIndex (pricePolicy.id)}
			<PricePolicyCard
				bind:loadingHTTP={loadingHTTP}
				isOpen={false}
				bind:pricePolicy={productBlueprint.price_policies[pricePolicyIndex]}
				pricePolicyIndex={pricePolicyIndex}
				refreshCallback={() => refreshPricePolicies()}
			/>
		{/each}
	</div>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	<div class="flex px-4 pb-4">
		<div class="ml-auto">
			<DeleteButton
				bind:loadingHTTP={loadingHTTP}
				deleteCallback={() => deleteProductBlueprint()}
				deleteString="Delete Blueprint"
			></DeleteButton>
		</div>
		{#if (deleteError !== null)}
			<div class="error-message p-4">
				{JSON.stringify(deleteError)}
			</div>
		{/if}
	</div>
</article>

<AddPricePolicyModal
	createdCallback={appendPricePolicy}
	bind:isOpen={addingPricePolicy}
	product_blueprint_id={productBlueprint.id}
/>