<script lang="ts">
  import type { PageProps } from './$types';
  import type {ProductOutI} from "$lib/models/productsI";

  import Header from '$lib/components/layout/header.svelte';
  import ProductItemSelector from '$lib/components/products/product-item-selector.svelte';
  import {transformColorToRGBA} from "$lib/utilities/style-utilities";

  let { data }: PageProps = $props();

  let categories: Record<string, Record<string, ProductOutI[]>> = $derived.by(() => {
    if (data.products === undefined || data.products.length === 0) return [];

    // Go over each product and group them by `product_meta.categorie` and `product_meta.group`
    return data.products.reduce((acc, product) => {
      let category = product.product_meta.categorie;
      let group = product.product_meta.group;

      // If the category doesn't yet exist in the accumulator, create it
      if (!acc[category]) acc[category] = {};
      // If the group doesn't yet exist in the category, create it
      if (!acc[category][group]) acc[category][group] = [];

      acc[category][group].push(product);

      return acc;
    }, {});
  });
  let currentCategory = $state(Object.keys(categories)[0]);

  function buttonStyle(category: string) {
    if (category === currentCategory) {
      return 'text-black bg-white font-bold';
    }
  }
</script>

<header>
  <Header whiteTheme={true} />
</header>

<main class="ingenium-container relative h-full">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <section class="col-span-1 md:col-span-2">
      <h1 class="white-section-title white-section-title-large">{ data.event.item.name }</h1>
      <p>{ data.event.item.description }</p>

      {#if Array.isArray(data.products) && data.products.length > 0}
        <nav role="tablist" class="categorie-section" style:background-color={ transformColorToRGBA(data.event.derived_type.display.color) }>
          {#each Object.keys(categories) as name }
            <button class="categorie-button { buttonStyle(name) }" onclick="{ () => currentCategory = name }">
              { name }
            </button>
          {/each}
        </nav>

        {#if currentCategory !== ''}
          {#each Object.keys(categories[currentCategory]) as group }
            <section class="product-group">
              <h3>{ group }</h3>
              <div class="products">
                {#each categories[currentCategory][group] as product }
                  <ProductItemSelector { product } />
                {/each}
              </div>
            </section>
          {/each}
        {/if}
      {:else}
        <p>Er zijn geen producten beschikbaar voor deze activiteit.</p>
      {/if}
    </section>
    <aside>
      <img src="{ data.event.derived_type.display.image_square }" alt="" aria-hidden="true" loading="eager"
        class="max-w-full rounded-lg shadow-2xl">
    </aside>
  </div>
</main>

<style lang="scss">
  section {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  /* Categorie bar */
  .categorie-section {
    position: relative;
    margin-top: 0;
    top: -10px;

    width: 100%;
    height: 2rem;

    border-top-left-radius: 10px;
    border-top-right-radius: 10px;


    display: flex;
    flex-direction: row;
  }
  .categorie-section .categorie-button {
    height: 100%;
    max-width: 50%;
    flex-grow: 1;

    text-align: center;
    border-collapse: separate;

    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  /* Products */
  .product-group {
    padding-left: 10px;
    padding-right: 10px;
  }
  .product-group h3 {
    font-weight: bolder;
    font-family: D-DIN Condensed, D-DIN, sans-serif;

    font-size: 1.1rem;
    color: var(--mainblue);
  }

  .product-group .products {
    padding-left: 5px;
    padding-bottom: 0.5rem;

    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  /* Order button */
  .order-section {
    width: 100%;

    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    margin-bottom: 2rem;

    border: solid var(--ingenium-grey) 2px;
    border-left: none;
    border-right: none;

    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>