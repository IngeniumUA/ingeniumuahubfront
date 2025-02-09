<script lang="ts">
	import { onMount } from 'svelte';
	import {loadStripe} from '@stripe/stripe-js';

	import Header from '$lib/components/layout/header.svelte';
	import LoadingSpinner from '$lib/components/spinners/loading-spinner.svelte';


	onMount(async () => {
		const stripe = await loadStripe('');
	})
</script>

<svelte:head>
	<title>Winkelwagen | IngeniumUA</title>
</svelte:head>

<header>
	<Header whiteTheme={true} />
</header>

<main class="ingenium-container">
	<h1 class="white-section-title white-section-title-large white-section-title-blue">Betalen</h1>
	<p>Van zodra je bestelling is doorgestuurd kan je de betaling uitvoeren.</p>

	<LoadingSpinner loading={true} message="Je bestelling wordt verwerkt" />
</main>