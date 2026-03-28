<script lang="ts">
	import { CoreGroupAPI } from '$lib/core_api/group_api';
	import Modal from '$lib/components/layout/modal.svelte';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';

	let { isOpen = $bindable(false) }: { isOpen: boolean } = $props();

	let loadingHTTP: boolean = $state(false);
	let createError: string | null = $state(null);

	// Form fields as reactive state
	let form = $state({
		name: '',
	});

	async function createGroup() {
		if (loadingHTTP) {return}
		// todo check for form errors

		const postGroup = {
			name: form.name,
		};

		loadingHTTP = true;
		try {
			await CoreGroupAPI.postGroup(null, postGroup);
			createError = null;
		} catch (error) {
			createError = error instanceof Error ? error.message : 'Error submitting form';
		} finally {
			if (createError === null) {
				successToast("Group created!")
				isOpen = false;
			} else {
				failedToast(`Failed`)
			}
			loadingHTTP = false;
		}
	}
</script>

<Modal title="Product Group Aanmaken" maxWidth="max-w-xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<!-- Main body -->
		<div class="alert alert-info m-4 max-w-3xl">
			<p class="alert-text">Group aanmaken. Wordt automatisch ook in Keycloak onder dezelfde naam gezet.</p>
		</div>
		<form class="p-4 ingenium-form">
			<fieldset>
				<div class="form-field">
					<label for="name">Name</label>
					<input id="name" type="text" required bind:value={form.name}/>
					<p>Display naam</p>
				</div>
			</fieldset>
		</form>

		<div class="p-2 flex border-t dark:border-gray-600 border-gray-200">
			<button class="button button-primary w-24 button-inline"
							disabled={loadingHTTP}
							onclick={createGroup}>
				<span class="text-white">Create</span>
			</button>
		</div>

		{#if (createError !== null)}
			<div class="error-message p-4">
				{JSON.stringify(createError)}
			</div>
		{/if}

	{/snippet}
</Modal>