<script lang="ts">
	import Footer from '$lib/components/layout/footer.svelte';
	import '../assets/scss/styles.scss';

	let { children } = $props();
</script>

<svelte:head>
	<title>Ingenium UA - Studentenvereninging FTI</title>
	<meta name="description" content="Sinds 2018 is Ingenium de officiële faculteitsvereniging van de faculteit Toegepaste Ingenieurswetenschappen aan de Universiteit Antwerpen.">
</svelte:head>

<div class="flex-1">
	{@render children()}
</div>
<Footer />
