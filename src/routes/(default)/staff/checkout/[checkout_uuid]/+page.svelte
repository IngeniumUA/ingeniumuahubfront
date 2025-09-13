<script lang="ts">
	import type { CheckoutIWide } from '$lib/models/checkoutI';
	import { CoreCheckoutAPI } from '$lib/core_api/checkout_api';
	import { hasRole } from '$lib/states/auth.svelte';
	import { PaymentProviderEnum } from '$lib/models/productsI';
	import Modal from '$lib/components/layout/modal.svelte';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { PaymentStatusEnum } from '$lib/models/enums';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let checkoutWide: CheckoutIWide = $state(data.checkout);
	let dbLogs: [] = $state(data.logs);

	let loadingHTTP: boolean = $state(false);
	async function refresh() {
		checkoutWide = await CoreCheckoutAPI.getCheckoutWide(checkoutWide.checkout_uuid);
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

	let editingNote: boolean = $state(false);
	let patchError: Error | null = $state(null)
	async function toggleEditNote() {
		editingNote = !editingNote;
		if (editingNote) return;

		loadingHTTP = true;
		try {
			const patchObj = {
				note: form.note
			}
			checkoutWide.note = (await CoreCheckoutAPI.patchCheckout(checkoutWide.checkout_uuid, patchObj)).note;
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
				const checkoutResp = await CoreCheckoutAPI.patchCheckout(checkoutWide.checkout_uuid, patchObj);
				checkoutWide.user_uuid = checkoutResp.user_uuid
				checkoutWide.user_email = checkoutResp.user_email
				checkoutWide.user_first_name = checkoutResp.user_first_name
				checkoutWide.user_last_name = checkoutResp.user_last_name

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
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1 id="overview">{checkoutWide.amount} <span class="opacity-75">EUR</span></h1>
		<button onclick={refresh} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<section class="flex flex-row">
		<div class="flex-grow">
			<div class="alert alert-info mb-4">
				<p class="alert-text">Een checkout is een uitgevoerde betaling.</p>
			</div>

			<p>TODO: Knoppen hier voor refund, email sturen, etc</p>
		</div>
		<aside class="flex-1 px-4 sm:px-2 col-span-1 md:col-span-2">
			<nav class="vertical-nav vertical-nav-transparent">
				<h2>On this page</h2>
				<div>
					<a href="#overview" class="font-semibold">Overzicht</a>

					<a href="#transactions" class="font-semibold">Transacties</a>
					<a href="#transactions" class="font-semibold">Checkout Tracker</a>

					{#if hasRole("webmaster")}
						<a href="#webmaster-info" class="font-semibold">Webmaster</a>
						<a href="#keycloak" class="font-semibold">Keycloak</a>
						<a href="#changelog" class="font-semibold">Changelog</a>
					{/if}
				</div>
			</nav>
		</aside>
	</section>

	<h1 id="overview">Overzicht</h1>
	<section class="flex flex-row">
		<div class="flex-grow">
			<h2>Recente geschiedenis</h2>
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
			TODO, dit wordt een call naar DPU om met log reconstructie te zien hoe de checkout is veranderd

			<h2>Checkout Metadata</h2>
			{#if checkoutWide.payment_provider === PaymentProviderEnum.Stripe}
				<div>
					<a href={`https://dashboard.stripe.com/acct_1DHT0yBSXssFMR3b/payments/${checkoutWide.checkout_metadata["payment_provider_metadata"]["payment_intent_id"]}`}>Bekijk betaling op Stripe</a>
				</div>
			{/if}

			{JSON.stringify(checkoutWide.checkout_metadata)}

			<h2>User Information</h2>
			<p>Zo wat informatie die we over de gebruiker weten mis?</p>
		</div>

		<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

		<div class="flex-1 px-4 sm:px-2 col-span-1 md:col-span-2">
			<h2>Details</h2>

			<h4>Checkout UUID</h4>
			<p>{checkoutWide.checkout_uuid}</p>
			<p>Uniek per betaling</p>

			<h4>Payment status</h4>
			<p>{PaymentStatusEnum[checkoutWide.checkout_status]}</p>
			<p>Status van de betaling</p>

			<fieldset>
				<div class="flex justify-between items-center">
					<h4>{checkoutWide.user_email}</h4>
						<button aria-label="edit" onclick="{() => toggleEditUser = !toggleEditUser}">
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
				<div class="flex justify-between items-center">
					<h4>Note</h4>
					<button aria-label="edit" onclick={toggleEditNote}>
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
				<p>{checkoutWide.note ? checkoutWide.note: "geen notitie"}</p>
				<p>Notitie die kan toegevoegd worden aan de betaling</p>
			</fieldset>

			<fieldset>
				<h4>Betaling</h4>
				<p><span class="font-bold">€{checkoutWide.amount}</span> via {PaymentProviderEnum[checkoutWide.payment_provider]}</p>

				<h4>Dates</h4>
				<p><span class="font-bold">Created:</span> {checkoutWide.created_timestamp}</p>
				<p><span class="font-bold">Last Edit:</span> {checkoutWide.last_updated_timestamp}</p>
				<p><span class="font-bold">Completed:</span> {checkoutWide.completed_timestamp}</p>
			</fieldset>
		</div>
	</section>

	<section>
		<h1 id="transactions">Transacties</h1>
		<p>Zoals de price policy hier ook zo een opening. Het simpeler kaartje mag wel groter. Het grotere kaartje moet ook zo de history en dblogs enzo kunnen weergeven voor partial refunds bv</p>
	</section>

	<section>
		<h1 id="checkout-tracker">Checkout Tracker</h1>
		<p>Nog een query doen en dit verbergen als het ni nodig is</p>
	</section>

	{#if hasRole("webmaster")}
		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
		<h1 id="webmaster-info">Webmaster Info</h1>
		<h2 id="keycloak">Keycloak</h2>
		<p>TODO 1: Keycloak info (kan dat zelfs?)</p>

		<h2 id="changelog">Changelog</h2>
		<p>TODO 2: DBLogs voor dit item (als aparte component)</p>
		{#each dbLogs as log}
			{JSON.stringify(log, null, 2)}
		{/each}
	{/if}
</main>

<Modal title="Gebruiker aanpassen" maxWidth="max-w-7xl" bind:isOpen={ toggleEditUser } closable={ true }>
	{#snippet children()}
		<div class="flex-2 alert alert-info mb-4 max-w-3xl">
			<p class="alert-text">Hiermee kan je de eigenaar van de betaling veranderen. Een van de enigste gevallen dat je dat doet is wanneer iemand zijn email fout heeft ingevuld.</p>
		</div>

		<form class="ingenium-form">
			<fieldset>
				<div class="form-field">
					<label for="name">Email van de gebruiker</label>
					<input id="name" type="text" required bind:value={form.email}/>
					<p>Nieuwe email ingeven</p>
				</div>

				{#if newUserExist}
					<p>Gebruiker bestaat</p>
				{:else}
					Bevestigen dat je een nieuwe gebruiker aanmaakt
				{/if}
			</fieldset>

			<div class="p-2 flex border-t border-gray-200">
				<button class="button button-primary w-24 button-inline"
								disabled={loadingHTTP}
								onclick={patchUserEmail}>
					<span class="text-white">Aanpassen</span>
				</button>
			</div>
		</form>
	{/snippet}
</Modal>