<script lang="ts">
	import { type HubFlag, HubFlagTypeEnum, HubFlagValueTypeEnum } from '$lib/models/flag/HubFlagI';
	import { makePretty } from '$lib/utilities/style-utilities';
	import { CoreFlagAPI } from '$lib/core_api/flag_api';
	import { handleRequest } from '$lib/utilities/httpUtilities';
	import { toast } from '@zerodevx/svelte-toast'

	let { hubFlag }: { hubFlag: HubFlag } = $props();

	let editModal: boolean = $state(false);
	async function toggleModal() {
		editModal = !editModal;
	}

	let flagPutError: string | null = $state(null);
	let loadingHTTP: boolean = false;
	async function updateFlag(hubflag: HubFlag) {
		if (loadingHTTP) {return}
		loadingHTTP = true;

		// Assigning correct list
		const flagPatch: Pick<HubFlag, 'value' | 'flag_value_type'> = {
			value: hubflag.value,
			flag_value_type: hubflag.flag_value_type
		};

		// Performing request
		try {
			hubflag = await CoreFlagAPI.patchFlag(hubflag.name, flagPatch).catch(handleRequest);
			flagPutError = null;
			toast.push("Flag updated!", {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(72,187,120,0.9)',
					'--toastBarBackground': '#2F855A'
				}
			})
		} catch (error) {
			flagPutError = error instanceof Error ? error.message : 'Error submitting form';
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}
	let deleteFlagBuffer: boolean = $state(false);
	async function deleteFlag() {
		if (!deleteFlagBuffer) {
			deleteFlagBuffer = true;
		}
	}
</script>

<div class="bg-white p-4 rounded-lg
							max-w-xs min-h-48
							shadow-md hover:shadow-lg transition-shadow">
	<div class="flex justify-between items-center">
		<h3 class="font-semibold">
			<span class="text-gray-600 font-semibold">{hubFlag.id}: </span>
			{makePretty(hubFlag.name)}
		</h3>
		<button onclick={toggleModal} aria-label="edit">
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
	</div>
	<p class="text-sm text-gray-600">
		{HubFlagValueTypeEnum[hubFlag.flag_value_type]} {HubFlagTypeEnum[hubFlag.flag_type]} flag
	</p>

	<!-- Edit Value form thing -->
	<form class="ingenium-form w-3/5">
		<fieldset>
			<div class="form-field col-span-4">
				{#if hubFlag.flag_value_type === HubFlagValueTypeEnum.bool}
					<!-- Taken from https://flowbite.com/docs/forms/toggle/  -->
					<label class="inline-flex items-center cursor-pointer my-4">
						<input type="checkbox"
									 class="hidden peer"
									 bind:checked={hubFlag.value}>
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
						<span class="ms-3 text-sm font-medium text-gray-600">{#if (hubFlag.value)}Enabled{:else}Disabled{/if}</span>
					</label>
				{:else if hubFlag.flag_value_type === HubFlagValueTypeEnum.int}
					<input name="value" type="number" required bind:value={hubFlag.value}/>
				{:else if hubFlag.flag_value_type === HubFlagValueTypeEnum.string}
					<input name="value" type="text" required bind:value={hubFlag.value}/>
				{:else if hubFlag.flag_value_type === HubFlagValueTypeEnum.dict}
					Object
				{:else}
					Error
				{/if}
			</div>
		</fieldset>
	</form>

	<!-- Bottom Buttons. Remove button is only shown for feature flags -->
	<div class="flex justify-between items-center">
		<button class="button button-primary w-24 button-inline"
						onclick={() => {updateFlag(hubFlag)}}>
			<span class="text-white">Update</span>
		</button>
		{#if hubFlag.flag_type === HubFlagTypeEnum.feature}
			<button onclick={deleteFlag} class="button button-danger w-24 button-inline">
				<span class="text-white">
					{#if (deleteFlagBuffer)}
						Sure?
					{:else}
						Remove
					{/if}
				</span>
			</button>
		{/if}
	</div>

	<!-- Error message -->
	{#if flagPutError !== null}
		<p class="error-message">{flagPutError}</p>
	{/if}
</div>
