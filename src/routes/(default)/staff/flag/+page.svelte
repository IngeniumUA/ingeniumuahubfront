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
	import { makePretty } from '$lib/utilities/style-utilities';
	import { CoreFlagAPI } from '$lib/core_api/flag_api';
	import { handleRequest } from '$lib/utilities/httpUtilities';

	async function refresh() {
		data.configFlags = await CoreFlagAPI.queryFlag(new URLSearchParams({
			flag_type: '1',
			limit: '100'
		}));
		data.featureFlags = await CoreFlagAPI.queryFlag(new URLSearchParams({
			flag_type: '2',
			limit: '100'
		}));
		flagPutError = null;
	}
	
	function handleCheckboxChange(event: Event, flag: { value: boolean | string | number }) {
		const target = event.target as HTMLInputElement;
		flag.value = target.checked;
	}

	let loadingHTTP: boolean = false;
	/**
	 * Perform PUT for flag object
	 * @param flag
	 */
	let flagPutError: string | null = null
	async function updateFlag(flagIndex: number, flag_type: HubFlagTypeEnum) {
		if (loadingHTTP) {return}
		loadingHTTP = true;

		// Assigning correct list
		let flags = flag_type === HubFlagTypeEnum.configuration ? data.configFlags: data.featureFlags;
		if (flags.length <= flagIndex) {
			loadingHTTP = false;
			return
		}
		const flagPatch: Pick<HubFlag, 'value' | 'flag_value_type'> = {
			value: flags[flagIndex].value,
			flag_value_type: flags[flagIndex].flag_value_type
		};

		// Performing request
		try {
			flags[flagIndex] = await CoreFlagAPI.patchFlag(flags[flagIndex].name, flagPatch).catch(handleRequest);
			flagPutError = null;
		} catch (error) {
			flagPutError = error instanceof Error ? error.message : 'Error submitting form';
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

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
		{#if (flagPutError !== null)}
			<p class="error-message">{flagPutError}</p>
		{/if}

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-cols-fr">
			{#each data.configFlags as flag, i (flag.id)}
				<div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
					<div class="flex justify-between items-center">
					<h3 class="font-semibold">
						<span class="text-gray-600 font-semibold">{flag.id}: </span>
						{makePretty(flag.name)}
					</h3>
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
					</div>
					<p class="text-sm text-gray-600">
						{HubFlagValueTypeEnum[flag.flag_value_type]} {HubFlagTypeEnum[flag.flag_type]} flag
					</p>

					{#if flag.flag_value_type === HubFlagValueTypeEnum.bool}
						<!-- Taken from https://flowbite.com/docs/forms/toggle/  -->
						<label class="inline-flex items-center cursor-pointer my-4">
							<input type="checkbox"
										 class="sr-only peer"
										 checked={flag.value ? true : false}
										 on:change={(e) => handleCheckboxChange(e, flag)}>
							<div class="
							relative w-11 h-6
							bg-gray-200 dark:bg-gray-700
							rounded-full
							peer-checked:bg-blue-900 dark:peer-checked:bg-blue-900
							after:content-['']
							after:absolute after:top-[2px] after:start-[2px]
							after:w-5 after:h-5
							after:bg-white after:rounded-full
							after:transition-transform
							peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
							"></div>
							<span class="ms-3 text-sm font-medium text-gray-600">Toggle</span>
						</label>
					{:else if flag.flag_value_type === HubFlagValueTypeEnum.int}
						{flag.value}
					{:else if flag.flag_value_type === HubFlagValueTypeEnum.string}
						{flag.value}
					{:else if flag.flag_value_type === HubFlagValueTypeEnum.dict}
						{flag.value}
					{:else}
						Error
					{/if}

					<div class="flex justify-between items-center">
						{#if flag.flag_type === HubFlagTypeEnum.feature}
							<button class="button button-danger w-24 button-inline">
								<span class="text-white">Remove</span>
							</button>
						{/if}
						<button class="button button-primary w-24 button-inline"
						on:click={() => {updateFlag(i, HubFlagTypeEnum.configuration)}}>
							<span class="text-white">Update</span>
						</button>
					</div>
				</div>
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
			<div>
				{ flag.name }
			</div>
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

			<form method="POST"
						on:submit={handleSubmit}
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