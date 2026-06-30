<script lang="ts">
	const BASE_URL = "https://ingeniumuapublic.blob.core.windows.net/ingeniumuaimages/praesidium/years";

	// Generate a list of years for the dropdown
	function getAvailableYears() {
		const now = new Date();
		const currentYear = now.getFullYear();
		const currentMonth = now.getMonth();
		const latestStartYear = currentMonth < 6 ? currentYear - 1 : currentYear;

		const years = [];
		// We go +1 into the future so you can prepare the upcoming year before July 1st
		for (let y = latestStartYear + 1; y >= 2018; y--) {
			years.push(`${y}-${y + 1}`);
		}
		return years;
	}

	const years = getAvailableYears();

	const defaultJson = '[\n  {\n    "group_name": "Voorbeeld",\n    "members": []\n  }\n]';

	// Svelte 5 Runes for reactivity
	let selectedYear = $state(years[0]);
	let jsonInput = $state(defaultJson);

	let isFetching = $state(false);
	let isSubmitting = $state(false);
	let statusMessage = $state('');
	let isError = $state(false);
	let fetchMessage = $state('');

	// Svelte 5 effect: runs on mount AND whenever selectedYear changes
	$effect(() => {
		async function fetchExistingData() {
			isFetching = true;
			fetchMessage = 'Data aan het ophalen...';
			statusMessage = ''; // Clear any previous upload messages

			// Convert "2023-2024" to "23-24" for the blob URL
			const [startYear, endYear] = selectedYear.split('-');
			const shortYear = `${startYear.slice(-2)}-${endYear.slice(-2)}`;

			try {
				const response = await fetch(`${BASE_URL}/praesidium_${shortYear}.json`);

				if (response.ok) {
					const data = await response.json();
					// Pretty-print the fetched JSON with 2 spaces for easy editing
					jsonInput = JSON.stringify(data, null, 2);
					fetchMessage = 'Bestaande configuratie ingeladen.';
				} else if (response.status === 404) {
					// File doesn't exist, reset to default
					jsonInput = defaultJson;
					fetchMessage = 'Nog geen configuratie voor dit jaar. Begin met een schone lei.';
				} else {
					throw new Error('Onverwachte fout bij inladen.');
				}
			} catch (e) {
				jsonInput = defaultJson;
				fetchMessage = 'Fout bij het ophalen van data. Azure onbereikbaar?';
			} finally {
				isFetching = false;
			}
		}

		fetchExistingData();
	});

	async function handleUpload(event: Event) {
		event.preventDefault();
		isSubmitting = true;
		statusMessage = '';
		isError = false;

		// 1. Validate JSON format on the frontend before sending
		let parsedJson;
		try {
			parsedJson = JSON.parse(jsonInput);
		} catch (e) {
			isError = true;
			statusMessage = 'Ongeldige JSON. Controleer op ontbrekende komma\'s of haakjes.';
			isSubmitting = false;
			return;
		}

		// 2. Send the PUT request to the FastAPI backend
		try {
			// NOTE: Update this URL to match your backend's actual address/port
			const response = await fetch(`http://localhost:8000/praesidium/${selectedYear}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				// We stringify the parsed JSON to ensure it's minified and clean
				body: JSON.stringify(parsedJson)
			});

			if (!response.ok) {
				throw new Error(`Upload mislukt met status: ${response.status}`);
			}

			statusMessage = `Data succesvol geüpload naar Azure voor ${selectedYear}!`;
			isError = false;
		} catch (e: any) {
			isError = true;
			statusMessage = e.message || 'Kan geen verbinding maken met de backend.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<main class="ingenium-container relative max-w-4xl p-6" id="main-content">
	<h1 class="text-3xl font-bold mb-2">Praesidium Configureren</h1>
	<p class="mb-8 text-gray-600">
		Selecteer het academiejaar en bewerk de JSON array. Deze data wordt direct geüpload.<br>
		Belangrijk, <span class="font-bold text-red-600">er is geen verschil tussen staging en productie</span>, niet zomaar aanpassen dus :)
	</p>

	<form onsubmit={handleUpload} class="flex flex-col gap-6">

		<div class="flex flex-col gap-2">
			<label for="year-select" class="font-semibold text-gray-800">Academiejaar</label>
			<select
				id="year-select"
				bind:value={selectedYear}
				disabled={isFetching || isSubmitting}
				class="p-2 border border-gray-300 rounded-md bg-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
			>
				{#each years as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-col gap-2">
			<div class="flex justify-between items-end">
				<label for="json-input" class="font-semibold text-gray-800">Praesidium JSON Payload</label>
				<span class="text-sm text-gray-500 italic">{fetchMessage}</span>
			</div>
			<textarea
				id="json-input"
				bind:value={jsonInput}
				disabled={isFetching}
				class="w-full h-96 p-4 font-mono text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y disabled:opacity-50"
				placeholder="Plak hier je JSON array..."
			></textarea>
		</div>

		{#if statusMessage}
			<div class={`p-4 rounded-md font-medium ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
				{statusMessage}
			</div>
		{/if}

		<div>
			<button
				type="submit"
				disabled={isFetching || isSubmitting}
				class="button button-primary"
			>
				{isSubmitting ? 'Bezig met uploaden...' : 'Uploaden'}
			</button>
		</div>

	</form>
</main>