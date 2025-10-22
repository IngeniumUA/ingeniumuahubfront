<script lang="ts">
	import { hasRole } from '$lib/states/auth.svelte';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import DBLogTable from '$lib/components/staff/dblog/DBLogTable.svelte';
	import type { UserWideI } from '$lib/models/user/userI';
	import { CoreUserAPI } from '$lib/core_api/user_api';
	import type { CardI } from '$lib/models/cardI';
	import PaymentTable from '$lib/components/staff/payment/PaymentTable.svelte';
	import type { HubCheckoutTrackerI } from '$lib/models/trackerI';
	import { makePretty, prettyDate, prettyDateTime } from '$lib/utilities/style-utilities';
	import { CardMembershipEnum } from '$lib/models/item/cardI';
	import { onMount } from 'svelte';
	import { CoreCardAPI } from '$lib/core_api/card_api';
	import { CoreGroupAPI } from '$lib/core_api/group_api';
	import type { GroupI } from '$lib/models/user/GroupI';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let userWide: UserWideI = $state(data.userWide);
	let cards: CardI[] = $state(data.cards);
	let checkoutTrackers: HubCheckoutTrackerI[] = $state(data.checkoutTrackers);
	let keycloakUser = $state(data.keycloakUser);

	let availableGroups: GroupI[] = $state([]);
	let groupOptions: GroupI[] = $derived.by(() => {
		return availableGroups.filter(group => {
			return !userWide.groups.map(value => value.id).includes(group.id);
		})
	});
	let selectedGroup: number | null = $state(null);

	let loadingHTTP: boolean = $state(false);

	async function refreshKeycloak() {
		if (userWide.manager) {
			keycloakUser = await CoreUserAPI.getUserKeycloak(null, userWide.sso_uuid)
		}
	}
	async function refreshGroups() {
		availableGroups = await CoreGroupAPI.queryGroup(null)
	}
	async function refresh() {
		userWide = await CoreUserAPI.getUserWide(null, userWide.user_uuid)
		cards = await CoreCardAPI.queryCards(null, new URLSearchParams({
			limit: '5',
			user: userWide.user_uuid,
		}));
		await refreshKeycloak()
		successToast("Refreshed!")
	}

	onMount(() => {
		refreshKeycloak();
		refreshGroups();
	});

	/**
	 * Editting
	 */
	let patchError: Error | null = $state(null)
	async function addUserToGroup() {
		if (loadingHTTP) return;
		if (selectedGroup === null) return;

		loadingHTTP = true;
		try {
			await CoreUserAPI.addUserToGroup(selectedGroup, userWide.user_uuid);
			await refresh();
			patchError = null;
		} catch (error) {
			patchError = error instanceof Error ? error : Error('Error submitting user');
		} finally {
			if (patchError === null) {
				successToast("Added!")
			} else {
				failedToast(`Update Failed`)
			}
			loadingHTTP = false;
		}
	}

	async function removeUserFromGroup(groupId: number) {
		if (loadingHTTP) return;

		loadingHTTP = true;
		try {
			await CoreUserAPI.removeUserFromGroup(groupId, userWide.user_uuid);
			await refresh();
			patchError = null;
		} catch (error) {
			patchError = error instanceof Error ? error : Error('Error submitting user');
		} finally {
			if (patchError === null) {
				successToast("Removed!")
			} else {
				failedToast(`Update Failed`)
			}
			loadingHTTP = false;
		}
	}
</script>

<style lang="scss">
  .user-details-section {
    @apply flex-[1] order-1 lg:order-3 px-4 col-span-1;
    fieldset {
      @apply mb-2;
      .user-detail-value {
        @apply ml-0 px-2 rounded-md border-2 border-ingenium-grey-300 font-bold inline-block;
      }
    }
    h4 {
      @apply font-bold text-blue-900;
    }
  }
