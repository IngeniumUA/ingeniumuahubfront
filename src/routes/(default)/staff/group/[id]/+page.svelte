<script lang="ts">
	import { CoreGroupAPI } from '$lib/core_api/group_api';
	import type { GroupI } from '$lib/models/user/GroupI';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let group: GroupI = $state(data.group);
	let memberCount: number = $state(data.memberCount);
	let keycloakGroup = $state(data.keycloakGroup);

	let loadingHTTP: boolean = $state(false);
	async function refresh() {
		if (loadingHTTP) return;

		group = await CoreGroupAPI.getGroup(null, group.id);
		keycloakGroup = group.keycloak_group_uuid !== null ? await CoreGroupAPI.getKeycloakGroup(null, group.keycloak_group_uuid): null;
		memberCount = await CoreGroupAPI.countMembers(null, group.id)

		successToast("Data refreshed!")
	}

	/**
	 * Form state
	 */
	let form = $derived({
		name: group.name,
		keycloakGroup: group.keycloak_group_uuid,
	})

	/**
	 * Updated
	 */
	let putError: Error | null = $state(null)
	async function putGroup() {
		if (loadingHTTP) return;

		let putObj = group;
		putObj.keycloak_group_uuid = form.keycloakGroup
		if (putObj.keycloak_group_uuid === "") putObj.keycloak_group_uuid = null;
		putObj.name = form.name;

		loadingHTTP = true;
		try {
			group = await CoreGroupAPI.putGroup(null, putObj);
			putError = null;
		} catch (error) {
			putError = error instanceof Error ? error : Error('Error submitting form');
		} finally {
			if (putError === null) {
				successToast("Updated!")
			} else {
				failedToast(`Update Failed`)
			}
			loadingHTTP = false;
		}
	}
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1 id="{group.name}">{group.name}</h1>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<div class="alert alert-info mb-4 max-w-3xl">
		<p class="alert-text">Het beheren van groepen gebeurt voornamelijk in keycloak.
		De groepen in de core database (dus HubGroup) bestaan om eenvoudiger te kunnen redeneren in deze applicatie.</p>
	</div>

	<h1>Group Configuration</h1>
	<section class="flex flex-col lg:flex-row">
		<div class="order-1 lg:order-3 lg:flex-[1]">
			<h2>On this page</h2>
			<aside class="py-6 px-4 sm:px-2 col-span-1 md:col-span-2 w-full">
				<nav class="vertical-nav vertical-nav-transparent">
					<div>
						<a href="#{group.name}" class="font-semibold">Group</a>
						<a href="#keycloak" class="font-semibold">Keycloak</a>
						<a href="#webmaster-info" class="font-semibold">Webmaster</a>
						<a href="#changelog" class="font-semibold">Changelog</a>
					</div>
				</nav>
			</aside>
		</div>

		<div class="order-2 hidden lg:block w-px mx-4 bg-gray-200 "></div>

		<form class="ingenium-form order-3 lg:order-1 lg:flex-[2] flex flex-col md:flex-row gap-4">
			<div class="ingenium-form-card">
				<fieldset class="flex flex-row gap-4">
					<div class="flex-1 form-field max-w-72 mb-2">
						<label for="name">Name</label>
						<input id="name" type="text" required bind:value={ form.name }/>
						<p>Display naam van de group.</p>
					</div>

					<div class="flex-1 form-field max-w-72 mb-2">
						<label for="keycloakGroup">Keycloak Group ID</label>
						<input id="keycloakGroup" type="text" required bind:value={ form.keycloakGroup }/>
						<p>Id van de keycloak groep waaraan deze is gelinkt.</p>
					</div>
				</fieldset>

				<button class="button button-primary button-inline"
								disabled={loadingHTTP}
								onclick={putGroup}>
					<span class="text-white">Update</span>
				</button>
			</div>

			<div class="ingenium-form-card">
				TODO: Hier zo'n lijst van data zoals bij de checkout
				<p>Membercount: {memberCount}</p>
			</div>
		</form>
	</section>

	<h1 id="keycloak">Linked Keycloak Group</h1>
	<section>
		{#if (keycloakGroup === null)}
			<p>Geen groep gelinkt</p>
		{:else}
			{JSON.stringify(keycloakGroup, null, 2)}
		{/if}
	</section>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<h1 id="webmaster-info">Webmaster Info</h1>

	<h2 id="changelog">Changelog</h2>
	<p>TODO 2: DBLogs voor dit item (als aparte component)</p>

	<div class="flex justify-end mt-4 gap-4">
		<button class="button button-danger button-inline"
						disabled={loadingHTTP}>
			<span class="text-white">Delete (wip)</span>
		</button>
	</div>
</main>