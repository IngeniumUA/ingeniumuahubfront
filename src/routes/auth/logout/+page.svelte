<script lang="ts">
  import Header from "$lib/components/layout/header.svelte";
  import { storeTokens } from '$lib/auth/auth';
  
  storeTokens(undefined);
</script>

<svelte:head>
  <title>Afgemeld | IngeniumUA</title>
  <meta name="robots" content="noindex">
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main class="ingenium-container text-center flex flex-1 flex-col justify-center items-center h-full">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12 stroke-blue-750 mb-2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
  <h1 class="white-section-title white-section-title-large">Je bent afgemeld</h1>
  <a href="/" class="button button-outline-blue button-sm mt-4">Terug naar de home pagina</a>
</main>