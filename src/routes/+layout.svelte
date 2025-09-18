<script lang="ts">
	import { page } from '$app/state';

	import '../assets/scss/styles.scss';
	import opengraphImg from '$assets/images/opengraph_galabal.webp';
	import GlobalPageSpinner from '$lib/components/spinners/global-page-spinner.svelte';
	import { PUBLIC_UMAMI_WEBSITE_ID } from '$env/static/public';
	import { onMount } from 'svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast'

	let { children } = $props();

	// Default options for toastr
	const options = {

	}

	// Umami Tracking script
	// Inject Umami script dynamically on mount
	onMount(() => {
		if (!PUBLIC_UMAMI_WEBSITE_ID) return;

		const script = document.createElement('script');
		script.defer = true;
		script.src = 'https://traffic.ingeniumua.be/script.js';
		script.setAttribute('data-website-id', PUBLIC_UMAMI_WEBSITE_ID);
		document.head.appendChild(script);
	});

</script>

<svelte:head>
	<title>Ingenium UA - Studentenvereniging FTI</title>
	{#if page.route.id !== '/events/[event]'} <!-- BYPASS FOR SVELTE NOT ABLE TO OVERWRITE THESE TAGS -->
		<meta name="description" content="Sinds 2018 is Ingenium de officiële faculteitsvereniging van de faculteit Toegepaste Ingenieurswetenschappen aan de Universiteit Antwerpen.">
		<meta property="og:image" content={ opengraphImg } />
	{/if}
</svelte:head>

<SvelteToast {options} />
<GlobalPageSpinner />
{@render children()}
