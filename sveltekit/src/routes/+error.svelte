<script lang="ts">
  import { page } from '$app/state';
  import Header from '$lib/components/layout/header.svelte';
</script>

<header>
  <Header whiteTheme={true} />
</header>

<main class="relative h-full" id="main-content">
  <div class="ingenium-container">
    <h1 class="white-section-title white-section-title-blue white-section-title-large">{page.status} - {page.error.message}</h1>
    <p></p>
  </div>
</main>