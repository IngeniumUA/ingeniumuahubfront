<script lang="ts">
	import { CoreCardAPI } from '$lib/core_api/card_api';
	import { type CardItemWideI, CardMembershipEnum } from '$lib/models/item/cardI';
	import { makePretty } from '$lib/utilities/style-utilities';

	export let data: {
		card_table: [];
		cards: CardItemWideI[]
	};

	let onlyShowLinked: boolean = false;
	async function refresh() {
		data.card_table = await CoreCardAPI.queryCardTable(new URLSearchParams({}));
		const query = new URLSearchParams({
			limit: '100',
		})
		if (onlyShowLinked) {
			query.set("is_linked", "true")
		}
		data.cards = await CoreCardAPI.queryCards(query);
	}

	function setEditItemIndex(index: number) {

	}
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>Lidkaarten</h1>
		<button class="button button-primary w-24 button-inline" on:click="{refresh}">
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
			<div class="flex justify-between items-center mb-6">
				<label class="inline-flex items-center cursor-pointer my-4">
					<input type="checkbox" class="sr-only peer" bind:checked="{onlyShowLinked}" />
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
					<span class="ms-3 text-sm font-medium text-gray-600">Toon Enkel Gelinkt</span>
				</label>
			</div>

			<h3 class="font-bold">Lijst</h3>
			<table class="ingenium-table">
				<thead>
				<tr>
					<th scope="col"><h4>Item Name</h4></th>
					<th scope="col"><h4>Description</h4></th>
					<th scope="col"><h4>User</h4></th>
					<th scope="col"><h4>Linked ShopItem</h4></th>
				</tr>
				</thead>
				<tbody>
				{#each data.cards as item, index (item.item.id)}
				<tr>
					<th scope="row">
						{item.item.name}
					</th>
					<td>
						{item.item.description.slice(0, Math.min(item.item.description.length, 200))}
					</td>
					<td>
						{#if (item.derived_type.user_uuid === null)}
							Link
						{:else}
							<a class="text-blue-900" href="/staff/user/{item.derived_type.user_uuid}">{item.derived_type.user_email}</a>
						{/if}
					</td>
					<td>
						<a class="text-blue-900" href="/staff/item/{item.derived_type.source_item_id}">{item.derived_type.source_item_name}</a>
					</td>
					<td>
						<button aria-label="edit" on:click={() => setEditItemIndex(index)}>
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
					</td>
				</tr>
				{/each}
				</tbody>
			</table>
		</div>

		<!-- Vertical divider -->
		<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

		<!-- Right hand side, brief statistics-->
		<div class="md:w-1/3">
			<h2 class="font-bold">Overzicht</h2>

			{#each data.card_table as card_count_dict (card_count_dict["member_type"])}
				<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
					<h4 class="text-ingenium-grey-800 font-bold">{makePretty(CardMembershipEnum[card_count_dict["member_type"]])}</h4>
					<p class="text-blue-900 font-bold">Gelinkt: {card_count_dict["user_count"]}</p>
					<p class="text-blue-900 font-bold">Ongelinkt: {card_count_dict["card_count"]}</p>
				</div>
			{/each}
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