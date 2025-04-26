<script lang="ts">
  import type { PageProps } from './$types';
  import type { ProductGroupI } from '$lib/models/productsI';

  import Header from '$lib/components/layout/header.svelte';
  import ProductItemSelector from '$lib/components/products/product-item-selector.svelte';
  import {calcColorIntensity, transformColorToRGBA} from "$lib/utilities/style-utilities";
  import { cartProducts } from '$lib/states/cart.svelte';

  let { data }: PageProps = $props();
  let currentCategory = $state(0);

  function buttonStyle(category: number) {
    if (category === currentCategory) {
      return 'text-black bg-white font-bold';
    }
  }

  // Get the categories in sorted order
  let categories = $derived.by(() => {
    if (data.products === undefined || data.products.length === 0) return [];

    return data.products
      .sort((a, b) => {
        return b.ordering - a.ordering;
      })
      .reduce<string[]>((acc, product) => {
        if (!acc.includes(product.product_meta.categorie)) {
          acc.push(product.product_meta.categorie);
        }
        return acc;
      }, []);
  });

  // Get the products of the selected category
  // I don't really like this as it can probably be simplified but ok
  let products = $derived.by(() => {
    if (data.products === undefined || data.products.length === 0) return [];

    return data.products.reduce<ProductGroupI[]>((acc, product) => {
      // If the product is not part of the category
      if (product.product_meta.categorie !== categories[currentCategory]) {
        return acc;
      }

      // Find if the group already exists, if not add it
      const groupIdx = acc.findIndex((g) => g.group_name === product.product_meta.group);
      if (groupIdx === -1) {
        acc.push({
          group_name: product.product_meta.group,
          products: [
            product
          ]
        })
      } else {
        acc[groupIdx].products.push(product);

        // Sort the products
        acc[groupIdx].products = acc[groupIdx].products.sort((a, b) => {
          const orderingA = Math.max(a.ordering, a.price_policy?.ordering ?? Number.MIN_SAFE_INTEGER);
          const orderingB = Math.max(b.ordering, b.price_policy?.ordering ?? Number.MIN_SAFE_INTEGER);
          return orderingB - orderingA;
        });
      }

      return acc;
    }, []);
  });

  let primaryColor = $derived.by(() => {
    return transformColorToRGBA(data.event?.derived_type.display.color);
  });
  let secondaryColor = $derived.by(() => {
    return calcColorIntensity(data.event?.derived_type.display.color) < 180 ? 'white' : 'black';
  });

  let pageTitle = $derived.by(() => `${data.event.item.name} | IngeniumUA`);
</script>

<svelte:head>
  <title>{ pageTitle }</title>
  <meta property="og:title" content={ pageTitle } />
  <meta property="og:description" content={ data.event.item.description } />
  <meta property="og:image" content={ data.event.derived_type.display.image_square } />
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main class="ingenium-container relative h-full">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <section class="col-span-1 md:col-span-2">
      <h1 class="white-section-title white-section-title-large">{ data.event.item.name }</h1>
      <p>{ data.event.item.description }</p>

      {#if Array.isArray(data.products) && data.products.length > 0}
        <nav class="categorie-section" style:background-color={ primaryColor }>
          {#each categories as name, idx }
            <button class="categorie-button { buttonStyle(idx) }" onclick="{ () => currentCategory = idx }"
                    style:color={ currentCategory === idx ? 'inherit' : secondaryColor }>
              { name }
            </button>
          {/each}
        </nav>

        <ul aria-label="Product groepen">
          {#each products as group }
            <li class="product-group">
              <p>{ group.group_name }</p>
              <ul class="products" style:border-color={ primaryColor }>
                {#each group.products as product }
                  <li>
                    <ProductItemSelector { product } />
                  </li>
                {/each}
              </ul>
            </li>
          {/each}
        </ul>
      {:else}
        <p>Er zijn geen producten beschikbaar voor deze activiteit.</p>
      {/if}

      <div class="cart-button-container">
        <a href="/shop/cart" class="button button-primary">Winkelwagen bekijken ({ cartProducts.length })</a>
      </div>
    </section>
    <aside>
      <img src="{ data.event.derived_type.display.image_square }" alt="" aria-hidden="true" loading="eager"
        class="max-w-full rounded-lg shadow-2xl">
    </aside>
  </div>
</main>

<style lang="scss">
  .product-group {
    @apply mt-3;

    p {
      @apply text-lg font-semibold;
    }

    .products {
      @apply ml-2 border-l border-blue-900;
    }

    &:first-child {
      @apply mt-0;
    }
  }

  .cart-button-container {
    @apply text-center md:text-right mt-4;

    .button {
      @apply w-full text-center justify-center md:w-auto md:justify-start md:text-left;
    }
  }

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
</style>