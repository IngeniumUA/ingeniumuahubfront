<script lang="ts">
	import { CoreCardAPI } from '$lib/core_api/card_api';
	import { CardMembershipEnum, CardTypeEnum } from '$lib/models/item/cardI';
	import { makePretty } from '$lib/utilities/style-utilities';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import type { CardI } from '$lib/models/cardI';
	import Modal from '$lib/components/layout/modal.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();

	let cardTable = $state(data.card_table)
	let cards = $state(data.cards)
	let cardCountAvailable = $state(data.cardCountAvailable)
	let cardCountNotAvailable = $state(data.cardCountNotAvailable)
	let cardCount = $state(data.cardCount)

	let onlyShowLinked: boolean = $state(false);
	let onlyShowAvailable: boolean = $state(true);
	let loadingHTTP: boolean = $state(false)

	/**
	 * Query logic
	 */
	interface QueryFormI {
		user_email: string | null;
		card_nr: number | null;
		card_uuid: string | null;
	}
	let queryForm: QueryFormI = $state({
		user_email: null,
		card_nr: null,
		card_uuid: null,
	})
	let baseQueryParam = $derived.by(() => {
		let queryParam = new URLSearchParams({
			limit: '300',
		});
		if (onlyShowLinked) {
			queryParam.set("is_linked", "true")
		}
		if (onlyShowAvailable) {
			queryParam.set("available", "true")
		}
		if (queryForm.user_email !== null && queryForm.user_email !== "") queryParam.set('user', queryForm.user_email);
		if (queryForm.card_nr !== null) queryParam.set('card_nr', queryForm.card_nr.toString());
		if (queryForm.card_uuid !== null) queryParam.set('card_uuid', queryForm.card_uuid.toString());

		return queryParam;
	})

	async function refresh() {
		cardTable = await CoreCardAPI.queryCardTable(null, new URLSearchParams({}));

		cards = await CoreCardAPI.queryCards(null, baseQueryParam);
		let queryParam = baseQueryParam;

		queryParam.set('available', "true")
		cardCountAvailable = await CoreCardAPI.countCards(null, queryParam);

		queryParam.set('available', "false")
		cardCountNotAvailable = await CoreCardAPI.countCards(null, queryParam);
		cardCount = cardCountAvailable + cardCountNotAvailable;

		successToast("Refreshed")
	}

	/**
	 * Edit Modal Code
	 */
	let putError: Error | null = $state(null)
	let editSelectedIndex: null | number = $state(null);
	let editSelected: CardI | null = $state(null);
	let showEdit: boolean = $state(false);

	interface FormState {
		cardNr: number;
		user_email: string | null;
		linked_group: string | null
	}
	let editForm: FormState = $state({
		cardNr: 0,
		user_email: "",
		linked_group: null
	})

	function setEditItemIndex(index: number) {
		putError = null;
		editSelectedIndex = index;
		if (editSelectedIndex !== null && editSelectedIndex < cards.length) {
			editSelected = cards.at(editSelectedIndex)!;

			editForm.cardNr = editSelected.card_nr;
			editForm.user_email = editSelected.user_email;
			editForm.linked_group = editSelected.linked_group

			showEdit = true;
		}
	}

	async function handlePatch() {
		// Preliminary checks
		if (editSelected === null) {
			putError = Error("Card is null?")
			return;
		}
		const patchObj: Partial<FormState> = {}
		if (editForm.user_email !== editSelected.user_email) {
			if (editForm.user_email === "") editForm.user_email = null;
			patchObj["user_email"] = editForm.user_email;
		}
		if (editForm.linked_group !== editSelected.linked_group) {
			if (editForm.linked_group === "") editForm.linked_group = null;
			patchObj["linked_group"] = editForm.linked_group;
		}
		if (editForm.cardNr !== editSelected.card_nr) patchObj["cardNr"] = editForm.cardNr;

		if (loadingHTTP) return;
		loadingHTTP = true;
		// Perform put request
		try {
			cards[editSelectedIndex!] = await CoreCardAPI.patchCard(editSelected.card_uuid, patchObj)
			successToast("Updated!")
		} catch (error) {
			putError = error instanceof Error ? error: Error(`Error during PUT ${error}`);
			failedToast("Error during PUT");
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	/**
	 * Bulk importing state and functions
	 */
	let showBulkImport: boolean = $state(false);
	let files: FileList | undefined = $state()
	let uploadError: Error | null = $state(null);

	async function handleUpload() {
		if (loadingHTTP) return;
		loadingHTTP = true;
		if (files === undefined) return;

		try {
			const formData = new FormData();
			formData.append('file', files[0]);
			const res = await fetch(`${PUBLIC_API_URL}/card/import`, {
				method: 'POST',
				headers: getAuthorizationHeaders(null),
				body: formData
			});
			if (res.ok) {
				showBulkImport = false;
				successToast("Imported!")
				return res.json();
			} else {
				const text = await res.text();
				uploadError = new Error(`Failed to Upload: ${text}`);
			}
		} catch (error) {
			uploadError = error instanceof Error ? error : Error(`Error during Upload: ${error}`);
		} finally {
			loadingHTTP = false;
		}
	}

	/**
	 * Patching availability
	 */
	async function toggleAvailable(cardIndex: number, card: CardI) {
		cards[cardIndex] = await CoreCardAPI.setAvailable(card, !card.availability.available);
		successToast("Updated!")
	}

	/**
	 * Bulk patch
	 */
	async function bulkPatch() {
		if (loadingHTTP) return;
		loadingHTTP = true;

		const patchObj = {
			available: false
		}

		try {
			const res = await fetch(`${PUBLIC_API_URL}/card/bulk`, {
				method: 'PATCH',
				headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
				body: JSON.stringify(patchObj)
			});
			if (res.ok) {
				showBulkImport = false;
				successToast("Bulk patched!")
				await refresh();
			} else {
				const text = await res.text();
				failedToast(`Failed to patch: ${text}`)
			}
		} catch (error) {
			failedToast(`Failed to patch: ${error instanceof Error ? error : Error(`Error during Patch: ${error}`)}`);
		} finally {
			loadingHTTP = false;
		}
	}
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center gap-2 mb-6">
		<h1>Lidkaarten</h1>
		<button class="ml-auto button button-primary w-24 button-inline" onclick={() => {showBulkImport = true}}>
			<span class="text-white">Import</span>
		</button>
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
		<div class="md:flex-[2] order-3 md:order-1">
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
				<label class="inline-flex items-center cursor-pointer my-4">
					<input type="checkbox" class="sr-only peer" bind:checked="{onlyShowAvailable}" />
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
					<span class="ms-3 text-sm font-medium text-gray-600">Only show Available</span>
				</label>
			</div>

			<h3 class="font-bold">Lijst</h3>
			<table class="ingenium-table">
				<thead>
				<tr>
					<th scope="col"><div>
						<h4>Card UUID</h4>
						<input type="text" placeholder="uuid" bind:value={queryForm.card_uuid}>
					</div></th>
					<td class="form-field"><div>
						<h4>Card Nr</h4>
						<input class="max-w-20" type="text" placeholder="Card nr" bind:value={queryForm.card_nr}>
					</div></td>
					<td class="form-field"><div>
						<h4>Linked User</h4>
						<input type="email" placeholder="Email" bind:value={queryForm.user_email}>
					</div></td>
					<td><h4>Member Type</h4></td>
					<td><h4>Edit</h4></td>
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
						<label class="inline-flex items-center cursor-pointer my-4">
							<input type="checkbox" class="sr-only peer"
										 bind:checked={card.availability.available}
										 onclick="{() => toggleAvailable(index, card)}"
							>
							<div class="relative w-11 h-6 bg-red-900 dark:bg-red-900 rounded-full peer-checked:bg-green-900 dark:peer-checked:bg-green-900 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
							<span class="ms-3 text-sm font-medium text-gray-600">
														{#if card.availability.available}Beschikbaar{:else}Niet Beschikbaar{/if}
													</span>
						</label>
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
		<div class="order-2 hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

		<!-- Right hand side, brief statistics-->
		<div class="md:flex-[1] order-1 md:order-3">
			<h2 class="font-bold">Overzicht</h2>

			{#each cardTable as card_count_dict (card_count_dict["member_type"])}
				<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
					<h4 class="text-ingenium-grey-800 font-bold">{makePretty(CardMembershipEnum[card_count_dict["member_type"]])}</h4>
					<p class="text-blue-900 font-bold">Gelinkt: {card_count_dict["user_count"]}</p>
					<p class="text-blue-900 font-bold">Ongelinkt: {card_count_dict["card_count"]}</p>
				</div>
			{/each}

			<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
				<h4 class="text-ingenium-grey-800 font-bold">Totaal</h4>
				<p class="text-blue-900 font-bold">Available: {cardCountAvailable}</p>
				<p class="text-blue-900 font-bold">Niet Available: {cardCountNotAvailable}</p>
				<p class="text-blue-900 font-bold">All: {cardCount}</p>
			</div>
		</div>
	</div>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	<h2>Lidkaarten in bulk beheren</h2>
	<div class="alert alert-info mb-4 max-w-2xl">
		<p class="alert-text">Voor ingrijpende bulk operaties, vooral rond <a href="https://wiki.ingeniumua.be/staff/start_academiejaar">start academiejaar</a>.</p>
	</div>
	<button class="button button-primary button-inline" onclick={bulkPatch}>
		<span class="text-white">De-activate all current</span>
	</button>
</main>

{#if editSelectedIndex !== null && editSelectedIndex >= 0 && editSelectedIndex < cards.length && editSelected !== null}
	<Modal title="Lidkaart bewerken" maxWidth="max-w-4xl" bind:isOpen={ showEdit } closable={ true }>
		{#snippet children()}
			<article class="m-4">
				<div class="flex flew-row">
					<div class="flex-1">
						<h3 class="font-bold pb-2">Lidkaart Info</h3>

						<h4 class="pl-3 text-blue-900 font-bold">UUID: <span class="text-ingenium-grey-800 font-bold">{editSelected?.card_uuid}</span></h4>
						<p class="pl-3 ">uuid die op de qr code van de lidkaart staat</p>

						<h4 class="pl-3 text-blue-900 font-bold">Card Type: <span class="text-ingenium-grey-800 font-bold">{CardTypeEnum[editSelected?.card_type ?? 0]}</span></h4>
						<p class="pl-3 ">Het type kaart (scannen, draadloos, ..)</p>

						<h4 class="pl-3 text-blue-900 font-bold">MemberType: <span class="text-ingenium-grey-800 font-bold">{CardMembershipEnum[editSelected?.member_type ?? 0]}</span></h4>
						<p class="pl-3 ">Soort lid</p>

						<h4 class="pl-3 text-blue-900 font-bold">Available: <span class="text-ingenium-grey-800 font-bold">{editSelected?.availability.available ?? false}</span></h4>
						<p class="pl-3 ">Beschikbaarheid</p>
					</div>

					<form class="flex-1 ingenium-form">
						<fieldset>
							<div class="flex-1 form-field max-w-72 mb-2">
								<label for="itemName">Card Nr</label>
								<input id="itemName" type="number" required bind:value={ editForm.cardNr }/>
								<p>Typisch het nummer dat ook op de fysieke kaart staat</p>
							</div>
						</fieldset>

						<fieldset>
							<div class="flex-1 form-field max-w-72 mb-2">
								<label for="email">User Email</label>
								<input id="email" type="text" required bind:value={ editForm.user_email }/>
								<p>Gekoppelde gebruiker</p>
							</div>

							<div class="flex-1 form-field max-w-72 mb-2">
								<label for="group">Keycloak Group ID</label>
								<input id="group" type="text" required bind:value={ editForm.linked_group }/>
								<p>UUID van de keycloak group</p>
							</div>
						</fieldset>
					</form>
				</div>

				<div class="p-2 flex justify-end items-center">
					<button type="button" class="button button-primary w-24 button-inline"
									disabled={loadingHTTP}
									onclick={handlePatch}>
						<span class="text-white">Update</span>
					</button>
				</div>

				{#if putError !== null}
					{putError.message}
				{/if}
			</article>
		{/snippet}
	</Modal>
{/if}

<Modal title="Bulk Import" maxWidth="max-w-xl" bind:isOpen={ showBulkImport } closable={ true }>
	{#snippet children()}
		<article class="m-4">
			<label for="file">Upload lidkaarten</label>
			<input accept="text/csv" bind:files id="file" name="avatar" type="file" />

			{#each Array.from(files ?? []) as file}
				<p>{file.name} ({file.size} bytes)</p>
			{/each}

			<div class="p-2 flex justify-end items-center">
				<button type="button" class="button button-primary w-24 button-inline"
								disabled={loadingHTTP || files === undefined}
								onclick={handleUpload}>
					<span class="text-white">Upload</span>
				</button>
			</div>

			{#if uploadError !== null}
				{uploadError.message}
			{/if}
		</article>
	{/snippet}
</Modal>