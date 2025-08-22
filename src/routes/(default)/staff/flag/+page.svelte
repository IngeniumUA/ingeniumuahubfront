<script lang="ts">
	import {
		type HubFlag,
		HubFlagTypeEnum,
		HubFlagTypeList,
		HubFlagValueTypeEnum,
		HubFlagValueTypeList
	} from '$lib/models/flag/HubFlagI';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';
	import { CoreFlagAPI } from '$lib/core_api/flag_api';
	import FlagCard from "$lib/components/staff/FlagCard.svelte"

	async function refresh() {
		data.configFlags = await CoreFlagAPI.queryFlag(new URLSearchParams({
			flag_type: '1',
			limit: '100'
		}));
		data.featureFlags = await CoreFlagAPI.queryFlag(new URLSearchParams({
			flag_type: '2',
			limit: '100'
		}));
	}

	let loadingHTTP: boolean = false;
	function toggleAddNew() {
		addingNew = !addingNew;
	}
	let addingNew = false;
	let newFlagError: string | null = null;
	// Bindings
	let newFlagName: string = '';
	let newFlagType: HubFlagTypeEnum = HubFlagTypeEnum.configuration;
	let newFlagValueType = HubFlagValueTypeEnum.bool;
	// Might be terribly inefficient but hey, we're still learning
	let booleanNewFlagValue: boolean = false;
	let numberNewFlagValue: number = 0;
	let stringNewFlagValue: boolean = false;

	async function handleSubmit() {
		// Resetting error and preventing double POST with flag
		newFlagError = null;
		loadingHTTP = true;

		// Parsing flag
		let parsedValue: boolean | number | string;
		switch (newFlagValueType) {
			case HubFlagValueTypeEnum.bool: {
				parsedValue = booleanNewFlagValue
				break;
			}
			case HubFlagValueTypeEnum.int: {
				parsedValue = numberNewFlagValue;
				break;
			}
			case HubFlagValueTypeEnum.string: {
				parsedValue = stringNewFlagValue;
				break;
			}
			case HubFlagValueTypeEnum.dict: {
				newFlagError = "Dict nog niet geimplementeerd";
				loadingHTTP = false;
				return;
			}
			default: {
				loadingHTTP = false;
				return
			}
		}

		const flagPost: Omit<HubFlag, 'id'> = {
			name: newFlagName,
			flag_type: newFlagType,
			flag_value_type: newFlagValueType,
			value: parsedValue
		};

		try {
			const response = await fetch(`${PUBLIC_API_URL}/flag`, {
				method: 'POST',
				headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
				body: JSON.stringify(flagPost)
			});
			if (response.ok) {
				toggleAddNew();
			} else {
				newFlagError = `Failed to create flag: ${await response.text()}`;
			}
		} catch (error) {
		newFlagError = error instanceof Error ? error.message : 'Error submitting form';
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	export let data: {
		configFlags: HubFlag[];
		featureFlags: HubFlag[];
	};
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>HubFlag</h1>
		<button class="button button-primary w-24 button-inline" on:click={refresh}>
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<div class="container">
		<h2>Configuration Flags</h2>
		<div class="alert alert-info mb-4 max-w-2xl">
			<p class="alert-text">Configuratie flags zijn <span class="font-bold">vast besliste</span> variabelen in de applicatie.
				Ze geven ons de optie om razendsnel het platform te configureren. Denk aan betalingen uitzetten, sms notifications toelaten, etc.</p>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-cols-fr">
			{#each data.configFlags as flag (flag.id)}
				<FlagCard hubFlag="{flag}"></FlagCard>
			{/each}
		</div>
	</div>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	<div class="container">
		<h2>Feature Flags</h2>
		<div class="alert alert-info mb-4 max-w-2xl">
			<p class="alert-text">Bij het ontwikkelen van nieuwe features is het vaak handig om die snel aan en af te kunnen zetten als een test.
				Feature flags geven ons de optie om met de klik van een knop een nieuwe feature te activeren.</p>
		</div>
		{#each data.featureFlags as flag (flag.id)}
			<FlagCard hubFlag="{flag}"></FlagCard>
		{/each}
	</div>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	<div class="container">
		{#if addingNew}
			<h2>Adding new</h2>
			<div class="alert alert-info mb-4 max-w-2xl">
				<p class="alert-text">Flags toevoegen is een operatie die je niet kan terugdraaien. Zeker configuration flags, zorg dat je weet wat je doet :).</p>
			</div>

			<form on:submit={handleSubmit}
						class="ingenium-form">
				<fieldset>
					<div class="form-field">
						<label for="newFlagName">Name</label>
						<input id="newFlagName" type="text" required bind:value={ newFlagName }/>
						<p>Unieke naam voor de flag. Let op, zelfs als je een flag uitschakelt kan je die naam niet meer gebruiken.</p>
					</div>
				</fieldset>

				<fieldset>
					<div class="form-field col-span-4">
						<label for="newFlagType">Flag Type</label>
						<select id="newFlagType" required bind:value={ newFlagType }>
							{#each HubFlagTypeList as flagType}
								<option value={ flagType }>{ HubFlagTypeEnum[flagType] }</option>
							{/each}
						</select>
						<p>Welke soort flag het is. Zie hoger op de pagina voor uitleg.</p>
					</div>
				</fieldset>

				<fieldset>
					<div class="form-field col-span-4">
						<label for="newFlagValueType">Flag Value Type</label>
						<select id="newFlagValueType" required bind:value={ newFlagValueType }>
							{#each HubFlagValueTypeList as flagValueType}
								<option value={ flagValueType }>{ HubFlagValueTypeEnum[flagValueType] }</option>
							{/each}
						</select>
						<p>De waarde van de flag kan verschillende vormen aannemen.</p>
					</div>
				</fieldset>

				<fieldset>
					<div class="form-field col-span-4">
						<label for="newFlagValue">Flag Value</label>
						{#if newFlagValueType === HubFlagValueTypeEnum.bool}
							<input id="newFlagValue" name="value" type="checkbox" bind:checked={booleanNewFlagValue}/>
						{:else if newFlagValueType === HubFlagValueTypeEnum.int}
							<input id="newFlagValue" name="value" type="number" required bind:value={numberNewFlagValue}/>
						{:else if newFlagValueType === HubFlagValueTypeEnum.string}
							<input id="newFlagValue" name="value" type="text" required bind:value={stringNewFlagValue}/>
						{:else if newFlagValueType === HubFlagValueTypeEnum.dict}
							Object
						{:else}
							Error
						{/if}
					</div>
				</fieldset>

				<div class="flex gap-4 items-center mb-6">
					<button type="submit" class="button button-primary w-24 button-inline"
									disabled={loadingHTTP}>
						<span class="text-white">Submit</span>
					</button>
					<button class="button button-primary w-24 button-inline"
									disabled={loadingHTTP}
									on:click={toggleAddNew}>
						<span class="text-white">Cancel</span>
					</button>
				</div>
			</form>
		{:else}
			<button class="button button-primary w-24 button-inline"
							on:click={toggleAddNew}>
				<span class="text-white">Add New</span>
			</button>
		{/if}
	</div>
	{#if newFlagError !== null}
		<p class="error-message">{newFlagError}</p>
	{/if}
</main>