<script lang="ts">
	import { makePretty } from '$lib/utilities/style-utilities';

	async function refresh() {
		// todo
	}

	const notificationTypes = ["app_notification", "sms_notification", "email_notification"]
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>Notification Items</h1>
		<button class="button button-primary w-24 button-inline" on:click="{refresh}">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<div class="alert alert-info mb-4 max-w-3xl">
		<p class="alert-text">Een <span class="font-bold">Notification Item</span> is een derived type van een Item. We gebruiken ze om berichten (via verschillende vormen) te beheren die we naar gebruikers sturen.
			<br>Merk op dat we <span class="font-bold">interactions</span> gebruiken om aan te duiden wie welke berichten willen ontvangen.
		Volgens de wet moeten we bijhouden wie er op welk moment heeft toegezegd op wat (met een default of nee), daarom dat het wat complexer is nodig.</p>
	</div>

	<h2>Overzicht</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-cols-fr">
		{#each notificationTypes as notificationType}
			<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
				<h3 class="text-ingenium-grey-800 font-bold">{makePretty(notificationType)}:</h3>
				<p class="text-blue-900 font-bold">Active Count: 0</p>
				<p class="text-blue-900 font-bold">Subscribed: 0</p>
			</div>
		{/each}
	</div>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<h2>Table</h2>
	<h3 class="font-bold">Filters</h3>
	<div class="flex justify-between items-center mb-6">
		notification_type_dropdown, has_active_interactions, pagination
	</div>

	<h3 class="font-bold">Lijst</h3>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<h2>Dashboard statistics</h2>
	<div class="alert alert-info mb-4 max-w-2xl">
		<p class="alert-text"><a href="dashboard">Dashboard app</a> toont interactions met de Notification items.
	</div>
</main>