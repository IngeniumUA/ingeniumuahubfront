<script lang="ts">
	import type { TransactionI } from '$lib/models/transactionI';
	import ExplodedLogPreview from '$lib/components/staff/dblog/ExplodedLogPreview.svelte';
	import Modal from '$lib/components/layout/modal.svelte';
	import { DBLogAPI } from '$lib/core_api/dblog_api';
	import type { DBLogExplodedI } from '$lib/models/dblog';
	import { onMount } from 'svelte';
	import { CoreTransactionAPI } from '$lib/core_api/transaction';
	import { successToast } from '$lib/components/toast/defined_toast';

	let {
		isOpen = $bindable(false),
		transaction,
	}: {
		isOpen: boolean,
		transaction: TransactionI,
	} = $props();

	let explodedDBLogs: DBLogExplodedI[] = $state([])

	let loadingHTTP: boolean = $state(false);

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
		user_email: transaction.interaction.user_email,
		note: transaction.note
	})

	async function patch() {
		if (loadingHTTP) return;
		const patchObject = {
			interaction: {
				user: form.user_email,
				note: form.note === '' ? null: form.note,
			}
		}
		loadingHTTP = true;
		try {
			transaction = await CoreTransactionAPI.patchTransaction(null,
				transaction.interaction.interaction_id,
				patchObject);
			putError = null;
			successToast("Patched!")
		} catch (error) {
			putError = error instanceof Error ? error : Error('Error patching');
		} finally {
			loadingHTTP = false; // Reset loading state
		}
	}

	let putError: Error | null = $state(null)
</script>

<Modal title="Transactie bewerken" maxWidth="max-w-5xl" bind:isOpen={ isOpen } closable={ true }>
	{#snippet children()}
		<article class="m-4">
			<div class="flex flew-row gap-4">
				<form class="flex-1 ingenium-form">
					<div class="ingenium-description-component">

					<h3 class="font-bold pb-2">Overview</h3>
					<fieldset>
						<a href="/staff/user/{transaction.interaction.user_email}"><h4>User</h4></a>
						<div class="flex justify-between items-center">
							<input class="flex-1 ingenium-description-value" bind:value={form.user_email}>
						</div>
						<p>Gebruiker aan wie de betaling is gekoppeld</p>

					</fieldset>
					<fieldset>
						<h4>Note</h4>
						<div class="flex justify-between items-center">
							<input class="flex-1 ingenium-description-value" id="note" type="text" required bind:value={form.note}/>
						</div>
						<p>Notitie die kan toegevoegd worden aan de betaling</p>
					</fieldset>

					</div>
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
								onclick={patch} disabled={loadingHTTP}
								>
					<span class="text-white">Update</span>
				</button>
			</div>

			{#if putError !== null}
				<div class="error-message p-4">
					{putError.message}
				</div>
			{/if}
		</article>
	{/snippet}
</Modal>