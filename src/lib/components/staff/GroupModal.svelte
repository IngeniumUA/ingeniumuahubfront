<script lang="ts">
	import Modal from '$lib/components/layout/modal.svelte';
	import { handleRequest } from '$lib/utilities/httpUtilities';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import type { GroupI } from '$lib/models/user/GroupI';
	import { CoreGroupAPI } from '$lib/core_api/group_api';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';

	let { group, isOpen = $bindable(false) }: { group: GroupI, isOpen: boolean } = $props();
	
	let loadingHTTP: boolean = $state(false);
	let groupUpdateError: string | null = $state(null);

	// Form fields as reactive state
	let form = $state({
		name: group.name,
		keycloak_group_uuid: group.keycloak_group_uuid
	});

	/**
	 * Updating logic
	 */
	async function updateGroup() {
		let groupPut = group;
		group.name = form.name;
		group.keycloak_group_uuid = form.keycloak_group_uuid;

		if (loadingHTTP) return;
		loadingHTTP = true;
		try {
			group = await CoreGroupAPI.putGroup(null, groupPut).catch(handleRequest);
			successToast("Group updated!")
		} catch (error) {
			failedToast(`Failed ${error}`);
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	/**
	 * Synchronising API
	 */
	async function syncroniseGroup() {
		if (loadingHTTP) return;
		loadingHTTP = true;
		try {
			const res = await fetch(`${PUBLIC_API_URL}/group/sync_to_keycloak/${group.id}`, {
				method: 'PATCH',
				headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
				body: JSON.stringify({})
			});
			if (res.ok) {
				successToast("Syncronised group successfully!")
				return await res.json();
			}
		} catch (error) {
			failedToast(`Failed to sync group: ${error}`);
		} finally {
			loadingHTTP = false;
		}
	}
</script>


<Modal title="Group Bewerken" maxWidth="max-w-2xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<!-- Main body -->
		<form class="p-4 ingenium-form flex lg:flex-row gap-4 min-w-96">
			<fieldset>
				<div class="form-field">
					<label for="name">Name</label>
					<input id="name" type="text" required bind:value={form.name}/>
					<p>Display naam</p>
				</div>
				<div class="form-field">
					<label for="keycloak_group_uuid">Keycloak Group</label>
					<input id="keycloak_group_uuid" type="text" required bind:value={form.keycloak_group_uuid}/>
					<p>ID van de keycloak group</p>
				</div>
			</fieldset>
		</form>

		<!-- Footer -->
		<div class="p-2 flex justify-between groups-center border-t dark:border-gray-600 border-gray-200">
			<button class="button button-primary button-inline"
							disabled={loadingHTTP}
							onclick={syncroniseGroup}>
				<span class="text-white">Synchroniseer</span>
			</button>
			<button class="button button-primary w-24 button-inline"
							disabled={loadingHTTP}
							onclick={updateGroup}>
				<span class="text-white">Update</span>
			</button>
		</div>

		{#if (groupUpdateError !== null)}
			<div class="error-message p-4">
				{JSON.stringify(groupUpdateError)}
			</div>
		{/if}

	{/snippet}
</Modal>

<style>
    h3 {
        @apply font-bold;
    }
</style>