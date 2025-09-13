<script lang="ts">
	import { CoreCardAPI } from '$lib/core_api/card_api';
	import { CardMembershipEnum } from '$lib/models/item/cardI';
	import { makePretty } from '$lib/utilities/style-utilities';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import type { CardI } from '$lib/models/cardI';
	import Modal from '$lib/components/layout/modal.svelte';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();

	let cardTable = $state(data.card_table)
	let cards = $state(data.cards)

	let onlyShowLinked: boolean = $state(false);
	let loadingHTTP: boolean = $state(false)
	async function refresh() {
		cardTable = await CoreCardAPI.queryCardTable(new URLSearchParams({}));
		const query = new URLSearchParams({
			limit: '100',
		})
		if (onlyShowLinked) {
			query.set("is_linked", "true")
		}
		cards = await CoreCardAPI.queryCards(query);
		successToast("Refreshed")
	}


	/**
	 * Edit Modal Code
	 */
	let putError: Error | null = $state(null)
	let editSelectedIndex: null | number = $state(null);
	let editSelected: CardI | null = $state(null);
	let showEdit: boolean = $state(false);
	function setEditItemIndex(index: number) {
		putError = null;
		editSelectedIndex = index;
		if (editSelectedIndex !== null && editSelectedIndex < cards.length) {
			editSelected = cards.at(editSelectedIndex)!;
			showEdit = true;
		}
	}

	async function handlePut() {
		// Preliminary checks
		if (editSelected === null) {
			putError = Error("Card is null?")
			return;
		}
		if (loadingHTTP) return;
		loadingHTTP = true;
		// Perform put request
		try {
			await CoreCardAPI.putCard(editSelected)
			successToast("Updated!")
		} catch (error) {
			putError = error instanceof Error ? error: Error(`Error during PUT ${error}`);
			failedToast("Error during PUT");
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1>Lidkaarten</h1>
		<button class="button button-primary w-24 button-inline" onclick={refresh}>
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
					<th scope="col"><h4>Card UUID</h4></th>
					<th scope="col"><h4>Card Nr</h4></th>
					<th scope="col"><h4>Linked User</h4></th>
					<th scope="col"><h4>Member Type</h4></th>
					<th scope="col"><h4>Edit</h4></th>
				</tr>
				</thead>
				<tbody>
				{#each cards as card, index (card.card_uuid)}
				<tr>
					<th scope="row">
						{card.card_uuid.slice(0, 6)}
					</th>
					<td>
						{card.card_nr}
					</td>
					<td>
						{#if (card.user_uuid === null)}
							Niet gelinkt
						{:else}
							<a class="text-blue-900" href="/staff/user/{card.user_uuid}">{card.user_email}</a>
						{/if}
					</td>
					<td>
						{makePretty(CardMembershipEnum[card.member_type])}
					</td>
					<td>
						<button aria-label="edit" onclick={() => setEditItemIndex(index)}>
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

			{#each cardTable as card_count_dict (card_count_dict["member_type"])}
				<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
					<h4 class="text-ingenium-grey-800 font-bold">{makePretty(CardMembershipEnum[card_count_dict["member_type"]])}</h4>
					<p class="text-blue-900 font-bold">Gelinkt: {card_count_dict["user_count"]}</p>
					<p class="text-blue-900 font-bold">Ongelinkt: {card_count_dict["card_count"]}</p>
				</div>
			{/each}
		</div>
	</div>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	<h2>Lidkaarten in bulk beheren</h2>
	<div class="alert alert-info mb-4 max-w-2xl">
		<p class="alert-text">Voor ingrijpende bulk operaties, vooral rond <a href="https://wiki.ingeniumua.be/staff/start_academiejaar">start academiejaar</a>.</p>
	</div>
</main>

{#if editSelectedIndex !== null && editSelectedIndex >= 0 && editSelectedIndex < cards.length}
	<Modal title="Lidkaart bewerken" maxWidth="max-w-5xl" bind:isOpen={ showEdit } closable={ true }>
		{#snippet children()}
			<div class="p-2 flex justify-between items-center">
				<button type="button" class="button button-primary w-24 button-inline"
								disabled={loadingHTTP}
								onclick={handlePut}>
					<span class="text-white">Update</span>
				</button>
			</div>
		{/snippet}
	</Modal>
{/if}
