<script>
  import Header from '$lib/components/layout/header.svelte';
  import { cartProducts } from "$lib/states/cart.svelte";
  import RecSysPreviewItem from "$lib/components/recsys/rec-sys-preview-item.svelte";

  const { data } = $props();
</script>

<svelte:head>
  <title>Shop | Ingenium UA</title>
</svelte:head>

<header>
  <Header whiteTheme={ true } />
</header>

<main class="ingenium-container" id="main-content">
  <div class="flex flex-row items-center">
    <div class="flex-1">
      <h1 class="white-section-title white-section-title-blue white-section-title-large">Shop</h1>
      <p>Hier kan je de producten van Ingenium bekijken en bestellen. Evenementen kan je <a href="/events">hier vinden</a>.</p>
    </div>
    <div>
      <a href="/shop/cart" class="button button-sm button-outline-blue">
        Winkelwagen ({ cartProducts.length })
      </a>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each data.items as item}
      <RecSysPreviewItem {item} />
    {/each}
  </div>
</main>