<script lang="ts">
	import '../assets/scss/styles.scss';

	import { browser } from '$app/environment';

	import { auth } from "$lib/states/auth.svelte.js";
	import { retrieveProductsFromLocalStorage } from "$lib/states/cart.svelte";
	import Footer from '$lib/components/layout/footer.svelte';
	import GlobalPageSpinner from '$lib/components/spinners/global-page-spinner.svelte';

	let { children, data } = $props();
	if (browser) {
		auth.userManager = data.oidcClient;
		auth.user = data.user;
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

