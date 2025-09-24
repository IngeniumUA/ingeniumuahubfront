<script lang="ts">
	import type { CheckoutIWide } from '$lib/models/checkoutI';
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
	import { hasRole } from '$lib/states/auth.svelte';
	import { PaymentProviderEnum } from '$lib/models/productsI';
	import Modal from '$lib/components/layout/modal.svelte';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { PaymentStatusEnum } from '$lib/models/enums';
	import { makePretty, prettyDateTime } from '$lib/utilities/style-utilities';
	import type { DBLogExplodedI } from '$lib/models/dblog';
	import { DBLogAPI } from '$lib/core_api/dblog_api';
	import type { TransactionI } from '$lib/models/transactionI';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let checkoutWide: CheckoutIWide = $state(data.checkout);
	let explodedDBLogs: DBLogExplodedI[] = $state(data.logs);


	let groupProductBlueprint = $derived.by(() => {
		const groupedByProduct = checkoutWide.transactions.reduce<Record<number, TransactionI[]>>(
			(acc, tx) => {
				(acc[tx.product_blueprint_id] ??= []).push(tx);
				return acc;
			},
			{}
		);
		return Object.values(groupedByProduct).map((transactions: TransactionI[]) => {
			const groupedPricePolicy = transactions.reduce<Record<number, TransactionI[]>>(
				(acc, tx) => {
					(acc[tx.price_policy_id] ??= []).push(tx);
					return acc;
				},
				{}
			)
			return {
				product_blueprint_id: transactions[0].product_blueprint_id,
				product_blueprint_name: transactions[0].product_blueprint_name,
				transaction_count: transactions.length,
				price_policies: Object.values(groupedPricePolicy).map((transactions: TransactionI[]) => {
					return {
						price_policy_id: transactions[0].price_policy_id,
						price_policy_name: transactions[0]['purchased_product']['price_policy']!['name'],
						price_eu: transactions[0]['purchased_product']['price_policy']!['price'],
						transaction_count: transactions.length,
					}
				})
			};
		}
		)})

	let loadingHTTP: boolean = $state(false);
	async function refreshLogs() {
		const queryParam = new URLSearchParams({
			table_name: 'hubcheckout',
			row_primary_key: `${checkoutWide.id}`
		});
		explodedDBLogs = await DBLogAPI.queryCoreDBLogExploded(null, queryParam)
	}
	async function refresh() {
		checkoutWide = await CoreCheckoutAPI.getCheckoutWide(null, checkoutWide.checkout_uuid);
		await refreshLogs()
		successToast("Refreshed!")
	}

	/**
	 * Util
	 */
	function deducePlatform(referer: string | null, user_agent: string | null): string {
		if (referer === null) return "geen info"
		if (referer.startsWith("http://")) {
			if (user_agent?.toLowerCase().includes("electron")) return "app"
			return "local"
		}
		return referer
	}

	/**
	 * State fullness around editing the checkout
	 * Al done with operations
	 */
	let form = $state({
		email: null,
		note: data.checkout.note
	})
	let toggleEditUser: boolean = $state(false);
	let newUserExist: boolean = $state(false)
	let editUserButtonDisabled = $derived(loadingHTTP || form.email === "" || form.email === null)

	let editingNote: boolean = $state(false);
	let patchError: Error | null = $state(null)
	async function toggleEditNote() {
		editingNote = !editingNote;
		if (editingNote) return;
		if (checkoutWide.note === form.note) return;

		loadingHTTP = true;
		try {
			const patchObj = {
				note: form.note
			}
			checkoutWide.note = (await CoreCheckoutAPI.patchCheckout(null, checkoutWide.checkout_uuid, patchObj)).note;
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

	function getPatchStatusValue() {
		if (checkoutWide.checkout_status === PaymentStatusEnum.successful) return PaymentStatusEnum.refund_pending
		if (checkoutWide.checkout_status === PaymentStatusEnum.pending) return PaymentStatusEnum.cancelled
		return null
	}
	async function patchStatus(newStatus: PaymentStatusEnum | null) {
		if (newStatus === null) return;
		if (![PaymentStatusEnum.cancelled, PaymentStatusEnum.refund_pending].includes(newStatus)) {
			failedToast("Kan enkel betaling Cancellen of Refunden")
			return
		}
		let patchObj = {
			checkout_status: newStatus
		};
		try {
			checkoutWide = await CoreCheckoutAPI.patchCheckout(null, checkoutWide.checkout_uuid, patchObj);
			await refreshLogs()
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

	async function patchUserEmail() {
		if (!newUserExist) {
			newUserExist = true; // todo
		} else {
			loadingHTTP = true;
			try {
				const patchObj = {
					user_email: form.email
				}
				checkoutWide = await CoreCheckoutAPI.patchCheckout(null, checkoutWide.checkout_uuid, patchObj);
				await refreshLogs()
				toggleEditUser = false;
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
	}

	async function sendEmail() {
		try {
			await CoreCheckoutAPI.sendCheckoutEmail(null, checkoutWide.checkout_uuid);
		} catch (error) {
			if (error instanceof Error) {
				failedToast(error.message);
			}
		} finally {
			loadingHTTP = false;
		}
	}
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1 id="overview">{checkoutWide.amount} <span class="opacity-75">EUR</span></h1>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<section class="flex flex-row">
		<div class="flex-[2]">
			<div class="alert alert-info mb-4">
				<p class="alert-text">Een checkout is een uitgevoerde betaling.</p>
			</div>

			<div class="flex flex-row gap-4">
				<div class="flex-[2] p-2">
					<h2 class="font-bold mb-2">Transacties</h2>
					{#each groupProductBlueprint as row (row.product_blueprint_id)}
						<div class="flex justify-between items-center">
							<h3 class="text-blue-900 font-bold">{row.product_blueprint_name}</h3>
							<h4 class="text-ingenium-grey-800 text-right font-bold mr-4">Subtotaal: {row.transaction_count}</h4>
						</div>
						<table class="ingenium-table">
							<tbody>
							{#each row.price_policies as pricePolicyRow, pricePolicyIndex (pricePolicyRow.price_policy_id)}
								<tr>
									<th scope="row">
										<h4 class="text-ingenium-grey-800 font-bold">
											Price {pricePolicyIndex + 1}: {#if pricePolicyRow.price_policy_name !== null}{pricePolicyRow.price_policy_name} -{/if}
											{#if pricePolicyRow.price_eu === 0}Gratis{:else}€{pricePolicyRow.price_eu}{/if}
										</h4>
									</th>
									<td class="text-right">{pricePolicyRow.transaction_count}</td>
								</tr>
							{/each}
							</tbody>
						</table>
					{/each}
					<p class="text-right font-bold mr-4">Eind totaal: {checkoutWide.transactions.length}</p>
				</div>

				<div class="flex-[1] p-2">
					<h3 class="font-bold mb-2">Voortgang:</h3>
					<button
						class="button button-danger button-inline"
						onclick={() => {patchStatus(getPatchStatusValue())}}
						disabled={loadingHTTP || ![PaymentStatusEnum.successful, PaymentStatusEnum.pending].includes(checkoutWide.checkout_status)}
					>
						<span class="text-white">
							{#if checkoutWide.checkout_status === PaymentStatusEnum.successful}
								Refund
							{:else if checkoutWide.checkout_status === PaymentStatusEnum.pending}
								Cancel
							{:else}
								{makePretty(PaymentStatusEnum[checkoutWide.checkout_status])}
							{/if}
						</span>
					</button>

					<h3 class="font-bold mt-4 mb-2">Mail:</h3>
					<button class="button button-primary button-inline" onclick={sendEmail}>
						<span class="text-white">Opnieuw Versturen</span>
					</button>
				</div>
			</div>
		</div>

		<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

		<aside class="flex-[1] px-4 col-span-1">
			<nav class="vertical-nav vertical-nav-transparent">
				<h2>On this page</h2>
				<a href="#overview" class="font-semibold">Overzicht</a>

				<a href="#transactions" class="font-semibold">Transacties</a>
				<a href="#transactions" class="font-semibold">Checkout Tracker</a>

				{#if hasRole("webmaster")}
					<a href="#changelog" class="font-semibold">Changelog</a>
				{/if}
			</nav>
		</aside>
	</section>

	<h1 id="overview">Overzicht</h1>
	<section class="flex flex-row">
		<div class="flex-[2]">
			<h2>Tijdlijn</h2>
			<div class="alert alert-info mb-4">
				<p class="alert-text">Herinner dat we niet alle veranderingen bijhouden.<br>Hieronder enkele van de belangrijkste.</p>
			</div>
			<div class="tijdlijn-section">
				{#each explodedDBLogs as statusOrUserLog}
					<div class="tijdlijn-container">
						<h4>{prettyDateTime(statusOrUserLog.created_timestamp)} <span>Edit</span></h4>
						<p>{makePretty(statusOrUserLog.column_name)}: <span>{statusOrUserLog.value_new !== null ? makePretty(statusOrUserLog.value_new): statusOrUserLog.value_new}</span></p>
						<p>Edit by: <span>{statusOrUserLog.dblog_metadata["user"] ?? "unknown"}</span></p>
					</div>
				{/each}

				<!-- Onderste container, aanmaken van checkout-->
				<div class="tijdlijn-container">
					<h4>{prettyDateTime(checkoutWide.created_timestamp)} <span>Created</span></h4>
				</div>
			</div>

			<h2 class="mt-4">Checkout Metadata</h2>
			{#if checkoutWide.payment_provider === PaymentProviderEnum.Stripe}
				<div><a href={`https://dashboard.stripe.com/acct_1DHT0yBSXssFMR3b/payments/${checkoutWide.checkout_metadata["payment_provider_metadata"]["payment_intent_id"]}`}>Bekijk betaling op Stripe</a></div>
			{/if}

			<h3 class="font-bold mt-2">Checkout Flow Info</h3>
			<p>{JSON.stringify(checkoutWide.checkout_metadata["checkout_flow_information"], null, 2)}</p>

			<h3 class="font-bold mt-2">Payment Provider Metadata</h3>
			<p>{JSON.stringify(checkoutWide.checkout_metadata["payment_provider_metadata"], null, 2)}</p>

			<h2 class="mt-4">User Information</h2>
			<p>Zo wat informatie die we over de gebruiker weten mis?</p>

			{#if checkoutWide.payment_provider === PaymentProviderEnum.Stripe}
				<h3>Payment Provider Customer Info</h3>
				<p>TODO: We kunnen via een stripe endpoint informatie ophalen voor deze user, kan hier worden weergegeven</p>
			{/if}

			<h3>Recent payment like this one</h3>
			<p>Todo: Checkout table voor checkouts van max een week geleden, zelfde bedrag, en user</p>
			<p></p>
		</div>

		<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

		<div class="checkout-details-section">
			<h2>Details</h2>

			<fieldset>
				<h4>Checkout UUID</h4>
				<p class="bg-ingenium-grey-100 checkout-detail-value">{checkoutWide.checkout_uuid}</p>
				<p>Uniek per betaling</p>
			</fieldset>

			<fieldset>
				<h4>Payment status</h4>
				<p class="bg-ingenium-grey-100 checkout-detail-value">{makePretty(PaymentStatusEnum[checkoutWide.checkout_status])}</p>
				<p>Status van de betaling</p>
			</fieldset>

			<fieldset>
				<h4>User</h4>
				<div class="flex justify-between items-center">
					<p class="flex-1 checkout-detail-value">{checkoutWide.user_email}</p>
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
						<p class="flex-1 checkout-detail-value">{checkoutWide.note ? checkoutWide.note: "geen notitie"}</p>
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

			<fieldset>
				<h4>Betaling</h4>
				<p class="bg-ingenium-grey-100 checkout-detail-value">€{checkoutWide.amount} via {PaymentProviderEnum[checkoutWide.payment_provider]}</p>
				<p>Bedrag en valuta</p>
			</fieldset>

			<fieldset>
				<h4>Guest Checkout</h4>
				<p class="bg-ingenium-grey-100 checkout-detail-value">{checkoutWide.checkout_metadata["checkout_flow_information"]["guest_checkout"] ?? "geen info"}</p>
				<h4>Platform</h4>
				<p class="bg-ingenium-grey-100 checkout-detail-value">{deducePlatform(
					checkoutWide.checkout_metadata["checkout_flow_information"]["referer"] ?? null,
					checkoutWide.checkout_metadata["checkout_flow_information"]["user_agent"] ?? null
				)}</p>
			</fieldset>

			<fieldset>
				<h4>Dates</h4>
				<p><span class="font-bold">Created:</span> {prettyDateTime(checkoutWide.created_timestamp)}</p>
				<p><span class="font-bold">Last Edit:</span> {prettyDateTime(checkoutWide.last_updated_timestamp)}</p>
				<p><span class="font-bold">Completed:</span> {checkoutWide.completed_timestamp === null ? "onafgewerkt": prettyDateTime(checkoutWide.completed_timestamp)}</p>
			</fieldset>
		</div>
	</section>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	<section>
		<h1 id="transactions">Transacties</h1>
		<p>Zoals de price policy hier ook zo een opening. Het simpeler kaartje mag wel groter.
			Het grotere kaartje moet ook zo de recent history enzo kunnen weergeven voor partial refunds bv.
			Bij open kaartje identiek als hierboven zo de details in een sidebar?</p>
	</section>
	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	<section>
		<h1>Full History</h1>
		<div class="flex flex-row">
			<div>
				<!--{#each ReconstructedCheckoutList as selectedReconstructedIndex, reconstructedObject}-->
				<!--	<button onclick={setSelectedReconstructed(index)}>-->
				<!--		{ReconstructedCheckoutList["request_id"]}-->
				<!--	</button>-->
				<!--{/each}-->
			</div>
			<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>
			<div>
				<!--{JSON.stringify(ReconstructedCheckoutList.at(selectedReconstructedIndex))}-->
			</div>
		</div>
		<p>TODO, dit wordt een call naar DPU om met log reconstructie te zien hoe de checkout is veranderd (en ook transactions!)</p>
	</section>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	<section>
		<h1 id="checkout-tracker">Checkout Tracker</h1>
		<p>Nog een query doen en dit verbergen als het ni nodig is</p>
	</section>

	{#if hasRole("webmaster")}
		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

		<h1 id="changelog">Changelog</h1>
		<p>TODO 2: DBLogs voor dit item (als aparte component)</p>
	{/if}
</main>

<Modal title="Gebruiker aanpassen" maxWidth="max-w-2xl" bind:isOpen={ toggleEditUser } closable={ true }>
	{#snippet children()}
		<div class="alert alert-info mx-4 mb-2 max-w-3xl">
			<p class="alert-text">Hiermee kan je de eigenaar van de betaling veranderen. Een van de enigste gevallen dat je dat doet is wanneer iemand zijn email fout heeft ingevuld.</p>
		</div>

		<form class="ingenium-form p-4">
			<fieldset>
				<div class="form-field">
					<label for="name">Email van de gebruiker</label>
					<input id="name" type="text" required bind:value={form.email}/>
					<p>Nieuwe email ingeven</p>
				</div>

				{#if newUserExist}
					<p>Gebruiker bestaat</p>
				{:else if form.email === ""}
					Bevestigen dat je een nieuwe gebruiker aanmaakt
				{/if}
			</fieldset>

			<h4 class="font-bold text-blue-900">Extra opties</h4>
			<p>TODO: "Ook alle transacties naar deze gebruiker overzetten"</p>

			<div class="p-2 flex border-t border-gray-200">
				<button class="button button-primary button-inline"
								disabled={editUserButtonDisabled}
								onclick={patchUserEmail}>
					<span class="text-white">Aanpassen</span>
				</button>
			</div>
		</form>
	{/snippet}
</Modal>

<style>
	.checkout-details-section {
			@apply flex-[1] px-4 col-span-1;
			fieldset {
					@apply mb-2;
          .checkout-detail-value {
							@apply ml-0 px-2 rounded-md border-2 border-ingenium-grey-300 font-bold inline-block;
					}
			}
			h4 {
					@apply font-bold text-blue-900;
      }
	}

	.tijdlijn-section {
			@apply flex flex-col gap-4 p-4 pl-0 relative;

      /* Vertical line */
      &::before {
          content: "";
          @apply absolute left-4 border-2 bg-ingenium-grey-300 w-px;
          top: 1rem;
          bottom: 1rem;
					z-index: -1;
      }

      .tijdlijn-container {
				@apply max-w-72 p-2 bg-white border-2 border-ingenium-grey-300 rounded-lg text-ingenium-grey-600;
				p {
					@apply text-ingenium-grey-600;
				}

				span {
					@apply font-bold text-blue-900 opacity-90;
			}
			}
	}
</style>