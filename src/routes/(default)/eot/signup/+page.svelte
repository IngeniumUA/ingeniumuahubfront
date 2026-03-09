
<svelte:head>
	<script
		src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
		async
		defer>
	</script>
</svelte:head>

<script lang="ts">
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import { PUBLIC_API_URL, PUBLIC_CLOUDFLARE_TURNSTILE } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';
	import Modal from '$lib/components/layout/modal.svelte';
	import { browser } from '$app/environment';
	import type { CartSuccessI } from '$lib/models/cartI';
	import { goto } from '$app/navigation';

	interface RegisterForm {
		email: string;
		name: string;
		voornaam: string;
		badgy_type: string;
		affiniteit: string;
		banner: object | null;
	}
	let registerForm: RegisterForm = $state({
		email: '',
		name: '',
		voornaam: '',
		badgy_type: '',
		affiniteit: '',
		banner: null,
	})

	const rollen = ['Student', 'Bedrijfsvertegenwoordiger', 'Alumnus', 'Organisatie', 'Andere']

	const bannerBedrijven = [
		{badge_type: 'bedrijf', affiniteit: 'Port of Antwerp Bruges', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/25_26/port_of_antwerp_bruges.webp'},
		{badge_type: 'bedrijf', affiniteit: 'DEME', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/25_26/deme.webp'},
		{badge_type: 'bedrijf', affiniteit: 'Jan De Nul', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/25_26/jandenul.webp'},
	]

	const bannerBestuur = [
		{badge_type: 'organisatie', affiniteit: 'Ingenium', logo: 'ingenium.png'},
		{badge_type: 'organisatie', affiniteit: 'DavingA', logo: 'davinga.png'},
		{badge_type: 'organisatie', affiniteit: 'FTI', logo: 'fti.png'},
	]

	const bannerStudenten = [
		{badge_type: 'student', affiniteit: 'Elektromechanica', logo: 'em_logo.png'},
		{badge_type: 'student', affiniteit: 'Chemie', logo: 'ch_logo.png'},
		{badge_type: 'student', affiniteit: 'Bouwkunde', logo: 'bk_logo.png'},
		{badge_type: 'student', affiniteit: 'Elektronica-ICT', logo: 'ei_logo.png'},
	]

	const bannerAlumnus = [
		{badge_type: 'alumnus', affiniteit: 'Elektromechanica', logo: 'em_logo.png'},
		{badge_type: 'alumnus', affiniteit: 'Chemie', logo: 'ch_logo.png'},
		{badge_type: 'alumnus', affiniteit: 'Bouwkunde', logo: 'bk_logo.png'},
		{badge_type: 'alumnus', affiniteit: 'Elektronica-ICT', logo: 'ei_logo.png'},
		{badge_type: 'alumnus', affiniteit: 'andere', logo: 'geen_logo.png'},
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
				c.affiniteit.toLowerCase().includes(query.toLowerCase())
			)
	);

	function selectCompany(banner) {
		registerForm.banner = banner;
		open = false;
	}

	/**
	 * Submit logic
	 */
	let loadingHTTP = $state(false)
	let submitError: Error | null = $state(null)

	let modalOpen = $state(false);

	let turnstileLoaded: boolean = $state(false);
	let turnstileElement;
	let turnstileWidgetId = '';

	if (browser) {
		window.onloadTurnstileCallback = () => {
			turnstileLoaded = true;
		}
	}

	let turnstileToken: string | null = $state(null)
	const confirmButtonDisabled = $derived.by(() => {
		return loadingHTTP || turnstileToken == null || registerForm.email.trim() === '';
	});

	async function checkForm() {
		modalOpen = true;

		if (turnstileWidgetId !== '') return;

		turnstileWidgetId = window.turnstile.render(turnstileElement, {
			theme: 'light',
			size: 'flexible',
			language: 'nl',
			sitekey: PUBLIC_CLOUDFLARE_TURNSTILE,
			callback: (token: string) => {
				turnstileToken = token;
			},
			expiredCallback: () => {
				turnstileToken = null;
			},
		});
	}

	async function submitBadge() {
		if (loadingHTTP) return;
		loadingHTTP = true;

		let item_id = 22;
		let blueprint_id = 27;
		let price_policy_id = 39;

		const body = {
			captcha_token: turnstileToken,
			cart: {
				user_email: registerForm.email,
				products: [
					{
						name: "",
						description: "",
						description_renderer: 1,
						ordering: 0,
						blueprint_id: blueprint_id,
						origin_item_id: item_id,
						product_meta: {
							categorie: null,
							group: null,
							other_meta_data: {
								eot_signup: {
									email: registerForm.email,
									naam: registerForm.name,
									voornaam: registerForm.voornaam,
									badge_type: registerForm.badgy_type,
									affiniteit: registerForm.affiniteit,
									banner: registerForm.banner,
								}
							},
						},
						price_policy: {
							id: price_policy_id,
							name: "name",
							price: 0.0,
							ordering: 0,
						}
					}
				]
			}
		}
		try {
			const data: CartSuccessI = await fetch(`${PUBLIC_API_URL}/cart/checkout`, {
				method: 'POST',
				headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
				body: JSON.stringify(body)
			}).then((res) => {
				if (!res.ok) throw res;
				return res.json();
			});

			await goto(
				`/shop/confirm?redirect_status=succeeded&checkout_uuid=${data.checkout.checkout_uuid}&tracker_id=${data.tracker_id}`,
				{ replaceState: true, noScroll: false }
			);

		} catch (error) {
			submitError = error instanceof Error ? error : Error('Error submitting user');
		} finally {
			if (submitError === null) {
				successToast("Toegevoegd!")
			} else {
				failedToast(`Gefaald`)
			}
			loadingHTTP = false;
		}
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

	<section class="mb-10">
		<h2>Vul gegevens in</h2>

		<form class="ingenium-form flex flex-col items-center"
					action="#" onsubmit={ (e) => { e.preventDefault(); checkForm() } }>
			<fieldset>
				<h4>Email</h4>
				<div class="form-field">
					<input bind:value={registerForm.email}>
				</div>
				<p class="text-center">Hier versturen we je registratie</p>

				<h4>Naam & Voornaam</h4>
				<div class="flex flex-row gap-4">
					<div class="form-field">
						<input bind:value={registerForm.voornaam}>
					</div>

					<div class="form-field">
						<input bind:value={registerForm.name}>
					</div>
				</div>
				<p class="text-center">Achternaam & Voornaam</p>
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
										{bannerObj === null ? "---": bannerObj.affiniteit}
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
										{company.affiniteit}
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
							<h4 class="font-bold text-center">{registerForm.banner['affiniteit']}</h4>
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
										{bannerObj === null ? "---": bannerObj.affiniteit}
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
										{bannerObj === null ? "---": bannerObj.affiniteit}
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

			<button class="button button-primary">Inschrijven</button>
		</form>

	</section>
</main>


<Modal title="Registreer" bind:isOpen={ modalOpen }>
	{#snippet children()}
		<div class="p-4 md:p-5">

			<form action="#" onsubmit={ (e) => { e.preventDefault(); submitBadge() } } class="mt-4 space-y-3 text-left">
				<div class="form-field">
					<label for="name">CAPTCHA</label>
					<div id="turnstile-captcha" bind:this={ turnstileElement }></div>
				</div>

				<div class="form-field">
					<button type="submit" class="button button-primary button-full" disabled={ confirmButtonDisabled }>Bevestigen</button>
				</div>
			</form>
		</div>
	{/snippet}
</Modal>