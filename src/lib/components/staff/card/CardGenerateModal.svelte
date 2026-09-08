<script lang="ts">
	import { CardMembershipEnum, CardMembershipEnumList } from '$lib/models/item/cardI';
	import { makePretty } from '$lib/utilities/style-utilities';
	import Modal from '$lib/components/layout/modal.svelte';
	import type { GroupI } from '$lib/models/user/GroupI';
	import { CoreGroupAPI } from '$lib/core_api/group_api';
	import { handleRequest } from '$lib/utilities/httpUtilities';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';

	let addNewError: Error | null = $state(null);

	let {
		isOpen = $bindable(false),
	}: {
		isOpen: boolean,
	} = $props();

	/**
	 * Create form
	 */
	interface FormState {
		cardNrStart: number;
		cardCount: number;
		member_type: number;
		linked_group_id: number | null;
	}
	let createForm: FormState = $state({
		cardNrStart: 1,
		cardCount: 50,
		member_type: CardMembershipEnum.lid,
		linked_group_id: null,
	})

	/**
	 * Create method
	 */
	let loadingHTTP: boolean = $state(false)
	async function bulkCreate() {
		if (loadingHTTP) return;
		loadingHTTP = true;

		const createObj = {
			card_nr_start: createForm.cardNrStart,
			card_count: createForm.cardCount,
			linked_group_id: createForm.linked_group_id,
			member_type: createForm.member_type,
		}
		try {
			const res = await fetch(`${PUBLIC_API_URL}/card/bulk`, {
				method: 'POST',
				headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
				body: JSON.stringify(createObj)
			});
			if (res.ok) {
				isOpen = false;
				successToast("Created!")
			} else {
				const text = await res.text();
				failedToast(`Failed to patch: ${text}`)
			}
		} catch (error) {
			failedToast(`Failed to patch: ${error instanceof Error ? error : Error(`Error during Patch: ${error}`)}`);
		} finally {
			loadingHTTP = false;
		}
	}


	/**
	 * Group stuff
	 */
	let possibleGroups: GroupI[] = $state([])
	let possibleGroupIds: number[] = $derived(possibleGroups.map((group) => {return group.id}))
	async function queryGroups() {
		try {
			possibleGroups = await CoreGroupAPI.queryGroup(null).catch(handleRequest);
		} catch (error) {
			failedToast(`Failed ${error}`);
		}
	}
	function groupIdToName(groupId: number): string {
		const group = possibleGroups.find(g => g.id === groupId);
		return group ? group.name : `Group ${groupId}`;
	}
	onMount(() => {
		queryGroups();
	});
</script>

<Modal title="Generate new" maxWidth="max-w-xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<article class="m-4">
			<form class="ingenium-form" onsubmit={(e) => { e.preventDefault(); }}>
				<fieldset>
					<div class="form-field">
						<label for="available_from">Card nr start</label>
						<input id="available_from" type="number" required bind:value={createForm.cardNrStart}/>

						<label for="card_count">Card count</label>
						<input id="card_count" type="number" required bind:value={createForm.cardCount}/>
					</div>

					<div class="form-field max-w-32">
						<label for="member_type">Card type</label>
						<select id="member_type" required bind:value={createForm.member_type}>
							{#each CardMembershipEnumList as membershipEnum}
								<option value={membershipEnum}>
									{makePretty(CardMembershipEnum[membershipEnum])}
								</option>
							{/each}
						</select>
					</div>

					<div class="form-field">
						<label for="member_type">Add to group</label>
						<select id="linked_group_id" required bind:value={createForm.linked_group_id}>
							<option value={null} disabled>Pick one</option>
							{#each possibleGroupIds as groupId}
								<option value={groupId ?? null}>
									{groupId === null ? "Pick one": groupIdToName(groupId)}
								</option>
							{/each}
						</select>
					</div>
				</fieldset>

				<div class="p-2 flex border-t dark:border-gray-600 border-gray-200">
					<button class="button button-primary w-24 button-inline"
									disabled={loadingHTTP}
									onclick={bulkCreate}>
						<span class="text-white">Create</span>
					</button>
				</div>
			</form>

			{#if addNewError !== null}
				{addNewError}
			{/if}
		</article>
	{/snippet}
</Modal>