<script lang="ts">
	import { page } from '$app/state';

	import '../assets/scss/styles.scss';
	import opengraphImg from '$assets/images/opengraph_galabal.webp';
	import GlobalPageSpinner from '$lib/components/spinners/global-page-spinner.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Ingenium UA - Studentenvereninging FTI</title>
	{#if page.route.id !== '/events/[event]'} <!-- BYPASS FOR SVELTE NOT ABLE TO OVERWRITE THESE TAGS -->
		<meta name="description" content="Sinds 2018 is Ingenium de officiële faculteitsvereniging van de faculteit Toegepaste Ingenieurswetenschappen aan de Universiteit Antwerpen.">
		<meta property="og:image" content={ opengraphImg } />
	{/if}
</svelte:head>


<GlobalPageSpinner />
{@render children()}
