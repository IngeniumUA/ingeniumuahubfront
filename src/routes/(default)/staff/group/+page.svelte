<script lang="ts">
	import { makePretty } from '$lib/utilities/style-utilities';
	import type { GroupI } from '$lib/models/user/GroupI';
	import { CoreGroupAPI } from '$lib/core_api/group_api';
	import GroupModal from '$lib/components/staff/GroupModal.svelte';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();

	let groupTable = $state(data.groupTable)
	let keycloakGroups = $state(data.keycloakGroups)

	let httpLoading: boolean = $state(false);

	/**
	 * Refreshing all data on the page
	 */
	async function refresh() {
		groupTable = await CoreGroupAPI.groupTable(null);
		keycloakGroups = await CoreGroupAPI.queryKeycloakGroup(null)
	}

	/**
	 * Editting state management
	 */
	let showEditModal: boolean = $state(false);
	let editGroup: null | GroupI = $state(null)
	async function setEditGroup(groupId: number) {
		if (httpLoading) return httpLoading;
		showEditModal = true;
		editGroup = await CoreGroupAPI.getGroup(null, groupId);
	}
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>Groups</h1>
		<button class="button button-primary w-24 button-inline" onclick={refresh}>
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<div class="alert alert-info mb-4 max-w-2xl">
		<p class="alert-text">Het beheren van gebruikers en groepen wordt voornamelijk gedaan in <span class="italic">Keycloak</span>
		Die data 'synchroniseren' we (dupliceren) op de Core om minder requests te moeten uitvoeren en die data heir beschikbaar te hebben?</p>
	</div>

	<h2>Keycloak Groups</h2>
	<table class="ingenium-table">
		<thead>
		<tr>
			<th scope="col"><h4>Name</h4></th>
			<th scope="col"><h4>Keycloak ID</h4></th>
		</tr>
		</thead>
		<tbody>
		{#each keycloakGroups as group (group["id"])}
			<tr>
				<th scope="row">
					{makePretty(group["name"])}
				</th>
				<td>
					{group["id"]}
				</td>
			</tr>
		{/each}
		</tbody>
	</table>

	<h2>HubGroups</h2>
	<table class="ingenium-table">
		<thead>
		<tr>
			<th scope="col"><h4>Name</h4></th>
			<th scope="col"><h4>Keycloak?</h4></th>
			<th scope="col"><h4>User Count</h4></th>
		</tr>
		</thead>
		<tbody>
			{#each groupTable as group (group["id"])}
				<tr>
					<th scope="row">
						{makePretty(group["name"])}
					</th>
					<td>
						{#if (group["keycloak_group_uuid"] === null)}
							Nee
						{:else}
							{group["keycloak_group_uuid"].slice(0, 12)}
						{/if}
					</td>
					<td>
						{group["user_count"]}
					</td>
					<td>
						<button aria-label="edit" onclick={() => setEditGroup(group["id"])}>
							<svg fill="#1f2980" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
									 width="20px" height="20px" viewBox="0 0 528.899 528.899"
									 xml:space="preserve">
						<g>
							<path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981
								c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611
								C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069
								L27.473,390.597L0.3,512.69z"/>
						</g>
						</svg>
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</main>

{#if editGroup !== null && showEditModal}
	<GroupModal bind:isOpen={showEditModal} group={editGroup} ></GroupModal>
{/if}