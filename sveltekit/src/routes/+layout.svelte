<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from '$app/environment';
	import { userState } from "$lib/states/user.svelte";
	import {getUserFromLocalStorage, setupOidcClient} from "$lib/auth/auth";
	import Footer from '$lib/components/layout/footer.svelte';
	import '../assets/scss/styles.scss';

	let { children } = $props();

	// Setup oidc client on client
	if (browser) {
		userState.oidcClient = setupOidcClient();
		const user = getUserFromLocalStorage();
		if (user) {
			Object.assign(userState, user);
		}
	}
</script>

<svelte:head>
	<title>Ingenium UA - Studentenvereninging FTI</title>
	<meta name="description" content="Sinds 2018 is Ingenium de officiële faculteitsvereniging van de faculteit Toegepaste Ingenieurswetenschappen aan de Universiteit Antwerpen.">
</svelte:head>

<div class="flex-1">
	{@render children()}
</div>
<Footer />