</style>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center mb-6">
		<h1 id="overview">{userWide.email}</h1>
		<button onclick={refresh} disabled={loadingHTTP} class="ml-2 button button-primary w-24 button-inline">
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<section class="flex flex-col md:flex-row">
		<div class="flex-[2]">
			<div class="alert alert-info mb-4">
				<p class="alert-text">Een gebruiker op ons platform.</p>
			</div>

			<div class="flex flex-row gap-4">
				<div class="flex-[2] p-2">
					<h2 class="font-bold mb-2">Gebruiker</h2>
					<p>Algemene statistieken hier mis. users, transactions, .. die dingen</p>

				</div>

				<div class="flex-[1] p-2">
					<h3 class="font-bold mb-2">Actieve Lidkaarten</h3>
					{#if cards.length === 0}
						<p>Geen lidkaarten</p>
					{:else}
						{#each cards as card (card.card_uuid)}
							<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
								<h4 class="text-ingenium-grey-800 font-bold">Card Nr {card.card_nr.toString()}</h4>
								<p class="text-blue-900 font-bold">Member type: {makePretty(CardMembershipEnum[card.member_type])}</p>
								<p class="text-blue-900 font-bold">UUID: {card.card_uuid.slice(0, 6)}</p>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<div class="hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

		<aside class="flex-[1] px-4 col-span-1">
			<nav class="vertical-nav vertical-nav-transparent">
				<h2>On this page</h2>
				<a href="#overview" class="font-semibold">Overzicht</a>

				<a href="#payments" class="font-semibold">Payments</a>
				<a href="#transactions" class="font-semibold">Checkout Tracker</a>

				{#if hasRole("webmaster")}
					<a href="#changelog" class="font-semibold">Changelog</a>
				{/if}
			</nav>
		</aside>
	</section>

	<h1 id="overview">Overzicht</h1>
	<section class="flex flex-col lg:flex-row">
		<div class="order-3 lg:order-2 flex-[2]">
			{#if keycloakUser !== null}
				<h2>Keycloak User</h2>
				{JSON.stringify(keycloakUser)}
			{/if}

			<h2>Groups</h2>
			<div class="flex flex-col md:flex-row gap-4">
				<div class="order-1 md:flex-[1]">
					<form class="ingenium-form">
						<fieldset class="flex flex-col gap-4">
							<h3 class="font-bold">Add to group</h3>
							<div class="form-field">
								<select id="group_id" required bind:value={selectedGroup}>
									{#each [null, ...groupOptions] as group}
										<option value={group?.id ?? null}>
											{group === null ? "none selected": makePretty(group?.name)}
										</option>
									{/each}
								</select>
							</div>
						</fieldset>

						<button
							class="button button-primary"
							disabled={loadingHTTP || (selectedGroup === null)}
							onclick={addUserToGroup}
						>
							Add
						</button>
					</form>
				</div>
				<div class="order-2 md:flex-[1]">
					<h3 class="font-bold">Current Groups</h3>
					<table class="ingenium-table">
						<thead>
						<tr>
							<th scope="col"><h4>ID</h4><th scope="col"><h4>Name</h4></th><th scope="col"><h4>Added on</h4></th>
						</tr>
						</thead>
						<tbody>
						{#each userWide.groups as group (group.id)}
							<tr>
								<td>
									{group.id}
								</td>
								<th scope="row">
									<a href="/staff/group/{group.id}">{makePretty(group.name)}</a>
								</th>
								<td>
									{prettyDate(group.created_timestamp)}
								</td>
								<td>
									<button onclick={() => {removeUserFromGroup(group.id)}}>Remove</button>
								</td>
							</tr>
						{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div class="order-2 hidden md:block w-px mx-4 bg-gray-200 dark:bg-gray-800"></div>

		<div class="user-details-section">
			<h2>Details</h2>

			<fieldset>
				<h4>User UUID</h4>
				<p class="bg-ingenium-grey-100 user-detail-value">{userWide.user_uuid}</p>
				<p>Uniek per gebruiker</p>

				<h4>Keycloak UUID</h4>
				<p class="bg-ingenium-grey-100 user-detail-value">{userWide.sso_uuid}</p>
				<p>Uniek per gebruiker</p>
			</fieldset>

			<fieldset>
				<h4>First and last name</h4>
				<p class="bg-ingenium-grey-100 user-detail-value">{userWide.first_name} {userWide.last_name}</p>
				<p>Gesynchroniseert uit keycloak</p>
			</fieldset>

			<fieldset>
				<h4>Superuser</h4>
				<p class="bg-ingenium-grey-100 user-detail-value">{userWide.manager}</p>
				<p>Superusers kunnen alles</p>
			</fieldset>

			<fieldset>
				<h4>Roles</h4>
				{#each userWide.roles as role}
					<p class="bg-ingenium-grey-100 user-detail-value">{role}</p>
				{/each}
			</fieldset>

			<fieldset>
				<h4>Dates</h4>
				<p><span class="font-bold">Created:</span> {prettyDateTime(userWide.created_timestamp)}</p>
				<p><span class="font-bold">Last Edit:</span> {prettyDateTime(userWide.last_update_timestamp)}</p>
			</fieldset>
		</div>
	</section>

	<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

	<h1 id="payments">Payments</h1>
	<PaymentTable baseQueryParam={new URLSearchParams({user: userWide.user_uuid, limit: '10'})}></PaymentTable>

	{#if (checkoutTrackers.length !== 0)}
		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">
		<section>
			<h1 id="checkout-trackers">Checkout Trackers</h1>
			<p>Todo, hier een mooiere table van maken</p>
			{#each checkoutTrackers as checkoutTracker}
				<a href="/staff/payment/{checkoutTracker.checkout.checkout_uuid}">Order Counter {checkoutTracker.order_counter}</a><br>
			{/each}
			<p>Nog een query doen en dit verbergen als het ni nodig is</p>
		</section>
	{/if}

	{#if hasRole("webmaster")}
		<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-800">

		<h1 id="changelog">Changelog</h1>
		<DBLogTable baseQueryParam={new URLSearchParams({table_name: 'hubuser', row_primary_key: userWide.id.toString()})}></DBLogTable>
	{/if}
</main>