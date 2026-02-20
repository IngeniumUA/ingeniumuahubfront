<script lang="ts">
	interface RegisterForm {
		email: string;
		name: string;
		voornaam: string;
		badgy_type: string;
		functie: string;
		title: string;
		banner: object | null;
	}
	let registerForm: RegisterForm = $state({
		email: '',
		name: '',
		voornaam: '',
		functie: '',
		badgy_type: '',
		title: '',
		banner: null,
	})

	const rollen = ['Student', 'Bedrijfsvertegenwoordiger', 'Alumnus', 'Organisatie', 'Andere']

	const bannerBedrijven = [
		{badge_type: 'bedrijf', title: 'Port of Antwerp Bruges', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/25_26/port_of_antwerp_bruges.webp'},
		{badge_type: 'bedrijf', title: 'DEME', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/25_26/deme.webp'},
		{badge_type: 'bedrijf', title: 'Jan De Nul', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/25_26/jandenul.webp'},
	]

	const bannerBestuur = [
		{badge_type: 'organisatie', title: 'Ingenium', logo: 'ingenium.png'},
		{badge_type: 'organisatie', title: 'DavingA', logo: 'davinga.png'},
		{badge_type: 'organisatie', title: 'FTI', logo: 'fti.png'},
	]

	const bannerStudenten = [
		{badge_type: 'student', title: 'Elektromechanica', logo: 'em_logo.png'},
		{badge_type: 'student', title: 'Chemie', logo: 'ch_logo.png'},
		{badge_type: 'student', title: 'Bouwkunde', logo: 'bk_logo.png'},
		{badge_type: 'student', title: 'Elektronica-ICT', logo: 'ei_logo.png'},
	]

	const bannerAlumnus = [
		{badge_type: 'alumnus', title: 'Elektromechanica', logo: 'em_logo.png'},
		{badge_type: 'alumnus', title: 'Chemie', logo: 'ch_logo.png'},
		{badge_type: 'alumnus', title: 'Bouwkunde', logo: 'bk_logo.png'},
		{badge_type: 'alumnus', title: 'Elektronica-ICT', logo: 'ei_logo.png'},
	]

	/**
	 *
	 */
	let query = $state('');
	let open = $state(false);

	const filtered = $derived(
		query.length === 0
			? bannerBedrijven
			: bannerBedrijven.filter(c =>
				c.title.toLowerCase().includes(query.toLowerCase())
			)
	);

	function selectCompany(banner) {
		registerForm.banner = banner;
		open = false;
	}
</script>

<style lang="scss">
	main {
		@apply bg-eot-blue-950 flex flex-col gap-4;
	}

	nav {
		@apply mx-8 p-2 border-b-2 border-white;
	}

	section {
		@apply mx-8;

		h2, h4 {
			@apply text-center text-white;
		}

		article {
			@apply m-4 p-2 rounded-xl w-full max-w-xl relative flex flex-col gap-4;
		}
	}

	h2, h4 {
    font-family: itc-officina-sans-pro, sans-serif;
	}
</style>

<main>
	<nav>
		<div>
			<a href="https://engineersoftomorrow.com" aria-label="To engineers of tomorrow">
				<img src="https://cdn.prod.website-files.com/65c249e8d4fed8aa2a2da2bf/679c5a9a28d0cf7e151688ce_Engineers%20of%20Tomorrow%202024%20-%20WHITE-p-500.png" width="220" alt="Engineers of tomorrow logo">
			</a>
		</div>
	</nav>

	<section>
		<h2>Registratie voor de jobbeurs</h2>

		<div class="flex flex-col justify-center items-center">
			<article class="bg-white">
				<p>Beschrijving voor hoe je je registreert. Dit moet eindigen met <span class="font-bold">verwacht een email met een QR code binnen vijf minuten.</span></p>
			</article>
		</div>

	</section>

	<section>
		<h2>Vul gegevens in</h2>

		<form class="ingenium-form flex flex-col items-center">
			<fieldset>
				<h4>Email</h4>
				<div class="form-field">
					<input bind:value={registerForm.email}>
				</div>
				<p class="text-center">Hier versturen we je registratie</p>

				<h4>Voornaam & Naam</h4>
				<div class="flex flex-row gap-4">
					<div class="form-field">
						<input bind:value={registerForm.voornaam}>
					</div>

					<div class="form-field">
						<input bind:value={registerForm.name}>
					</div>
				</div>
				<p class="text-center">Voornaam & achternaam</p>
			</fieldset>

			<fieldset>
				<h4>Ik ben hier als ..</h4>
				<div class="form-field">
					<select required bind:value={registerForm.badgy_type}>
						{#each [null, ...rollen] as rol}
							<option value={rol}>
								{rol === null ? "---": rol}
							</option>
						{/each}
					</select>
				</div>
				<p>Hoe je op deze jobbeurs aanwezig bent</p>
			</fieldset>

			{#if (registerForm.badgy_type === rollen[0])}
				<!-- Student -->
				<article style="background-color: #179b83">
					<fieldset>
						<h4>Selecteer je afstudeerrichting</h4>
						<div class="form-field">
							<select required bind:value={registerForm.banner}>
								{#each [null, ...bannerStudenten] as bannerObj}
									<option value={bannerObj}>
										{bannerObj === null ? "---": bannerObj.title}
									</option>
								{/each}
							</select>
						</div>
					</fieldset>

					{#if registerForm.banner !== null}
						<div>
							<img src={registerForm.banner['logo']} alt={registerForm.banner['logo']}>
						</div>
					{/if}
				</article>
			{:else if (registerForm.badgy_type === rollen[1])}
				<!-- Bedrijf -->
				<article style="background-color: #cc7056">
					<h2>Selecteer je bedrijf</h2>

					<input
						class="form-field w-full"
						placeholder="Zoek je bedrijf..."
						bind:value={query}
						onfocus={() => (open = true)}
					/>

					{#if open}
						<ul class="absolute z-10 bg-white max-h-60 overflow-y-auto rounded shadow">
							{#each filtered as company}
								<li
									class="px-3 py-2 hover:bg-gray-200 cursor-pointer"
								>
									<button onclick={() => selectCompany(company)}>
										{company.title}
									</button>
								</li>
							{/each}
						</ul>
					{/if}

					{#if registerForm.banner !== null}
						<div class="p-4 flex flex-col justify-center items-center">
							<div class="w-48 h-48">
								<img
									src={registerForm.banner['logo']}
									alt={registerForm.banner['logo']}
									class="max-w-full max-h-full object-contain"
								>
							</div>
							<h4 class="font-bold text-center">{registerForm.banner['title']}</h4>
						</div>
					{/if}

				</article>
			{:else if (registerForm.badgy_type === rollen[2])}
				<!-- Alumnus -->
				<article style="background-color: #3083dc">
					<fieldset>
						<h4>Selecteer je afstudeerrichting</h4>
						<div class="form-field">
							<select required bind:value={registerForm.banner}>
								{#each [null, ...bannerAlumnus] as bannerObj}
									<option value={bannerObj}>
										{bannerObj === null ? "---": bannerObj.title}
									</option>
								{/each}
							</select>
						</div>
					</fieldset>

					{#if registerForm.banner !== null}
						<div>
							<img src={registerForm.banner['logo']} alt={registerForm.banner['logo']}>
						</div>
					{/if}
				</article>
			{:else if (registerForm.badgy_type === rollen[3])}
				<!-- Organisatie -->
				<article class="bg-ingenium-grey-700">
					<fieldset>
						<h4>Van welke organisatie?</h4>
						<div class="form-field">
							<select required bind:value={registerForm.banner}>
								{#each [null, ...bannerBestuur] as bannerObj}
									<option value={bannerObj}>
										{bannerObj === null ? "---": bannerObj.title}
									</option>
								{/each}
							</select>
						</div>
					</fieldset>

					{#if registerForm.banner !== null}
						<div>
							<img src={registerForm.banner['logo']} alt={registerForm.banner['logo']}>
						</div>
					{/if}
				</article>
			{/if}
		</form>

	</section>

	<section class="mx-8 p-2 border-t-2 border-white">
		<h2>Inschrijven</h2>

		<div class="mt-2 flex flex-row justify-center items-center">
			<button class="button button-primary">Submit</button>
		</div>
	</section>

</main>