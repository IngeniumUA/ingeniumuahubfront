<script lang="ts">
	import '../../assets/scss/styles.scss';
	import opengraphImg from '$assets/images/opengraph_galabal.webp';

	import { browser } from '$app/environment';
	import { page } from '$app/state';

	import { retrieveProductsFromLocalStorage } from "$lib/states/cart.svelte";
	import Footer from '$lib/components/layout/footer.svelte';
	import GlobalPageSpinner from '$lib/components/spinners/global-page-spinner.svelte';
	import { auth } from '$lib/states/auth.svelte';
	import { onMount, setContext } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	import { SvelteToast } from '@zerodevx/svelte-toast';

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

<svelte:head>
	<title>Ingenium UA - Studentenvereninging FTI</title>
	{#if page.route.id !== '/events/[event]'} <!-- BYPASS FOR SVELTE NOT ABLE TO OVERWRITE THESE TAGS -->
		<meta name="description" content="Sinds 2018 is Ingenium de officiële faculteitsvereniging van de faculteit Toegepaste Ingenieurswetenschappen aan de Universiteit Antwerpen.">
		<meta property="og:image" content={ opengraphImg } />
	{/if}
</svelte:head>

<GlobalPageSpinner />
<div id="wrapper">
	{@render children()}
</div>
<Footer serverHostname={ data.serverHostname } enabled={data.footerEnabled} />

<SvelteToast />

<style lang="scss">
  :root {
    --toastBarHeight: 0px;
    --toastBorderRadius: 4px;
  }
</style>