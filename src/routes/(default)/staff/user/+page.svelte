<script lang="ts">
	import { prettyDateTime } from '$lib/utilities/style-utilities';
	import { successToast } from '$lib/components/toast/defined_toast';
	import { CoreUserAPI } from '$lib/core_api/user_api';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();

	let users = $state(data.users)
	let userCount = $state(data.userCount)

	let loadingHTTP: boolean = $state(false)

	/**
	 * Query logic
	 */
	interface QueryFormI {
		queryOffset: number;
		queryLimit: number;
		userUUID: string | null;
		ssoUUID: string | null;
		userEmail: string | null;
	}
	let queryForm: QueryFormI = $state({
		queryOffset: 0,
		queryLimit: 100,
		userUUID: null,
		ssoUUID: null,
		userEmail: null
	})
	let baseQueryParam = $derived.by(() => {
		let queryParam = new URLSearchParams({});

		queryParam.set('offset', (queryForm.queryOffset * queryForm.queryLimit).toString());
		queryParam.set('limit', queryForm.queryLimit.toString());
		if (queryForm.userEmail !== null && queryForm.userEmail !== "") queryParam.set('user_email_contains', queryForm.userEmail);
		if (queryForm.userUUID !== null && queryForm.userUUID !== "") queryParam.set('user_uuid', queryForm.userUUID);
		if (queryForm.ssoUUID !== null && queryForm.ssoUUID !== "") queryParam.set('user_sso_uuid', queryForm.ssoUUID);

		return queryParam;
	})
	async function refresh() {
		if (loadingHTTP) return;
		loadingHTTP = true

		users = await CoreUserAPI.queryUser(null, baseQueryParam);
		userCount = await CoreUserAPI.countUser(null, baseQueryParam);

		successToast("Refreshed")
		loadingHTTP = false;
	}
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex justify-between items-center gap-2 mb-6">
		<h1>Gebruikers</h1>
		<button class="ml-auto button button-primary w-24 button-inline" disabled={true}>
			<span class="text-white">Import</span>
		</button>
		<button class="button button-primary w-24 button-inline" onclick={refresh}>
			<span class="text-white">Refresh</span>
		</button>
	</div>

	<div class="alert alert-info mb-4 max-w-2xl">
		<p class="alert-text">Gebruikers die bestaan in de core database. Dit betekend niet perse alle gebruikers! Onze central user store zit in keycloak.</p>
	</div>

	<div class="container flex flex-col md:flex-row">
		<div class="md:flex-[3] order-3 md:order-1">
			<h2>Gebruikers</h2>

			<h3 class="font-bold">Filters</h3>
			<div class="flex justify-between items-center mb-6">

			</div>

			<h3 class="font-bold">Lijst</h3>
			<table class="ingenium-table">
				<thead>
				<tr>
					<th scope="col" class="form-field"><div>
						<h4>User UUID</h4>
						<input class="max-w-16" type="text" placeholder="uuid" bind:value={queryForm.userUUID}>
					</div></th>
					<th scope="col" class="form-field"><div>
						<h4>sso UUID</h4>
						<input class="max-w-16" type="text" placeholder="uuid" bind:value={queryForm.ssoUUID}>
					</div></th>
					<th class="form-field"><div>
						<h4>Email</h4>
						<input class="max-w-48" type="email" placeholder="Card nr" bind:value={queryForm.userEmail}>
					</div></th>
					<th><h4>Last Update Timestamp</h4></th>
					<th><h4>Created Timestamp</h4></th>
					<th class="p-0"><PaginationComponent
						bind:maxTotal={userCount}
						bind:fetchedTotal={users.length}
						bind:currentOffset={queryForm.queryOffset}
						bind:currentLimit={queryForm.queryLimit}
						bind:httpLoading={loadingHTTP}
					>
					</PaginationComponent></th>
				</tr>
				</thead>
				<tbody>
				{#each users as user (user.user_uuid)}
					<tr>
						<td>
							<a href="/staff/user/{user.email}">{user.user_uuid.slice(0, 6)}</a>
						</td>
						<td>
							<a href="/staff/user/{user.email}">{user.sso_uuid.slice(0, 6)}</a>
						</td>
						<th scope="row">
							<a href="/staff/user/{user.email}">{user.email}</a>
						</th>
						<td>
							{prettyDateTime(user.last_update_timestamp)}
						</td>
						<td>
							{prettyDateTime(user.created_timestamp)}
						</td>
						<td>
							<button>
								<span>...</span>
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

			<div class="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
				<h4 class="text-ingenium-grey-800 font-bold">Gebruikers</h4>
				<p class="text-blue-900 font-bold">Totaal: {userCount}</p>
			</div>

		</div>
	</div>
</main>