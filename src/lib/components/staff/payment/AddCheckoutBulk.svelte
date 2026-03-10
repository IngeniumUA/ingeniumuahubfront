<script lang="ts">
	import Modal from '$lib/components/layout/modal.svelte';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
	import { handleRequest } from '$lib/utilities/httpUtilities';
	import type { TransactionInI } from '$lib/models/transactionI';
	import { PaymentProviderEnum } from '$lib/models/productsI';
	import { PaymentStatusEnum } from '$lib/models/enums';

	let { startingItemId = $bindable(), isOpen = $bindable(false) }: {startingItemId: number, isOpen: boolean } = $props();

	// Define a type for the parsed CSV rows
	interface CheckoutIn {
		product_blueprint_id: string;
		price_policy_in: string;
		product_meta: string;
	}

	let loadingHTTP: boolean = $state(false);
	let showBulkImport: boolean = $state(false);
	let files: FileList | undefined = $state();

	let createError: string | null = $state(null);
	let uploadError: string | null = $state(null);

	// New state variables for managing the batch processing
	let parsedCheckouts: TransactionInI[] = $state([]);
	let processedCount: number = $state(0);
	let isUploadingBatch: boolean = $state(false);

	async function handleUploadAndParsing() {
		if (loadingHTTP) return;
		loadingHTTP = true;
		uploadError = null;

		if (!files || files.length === 0) {
			loadingHTTP = false;
			return;
		}

		try {
			const file = files[0];
			const text = await file.text();

			// Basic CSV parsing (assuming a standard structure without complex quoted commas)
			const lines = text.split('\n').filter(line => line.trim() !== '');
			if (lines.length < 2) throw new Error("CSV must contain a header and at least one row of data.");

			const headers = lines[0].split(';').map(h => h.trim());
			const blueprintIdx = headers.indexOf('product_blueprint_id');
			const policyIdx = headers.indexOf('price_policy_id');
			const userIdx = headers.indexOf('user');

			const naamIdx = headers.indexOf('naam');
			const voornaamIdx = headers.indexOf('voornaam');
			const badgeTypeIdx = headers.indexOf('badge_type');
			const affiniteitIdx = headers.indexOf('affiniteit');
			const bannerIdx = headers.indexOf('banner');
			const emailIdx = headers.indexOf('email');

			const parsed: TransactionInI[] = [];
			for (let i = 1; i < lines.length; i++) {
				const columns = lines[i].split(';').map(c => c.trim());
				parsed.push({
					item_id: startingItemId,
					validity: 1,
					product_blueprint_id: columns[blueprintIdx],
					price_policy_in: columns[policyIdx],
					other_meta_data: {
						eot_signup: {
							affiniteit: columns[affiniteitIdx],
							naam: columns[naamIdx],
							voornaam: columns[voornaamIdx],
							badge_type: columns[badgeTypeIdx],
							banner: columns[bannerIdx],
							email: columns[emailIdx],
						}
					},
					status: PaymentStatusEnum.successful,
					user: columns[userIdx]
				});
			}
			parsedCheckouts = parsed;
			processedCount = 0;
			successToast(`Successfully parsed ${parsed.length} items!`);
		} catch (error) {
			uploadError = (error as Error).message;
			failedToast("Failed to parse CSV.");
		} finally {
			loadingHTTP = false;
		}
	}

	async function uploadNextFive() {
		if (isUploadingBatch || parsedCheckouts.length === 0) return;

		isUploadingBatch = true;
		createError = null;

		const remaining = parsedCheckouts.length - processedCount;
		const batchSize = Math.min(5, remaining);
		const nextBatch = parsedCheckouts.slice(processedCount, processedCount + batchSize);

		for (const transaction of nextBatch) {
			await checkoutCreate(transaction);
			processedCount++;
			await new Promise(resolve => setTimeout(resolve, 1000));
		}

		isUploadingBatch = false;
		if (processedCount >= parsedCheckouts.length) {
			successToast("All checkouts have been imported!");
		}
	}

	async function checkoutCreate(transactionIn: TransactionInI) {
		const queryParam = new URLSearchParams({
			force_create: 'true',
			create_user_if_none: 'true',
			send_email: 'true'
		});

		loadingHTTP = true;
		const checkoutIn = {
			user_email: transactionIn.user_email,
			payment_provider: PaymentProviderEnum.Free,
			note: '',
			transactions: [transactionIn]
		};

		try {
			await CoreCheckoutAPI.postCheckout(null, checkoutIn, queryParam).catch(handleRequest);

			// Note: Removed `isOpen = false;` from here so the modal doesn't close on the first successful batch item.
			successToast("Checkout created!");
		} catch (error) {
			failedToast(`Failed ${error}`);
			createError = (error as Error).message;
		} finally {
			loadingHTTP = false;
		}
	}
</script>

<Modal title="Bulk Import" maxWidth="max-w-xl" bind:isOpen={isOpen} closable={!isUploadingBatch}>
	{#snippet children()}
		<article class="m-4">
			<label for="file" class="block mb-2 font-semibold">Upload Product Blueprints (CSV)</label>
			<input
				accept="text/csv"
				bind:files
				id="file"
				name="avatar"
				type="file"
				class="mb-4"
				disabled={isUploadingBatch}
			/>

			{#each Array.from(files ?? []) as file}
				<p class="text-sm text-gray-600 mb-2">{file.name} ({file.size} bytes)</p>
			{/each}

			<div class="p-2 flex justify-between items-center border-t mt-4 pt-4">
				<div>
					{#if parsedCheckouts.length > 0}
            <span class="text-sm font-medium">
              Progress: {processedCount} / {parsedCheckouts.length}
            </span>
					{/if}
				</div>

				<div class="flex gap-2">
					<button
						type="button"
						class="button button-secondary w-24 button-inline"
						disabled={loadingHTTP || files === undefined || isUploadingBatch}
						onclick={handleUploadAndParsing}>
						<span>Parse CSV</span>
					</button>

					<button
						type="button"
						class="button button-primary button-inline"
						disabled={parsedCheckouts.length === 0 || isUploadingBatch || processedCount >= parsedCheckouts.length}
						onclick={uploadNextFive}>
            <span class="text-white">
              {isUploadingBatch ? 'Processing...' : 'Upload Next 5'}
            </span>
					</button>
				</div>
			</div>

			{#if uploadError}
				<p class="text-red-500 text-sm mt-2">Parse Error: {uploadError}</p>
			{/if}
			{#if createError}
				<p class="text-red-500 text-sm mt-2">Import Error: {createError}</p>
			{/if}

			{#if parsedCheckouts.length > 0}
				<pre class="text-xs text-ingenium-grey-900">{JSON.stringify(parsedCheckouts[0], null, 2)}</pre>
			{/if}
		</article>
	{/snippet}
</Modal>