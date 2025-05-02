<script>
    import Header from '$lib/components/layout/header.svelte';
    import { cartProducts } from "$lib/states/cart.svelte";
    import RecSysPreviewItem from "$lib/components/recsys/rec-sys-preview-item.svelte";

    const { data } = $props();
</script>

<svelte:head>
  <title>Vacatures | Ingenium UA</title>
</svelte:head>

<header>
  <Header whiteTheme={ true } />
</header>

<main class="ingenium-container promo" id="main-content">
  <h1 class="white-section-title white-section-title-blue white-section-title-large">Vacatures</h1>
  <p></p>

  {#if (Array.isArray(data.vacancies) && data.vacancies.length > 0)}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each data.vacancies as item}
        <RecSysPreviewItem {item} />
      {/each}
    </div>
  {:else}
    <div class="alert alert-info alert-border">
      <p class="text-sm text-blue-700">Er staan momenteel geen vacatures online</p>
    </div>
  {/if}
</main>