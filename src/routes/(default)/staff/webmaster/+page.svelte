<script lang="ts">
	import type { UserWideI } from '$lib/models/user/userI';
	import { CoreUserAPI } from '$lib/core_api/user_api';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();
	let managerUsers: UserWideI[] = $state(data.managerUsers)

	/**
	 *
	 */
	async function refresh() {
		managerUsers = await CoreUserAPI.queryManagers(null)
		successToast("Refreshed!")
	}

	/**
	 * Adding new user to manager
	 */
	let loadingHTTP: boolean = $state(false);
	let userManagerEmail: string = $state("")
	let patchError: Error | null = $state(null)

	async function makeUserManager() {
		if (loadingHTTP) return;
		if (userManagerEmail === "") return;

		loadingHTTP = true;
		try {
			await CoreUserAPI.addUserToManager(null, userManagerEmail);
			await refresh();
			patchError = null;
		} catch (error) {
			patchError = error instanceof Error ? error : Error('Error submitting user');
		} finally {
			if (patchError === null) {
				successToast("Added!")
				userManagerEmail = "";
			} else {
				failedToast(`Update Failed`)
			}
			loadingHTTP = false;
		}
	}
</script>

<style lang="scss">
	.manager_section {
		@apply flex flex-col gap-8 md:flex-row;

		h3 {
			@apply font-bold;
		}

		article {
      @apply bg-white p-4 rounded-lg min-h-48 w-full shadow-md hover:shadow-lg transition-shadow;
		}
	}
</style>

<main class="ingenium-container relative" id="main-content">
	<h1>Home</h1>

	<section>
		<h2>Flags</h2>
		<p>Nuttig om hier te hebben I gues? Maar er bestaat wel al een flag pagina .. idk?</p>
	</section>

	<section>
		<h2>Manager</h2>
		<div class="alert alert-info mb-4 max-w-2xl">
			<p class="alert-text">Managers zijn de superusers van onze applicatie. Ze kunnen <span class="font-bold">alles</span> uitvoeren en alles zien.
			Om dat toe te staan bestaat er een speciale kolom in de gebruikers table op de core waarin staat da ze manager zijn, in plaats van de gewoonlijke groepen die met keycloak synchroniseren.
			Voor de GUI en wat pretty dingen bestaat er ook wel een rol in keycloak voor de managers.
			</p>
		</div>

		<div class="manager_section">
			<article>
				<h3>Huidige Manager Accounts</h3>

				<ul>
					{#each managerUsers as manager}
						<li><p>{manager.email}</p></li>
					{/each}
				</ul>
			</article>

			<article>
				<h3>Voeg Manager Toe</h3>
				<form class="ingenium-form" onsubmit={(e) => { e.preventDefault(); makeUserManager(); }}>
					<fieldset>
						<div class="form-field">
							<label for="email">User email</label>
							<input id="email" type="text" required bind:value={userManagerEmail}/>
							<p>Email van de gebruiker</p>
						</div>
					</fieldset>

					<button class="button button-primary">Add</button>
				</form>
			</article>
		</div>
	</section>
</main>