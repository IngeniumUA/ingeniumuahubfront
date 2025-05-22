<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';

	import { retrieveProductsFromLocalStorage } from "$lib/states/cart.svelte";
	import Footer from '$lib/components/layout/footer.svelte';
	import { auth } from '$lib/states/auth.svelte';
	import { onMount, setContext } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	let { children, data } = $props();

	if (page.route.id !== '/auth/logout') {
		setContext()
		auth.user = data.user;
	}

	if (browser) {
		retrieveProductsFromLocalStorage();
	}

	onMount(() => {
		afterNavigate((nav) => {
			const currentUrl = nav.to?.url?.pathname || '';

			if (!currentUrl.includes('cloud')) {
				localStorage.removeItem('fetched_file_list');
			}
		});
	});
</script>

<div id="wrapper">
	{@render children()}
</div>
<Footer serverHostname={ data.serverHostname } />

