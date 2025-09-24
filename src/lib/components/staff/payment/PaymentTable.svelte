<script lang="ts">
	import CheckoutTable from '$lib/components/staff/payment/CheckoutTable.svelte';
	import Modal from '$lib/components/layout/modal.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';
	import { successToast } from '$lib/components/toast/defined_toast';

	/**
	 * Bulk importing state and functions
	 */
	let loadingHTTP: boolean = $state(false)
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
</script>

<main>
	<button class="ml-auto button button-primary w-24 button-inline" onclick={() => {showBulkImport = true}}>
		<span class="text-white">Import</span>
	</button>
	<CheckoutTable></CheckoutTable>
</main>

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