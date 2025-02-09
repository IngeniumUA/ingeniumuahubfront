<script lang="ts">
  import { onMount } from "svelte";
  import { page } from '$app/state';
  import { auth } from "$lib/states/auth.svelte.js";
  import Header from "$lib/components/layout/header.svelte";

  onMount(async () => {
    await auth.doLogin({
      next: page.url.searchParams.get('next') || '/',
    });
  });
</script>

<svelte:head>
  <meta name="robots" content="noindex">
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main class="ingenium-container h-full text-center flex flex-1 flex-col justify-center items-center">
  <h1 class="white-section-title white-section-title-blue white-section-title-large">Aanmelden</h1>
  <p>Je wordt automatisch doorverwezen, even geduld...</p>
</main>