<script lang="ts">
	import type { TransactionI } from '$lib/models/transactionI';
	import ExplodedLogPreview from '$lib/components/staff/dblog/ExplodedLogPreview.svelte';
	import Modal from '$lib/components/layout/modal.svelte';
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { DBLogAPI } from '$lib/core_api/dblog_api';
	import type { DBLogExplodedI } from '$lib/models/dblog';
	import { onMount } from 'svelte';

	let {
		isOpen = $bindable(false),
		transaction,
	}: {
		isOpen: boolean,
		transaction: TransactionI,
	} = $props();

	let explodedDBLogs: DBLogExplodedI[] = $state([])

	let loadingHTTP: boolean = $state(false);
	let toggleEditUser: boolean = $state(false);

	async function refreshLogs() {
		const queryParam = new URLSearchParams({
			table_name: 'hubtransaction',
			row_primary_key: `${transaction.interaction.interaction_id}`
		});
		explodedDBLogs = await DBLogAPI.queryCoreDBLogExploded(null, queryParam)
	}
	onMount(() => {
		refreshLogs();
	});

	/**
	 * State fullness around editing the transaction
	 * Al done with operations
	 */
	let form = $state({
		email: null,
		note: transaction.note
	})
	let editingNote: boolean = $state(false);
	let patchError: Error | null = $state(null)
	async function toggleEditNote() {
		editingNote = !editingNote;
		if (editingNote) return;
		if (transaction.note === form.note) return;

		loadingHTTP = true;
		try {
			const patchObj = {
				note: form.note
			}
			transaction.note = (await CoreCheckoutAPI.patchCheckout(null, transaction.checkout_uuid, patchObj)).note;
			patchError = null;
		} catch (error) {
			patchError = error instanceof Error ? error : Error('Error submitting form');
		} finally {
			if (patchError === null) {
				successToast("Updated!")
			} else {
				failedToast(`Update Failed`)
			}
			loadingHTTP = false;
		}
	}

	let putError: Error | null = $state(null)
</script>

<Modal title="Transactie bewerken" maxWidth="max-w-5xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<article class="m-4">
			<div class="flex flew-row gap-4">
				<form class="flex-1 ingenium-form">
					<h3 class="font-bold pb-2">Overview</h3>
					<fieldset>
						<a href="/staff/user/{transaction.interaction.user_email}"><h4>User</h4></a>
						<div class="flex justify-between items-center">
							<p class="flex-1 checkout-detail-value">{transaction.interaction.user_email}</p>
							<button class="ml-2" aria-label="edit" onclick="{() => toggleEditUser = !toggleEditUser}">
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
						<p>Gebruiker aan wie de betaling is gekoppeld</p>

					</fieldset>
					<fieldset>
						<h4>Note</h4>
						<div class="flex justify-between items-center">
							{#if editingNote}
								<div class="form-field max-w-64">
									<input id="note" type="text" required bind:value={ form.note }/>
								</div>
							{:else}
								<p class="flex-1 checkout-detail-value">{transaction.note ? transaction.note: "geen notitie"}</p>
							{/if}
							<button class="ml-2" aria-label="edit" onclick={toggleEditNote}>
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
						<p>Notitie die kan toegevoegd worden aan de betaling</p>
					</fieldset>
				</form>

				<div>
					<h3 class="font-bold pb-2">Recent history</h3>
					<ExplodedLogPreview targetObject={transaction} explodedDBLogs={explodedDBLogs}></ExplodedLogPreview>
				</div>

				<div>
					<h3 class="font-bold pb-2">Transactie Snapshot</h3>
					<pre class="text-xs text-ingenium-grey-900">{JSON.stringify(transaction.purchased_product, null, 2)}</pre>
				</div>
			</div>

			<div class="p-2 flex justify-end items-center">
				<button type="button" class="button button-primary w-24 button-inline"
								disabled={loadingHTTP}
								>
					<span class="text-white">Update</span>
				</button>
			</div>

			{#if putError !== null}
				{putError.message}
			{/if}
		</article>
	{/snippet}
</Modal>