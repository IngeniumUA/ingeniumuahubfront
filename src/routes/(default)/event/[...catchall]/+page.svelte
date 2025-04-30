<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
  import Header from '$lib/components/layout/header.svelte';

  const newUrl = page.url.pathname.replace('/event', '/events')
  goto(newUrl);
</script>

<header>
  <Header whiteTheme={true} />
</header>

<main id="main-content">
  <div class="ingenium-container">
    <h1 class="white-section-title white-section-title-blue white-section-title-large">Redirecting...</h1>
    <p></p>
  </div>
</main>