<script lang="ts">
	import { browser } from '$app/environment';
	import { oidcClient, user } from "$lib/states/user.svelte";
	import { setupOidcClient } from "$lib/auth/auth";

	import Footer from '$lib/components/layout/footer.svelte';
	import GlobalPageSpinner from '$lib/components/spinners/global-page-spinner.svelte';

	import '../assets/scss/styles.scss';
	import { retrieveProductsFromLocalStorage } from '$lib/states/cart.svelte';

	let { children, data } = $props();

	// Setup oidc client and retrieve cart products
	if (browser) {
		setupOidcClient(oidcClient, user);
		retrieveProductsFromLocalStorage();
	}
</script>

<svelte:head>
	<title>Ingenium UA - Studentenvereninging FTI</title>
	<meta name="description" content="Sinds 2018 is Ingenium de officiële faculteitsvereniging van de faculteit Toegepaste Ingenieurswetenschappen aan de Universiteit Antwerpen.">
</svelte:head>

<GlobalPageSpinner />
<div class="flex-1">
	{@render children()}
</div>
<Footer serverHostname={ data.serverHostname } />

