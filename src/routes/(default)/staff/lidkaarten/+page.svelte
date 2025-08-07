<script lang="ts">

</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>Lidkaarten</h1>
		<button class="button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<div class="alert alert-info mb-4 max-w-2xl">
		<p class="alert-text">Lidkaarten zijn zelf ook een derived type van HubItem. Als belangrijkste velden hebben ze het type lidkaart, een user veld (indien gelinkt) en een verwijzing naar een HubShopItem.
			Dat HubShopItem is hoe lidkaarten aangekocht worden, en ook de verbinding met hoe een persoon 'lid' is.</p>
	</div>

	<div class="container flex flex-col md:flex-row">
		<!-- Left hand side, list of vacatures -->
		<div class="md:w-2/3">
			<h2>Actieve Lidkaarten</h2>

			<h3 class="font-bold">Filters</h3>

			<h3 class="font-bold">Lijst</h3>
		</div>

		<!-- Vertical divider -->
		<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

		<!-- Right hand side, brief statistics-->
		<div class="md:w-1/3">
			<h2 class="font-bold">Overzicht</h2>

			<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
				<h4 class="text-ingenium-grey-800 font-bold">Lid</h4>
				<p class="text-blue-900 font-bold">Gelinkt: 0</p>
				<p class="text-blue-900 font-bold">Ongelinkt: 0</p>
			</div>

			<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
				<h4 class="text-ingenium-grey-800 font-bold">Steunend</h4>
				<p class="text-blue-900 font-bold">Gelinkt: 0</p>
				<p class="text-blue-900 font-bold">Ongelinkt: 0</p>
			</div>
		</div>
	</div>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<h2>Interactions Dashboard</h2>
	<div class="alert alert-info mb-4 max-w-2xl">
		<p class="alert-text"><a href="dashboard">Dashboard app</a> toont een interactie tussen een gebruiker en een lidkaart. 90% van de gevallen is dit wanneer die wordt gescant. Dit alles per timestamp.</p>
	</div>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
	<h2>Lidkaarten in bulk beheren</h2>
	<div class="alert alert-info mb-4 max-w-2xl">
		<p class="alert-text">Voor ingrijpende bulk operaties, vooral rond <a href="https://wiki.ingeniumua.be/staff/start_academiejaar">start academiejaar</a>.</p>
	</div>
</main>