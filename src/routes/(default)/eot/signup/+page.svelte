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

	interface Banner {
		badge_type: string;
		affiniteit: string;
		logo: string;
	}
	interface RegisterForm {
		email: string;
		name: string;
		voornaam: string;
		badgy_type: string;
		affiniteit: string;
		banner: Banner | null;
	}
	let registerForm: RegisterForm = $state({
		email: '',
		name: '',
		voornaam: '',
		badgy_type: '',
		affiniteit: '',
		banner: null,
	})

	const rollen = ['Masterstudent', 'Bachelorstudent', 'Bedrijfsvertegenwoordiger', 'Alumnus', 'Organisatie']

	const bannerBedrijven = [
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'ACE', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/ACE.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'AG Solutions', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/AGSolutions.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'AMS', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/AMS.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'AZO', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/AZO.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Absolem', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Absolem.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Actemium', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Actemium.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Aertssen', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Aertssen.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Agidens', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Agidens.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Akkodis', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Akkodis.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Antea group', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Anteagroup.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Aquafin', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Aquafin.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Arcadis', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Arcadis.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Artes', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Artes.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Atlas Copco Group', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/AtlasCopcoGroup.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'BDO', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/BDO.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Besix', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Besix.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Bilfinger', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Bilfinger.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Cegelec', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Cegelec.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Colsen', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Colsen.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Contec', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Contec.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'DAF', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/DAF.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'DCA', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/DCA.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'DEME', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/DEME.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Dataminded', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Dataminded.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'De roeve industries', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Deroeveindustries.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Denys', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Denys.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Dosign', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Dosign.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Elia', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Elia.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Equans', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Equans.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Evonik', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Evonik.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'FAC', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/FAC.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Ferranti', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Ferranti.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'HYE', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/HYE.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'IBS', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/IBS.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'IE-net', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/IE-net.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Ikos', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Ikos.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Infrabel', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Infrabel.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Ingenium Group', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/IngeniumGroup.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Jan De Nul', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/JanDeNul.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Johnson and Johnson', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/JohnsonandJohnson.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Pringels - Mars inc.', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/MarsSnacking.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Mervers', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Mervers.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Mindcapture', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Mindcapture.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Monizze', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Monizze.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Mourik', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Mourik.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Multi engineering', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Multiengineering.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Normec', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Normec.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Pfizer', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Pfizer.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Port of Antwerp-Bruges', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/PortofAntwerp-Bruges.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Projective group', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Projectivegroup.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Redwire', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Redwire.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Renotec', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Renotec.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'SBE', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/SBE.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Sarens', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Sarens.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Sea-invest', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Sea-invest.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Smulders', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Smulders.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Stadsbader', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Stadsbader.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Star', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Star.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Sweco', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Sweco.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Syngenia', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Syngenia.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Umicore', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Umicore.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Verhaert', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Verhaert.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Viro', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Viro.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Witteveen Bos', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/WitteveenBos.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Yitch', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/bedrijven_logo/Yitch.png' },
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Universiteit Antwerpen', logo: 'UAntwerpen.png'},
		{ form_field_name: null, badge_type: 'bedrijf', affiniteit: 'Engineers of Tomorrow', logo: 'EoT.jpg'},
	];

	const bannerBestuur = [
		{form_field_name: null, badge_type: 'organisatie', affiniteit: 'Ingenium', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/organisatie_logo/ingenium.png'},
		{form_field_name: null, badge_type: 'organisatie', affiniteit: 'DavingA', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/organisatie_logo/davinga.png'},
		{form_field_name: null, badge_type: 'organisatie', affiniteit: 'FTI', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/organisatie_logo/fti.png'},
		{form_field_name: null, badge_type: 'organisatie', affiniteit: 'Engineers of Tomorrow', logo: '/fti.png'},
	]

	const bannerMasterStudenten = [
		{form_field_name: 'Elektromechanica', affiniteit: 'Masterstudent', badge_type: 'student',  logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/em_logo.png'},
		{form_field_name: 'Chemie', 				  affiniteit: 'Masterstudent', badge_type: 'student',  logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/ch_logo.png'},
		{form_field_name: 'Biochemie', 				affiniteit: 'Masterstudent', badge_type: 'student',  logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/bch_logo.png'},
		{form_field_name: 'Bouwkunde', 				affiniteit: 'Masterstudent', badge_type: 'student',  logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/bk_logo.png'},
		{form_field_name: 'Elektronica-ICT',  affiniteit: 'Masterstudent', badge_type: 'student', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/ei_logo.png'},
		{form_field_name: 'Wetenschappen', 		affiniteit: 'Masterstudent', badge_type: 'student',  logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/wet_logo.png'},
		{form_field_name: 'Andere',					  affiniteit: 'Masterstudent', badge_type: 'student',  logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/geen_richting.png'},
	]
	const bannerBachelorStudenten = [
		{form_field_name: 'Elektromechanica', affiniteit: 'Bachelorstudent', badge_type: 'student',  logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/em_logo.png'},
		{form_field_name: 'Chemie', 				  affiniteit: 'Bachelorstudent', badge_type: 'student',  logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/ch_logo.png'},
		{form_field_name: 'Biochemie', 				affiniteit: 'Bachelorstudent', badge_type: 'student',  logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/bch_logo.png'},
		{form_field_name: 'Bouwkunde', 				affiniteit: 'Bachelorstudent', badge_type: 'student',  logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/bk_logo.png'},
		{form_field_name: 'Elektronica-ICT',  affiniteit: 'Bachelorstudent', badge_type: 'student', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/ei_logo.png'},
		{form_field_name: 'Wetenschappen', 		affiniteit: 'Bachelorstudent', badge_type: 'student',  logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/wet_logo.png'},
		{form_field_name: 'Andere',					  affiniteit: 'Bachelorstudent', badge_type: 'student',  logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/studenten_logo/geen_richting.png'},
	]

	const bannerAlumnus = [
		{form_field_name: 'Elektromechanica', affiniteit: 'Alumni', badge_type: 'alumnus', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/alumni_logo/em_alum.png'},
		{form_field_name: 'Chemie', affiniteit: 'Alumni', badge_type: 'alumnus', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/alumni_logo/ch_alum.png'},
		{form_field_name: 'Bouwkunde', affiniteit: 'Alumni', badge_type: 'alumnus', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/alumni_logo/bk_alum.png'},
		{form_field_name: 'Elektronica-ICT', affiniteit: 'Alumni', badge_type: 'alumnus', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/alumni_logo/ei_alum.png'},
		{form_field_name: 'Andere', affiniteit: 'Alumni', badge_type: 'alumnus', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/eot/2026/alumni_logo/geen_alum.png'},
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

	function selectCompany(banner: Banner) {
		registerForm.banner = banner;
		open = false;
	}

	/**
	 * Turnstile
	 */
	let turnstileLoaded: boolean = $state(false);
	let turnstileElement: HTMLElement | undefined = $state();
	let turnstileWidgetId = '';

	if (browser) {
		window.onloadTurnstileCallback = () => {
			turnstileLoaded = true;
		}
	}

	let turnstileToken: string | null = $state(null)

	/**
	 * Submit logic
	 */
	let loadingHTTP = $state(false)
	let submitError: Error | null = $state(null)

	let modalOpen = $state(false);

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

		if (registerForm.banner === null) return;

		let item_id = 725;
		let blueprint_id = 241;
		let price_policy_id = 342;

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
									badge_type: registerForm.banner["badge_type"],
									affiniteit: registerForm.banner["affiniteit"],
									banner: registerForm.banner["logo"].split("/").slice(-1),
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
				<p>How to register: <span class="font-bold">you will receive an email with a QR-code within the minute. This QR-code can then be used to print your personalized badge..</span></p>
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
				<!-- Masterstudent #179b83 -->
				<article style="background-color: #0a7791">
					<fieldset>
						<h4>Selecteer je afstudeerrichting</h4>
						<div class="form-field">
							<select required bind:value={registerForm.banner}>
								{#each [null, ...bannerMasterStudenten] as bannerObj}
									<option value={bannerObj}>
										{bannerObj === null ? "---": bannerObj.form_field_name}
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
				<!-- Bachelorstudent #179b83 -->
				<article style="background-color: #0a7791">
					<fieldset>
						<h4>Selecteer je afstudeerrichting</h4>
						<div class="form-field">
							<select required bind:value={registerForm.banner}>
								{#each [null, ...bannerBachelorStudenten] as bannerObj}
									<option value={bannerObj}>
										{bannerObj === null ? "---": bannerObj.form_field_name}
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
			{:else if (registerForm.badgy_type === rollen[2])}
				<!-- Bedrijf #cc7056-->
				<article style="background-color: #ffffff">
					<h2>Selecteer je bedrijf</h2>

					<input
						class="form-field w-full"
						placeholder="Zoek je bedrijf..."
						bind:value={query}
						onfocus={() => (open = true)}
					/>

					{#if open}
						<ul
							class="absolute left-0 top-full mt-1 w-full bg-white max-h-60 overflow-y-auto rounded shadow border z-10"
						>
							{#each filtered as company}
								<li
									class="px-3 py-2 hover:bg-gray-200 cursor-pointer"
									onclick={() => selectCompany(company)}
								>
									{company.affiniteit}
								</li>
							{/each}

							{#if filtered.length === 0}
								<li class="px-3 py-2 text-gray-400">Geen bedrijven gevonden</li>
							{/if}
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
			{:else if (registerForm.badgy_type === rollen[3])}
				<!-- Alumnus #3083dc -->
				<article style="background-color: #0a7791">
					<fieldset>
						<h4>Selecteer je afstudeerrichting</h4>
						<div class="form-field">
							<select required bind:value={registerForm.banner}>
								{#each [null, ...bannerAlumnus] as bannerObj}
									<option value={bannerObj}>
										{bannerObj === null ? "---": bannerObj.form_field_name}
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
			{:else if (registerForm.badgy_type === rollen[4])}
				<!-- Organisatie bg-ingenium-grey-700 -->
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