<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';

	import { retrieveProductsFromLocalStorage } from "$lib/states/cart.svelte";
	import Footer from '$lib/components/layout/footer.svelte';
	import { auth } from '$lib/states/auth.svelte';
	import { setContext } from 'svelte';

	let { children, data } = $props();

	if (page.route.id !== '/auth/logout') {
		setContext()
		auth.user = data.user;
	}

	if (browser) {
		retrieveProductsFromLocalStorage();
	}
</script>

<div id="wrapper">
	{@render children()}
</div>
<Footer serverHostname={ data.serverHostname } />

