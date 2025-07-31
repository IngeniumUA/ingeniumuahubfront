<script lang="ts">
	import { getFlagValue, type HubFlag, HubFlagTypeEnum, HubFlagValueTypeEnum } from '$lib/models/flag/HubFlagI';

	export let data: {
		configFlags: HubFlag[];
		featureFlags: HubFlag[];
	};
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">HubFlag</h1>
		<button class="button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<div class="container mx-auto p-4">
		<h2>Configuration Flags</h2>
		<div class="alert alert-info mb-4 max-w-2xl">
			<p class="alert-text">Configuratie flags zijn <span class="font-bold">vast besliste</span> variabelen in de applicatie.
				Ze geven ons de optie om razendsnel het platform te configureren. Denk aan betalingen uitzetten, sms notifications toelaten, etc.</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-cols-fr">
			{#each data.configFlags as flag (flag.id)}
				<div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
					<h3 class="text-lg font-semibold">
						<span class="text-gray-600 font-semibold">{flag.id}: </span>
						{flag.name}
					</h3>
					<p class="text-sm text-gray-600">
						{HubFlagValueTypeEnum[flag.flag_value_type]} {HubFlagTypeEnum[flag.flag_type]} flag
					</p>

					{#if flag.flag_value_type === HubFlagValueTypeEnum.bool}
						<!-- Taken from https://flowbite.com/docs/forms/toggle/-->
						<label class="inline-flex items-center cursor-pointer my-4">
							<input type="checkbox" value={getFlagValue(flag)} class="sr-only peer">
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
						{getFlagValue(flag)}
					{:else if flag.flag_value_type === HubFlagValueTypeEnum.string}
						{getFlagValue(flag)}
					{:else if flag.flag_value_type === HubFlagValueTypeEnum.dict}
						{flag.value}
					{:else}
						Error
					{/if}
				</div>
			{/each}
		</div>
	</div>

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
</main>