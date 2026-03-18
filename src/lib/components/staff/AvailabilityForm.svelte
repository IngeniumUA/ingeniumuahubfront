<script lang="ts">
	import { AccessPolicyEnum, AccessPolicyEnumList } from '$lib/models/access_policy/AccessPolicyI';
	import { makePretty } from '$lib/utilities/style-utilities';
	import WhitelistBlacklist from '$lib/components/staff/availability/WhitelistBlacklist.svelte';
	import type { AvailabilityCompositionI } from '$lib/models/item/availabilityCompositionI';

	let { formState = $bindable() }: { formState: AvailabilityCompositionI } = $props();

	function toggleAvailable() {}
</script>

<form class="ingenium-form">
	<h3 class="font-bold">Availability</h3>
	<label class="inline-flex items-center cursor-pointer my-4">
		<input type="checkbox" class="sr-only peer"
					 bind:checked={formState.available}
					 onclick="{() => toggleAvailable()}"
		>
		<span class="relative w-11 h-6 bg-red-900 dark:bg-red-900 rounded-full peer-checked:bg-green-900 dark:peer-checked:bg-green-900
					after:content-['']
					after:absolute after:top-[2px] after:start-[2px]
					after:w-5 after:h-5
					after:bg-white after:rounded-full
					after:transition-transform
					peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
					"></span>
		<span class="ms-3 text-sm font-medium text-gray-600">
								{#if (formState.available)}Beschikbaar{:else}Niet Beschikbaar{/if}
							</span>
	</label>

	<fieldset class="flex flex-row gap-2">
		<div class="form-field">
			<label for="available_from">Available From</label>
			<input id="available_from" type="date" required bind:value={formState.available_from}/>
			<p>Beschikbaar vanaf</p>
		</div>
		<div class="form-field">
			<label for="available_until">Available Until</label>
			<input id="available_until" type="date" required bind:value={formState.available_until}/>
			<p>Beschikbaar tot</p>
		</div>
	</fieldset>

	<fieldset>
		<div class="form-field max-w-72">
			<label for="dynamic_policy_enum">Dynamic Policy</label>
			<select id="dynamic_policy_enum" required bind:value={formState.dynamic_policy_type}>
				{#each AccessPolicyEnumList as policyType}
					<option value={policyType}>{makePretty(AccessPolicyEnum[policyType])}</option>
				{/each}
			</select>
			<p>Dynamic Access Policy keuze</p>
		</div>
	</fieldset>


	{#if formState.dynamic_policy_type === AccessPolicyEnum.always_available}
		<p>Altijd beschikbaar!</p>
	{:else if formState.dynamic_policy_type === AccessPolicyEnum.member_of_group}
		<WhitelistBlacklist bind:formState={formState.dynamic_policy_content}></WhitelistBlacklist>
	{:else if formState.dynamic_policy_type === AccessPolicyEnum.access_key_in_path}
		TODO: Access policy config voor Access Key
	{/if}
</form>