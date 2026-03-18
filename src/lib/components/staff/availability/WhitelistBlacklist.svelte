<script lang="ts">
	import type { AccessPolicyI } from '$lib/models/item/availabilityCompositionI';
	import { onMount } from 'svelte';
	import type { GroupI } from '$lib/models/user/GroupI';
	import { handleRequest } from '$lib/utilities/httpUtilities';
	import { failedToast } from '$lib/components/toast/defined_toast';
	import { CoreGroupAPI } from '$lib/core_api/group_api';

	let { formState = $bindable() }: { formState: AccessPolicyI | null } = $props();

	interface GroupsConfig {
		whitelist: (number | null)[]
		blacklist: (number | null)[]
	}
	
	function parseAsGroups(): GroupsConfig {
		if (formState === null) {
			return {
				whitelist: [],
				blacklist: []
			}
		}
		return formState.access_policy_config as GroupsConfig
	}

	let whitelistGroups: (number | null)[] = $state(parseAsGroups().whitelist);
	let blacklistGroups: (number | null)[] = $state(parseAsGroups().blacklist);

	let possibleGroups: GroupI[] = $state([])
	let possibleGroupIds: number[] = $derived(possibleGroups.map((group) => {return group.id}))

	$effect(() => {
		formState = {
			access_policy_config: {
				whitelist: whitelistGroups, blacklist: blacklistGroups
			}
		}
	})

	async function queryGroups() {
		try {
			possibleGroups = await CoreGroupAPI.queryGroup(null).catch(handleRequest);
		} catch (error) {
			failedToast(`Failed ${error}`);
		}
	}
	onMount(() => {
		queryGroups();
	});

	/**
	 *
	 */
	function groupIdToName(groupId: number): string {
		const group = possibleGroups.find(g => g.id === groupId);
		return group ? group.name : `Group ${groupId}`;
	}
</script>

<form class="ingenium-form" onsubmit={(e) => { e.preventDefault(); }}>
	<p class="font-bold">Whitelist</p>
	{#each whitelistGroups as group, i}
		<div class="flex flex-row gap-4 items-center">
			<fieldset class="w-full">
				<div class="form-field">
					<select id="group_id_{group}" required bind:value={whitelistGroups[i]}>
						{#each possibleGroupIds as groupId}
							<option value={groupId}>
								{groupIdToName(groupId)}
							</option>
						{/each}
					</select>
				</div>
			</fieldset>

			<button class="ml-auto mr-8" type="button" onclick={() => whitelistGroups.splice(i, 1)}>
				Remove
			</button>
		</div>
	{/each}
	<button class="button button-secondary" onclick={() => {whitelistGroups.push(null)}}>Add</button>
</form>