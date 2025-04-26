<script lang="ts">
	import { page } from "$app/state";
  import { addProductToCart, getProductCount, reduceProductQuantity } from '$lib/states/cart.svelte';
  import {getLoginUrlWithRedirect} from "$lib/auth/auth";
  import type {ProductOutI} from "$lib/models/productsI";

  let { product }: { product: ProductOutI } = $props();
  let initialCount = getProductCount(product, true); // Initial count in state
  let count = $state(initialCount)
  let inputCount = $state(initialCount);

  let name = $derived.by(() => {
    if (product.price_policy === null || product.price_policy.name === null) return product.name;
    return product.price_policy.name;
  });

  let productPrice = $derived.by(() => {
    if (product.price_policy) {
      if (product.price_policy.price > 0) {
        return `€ ${product.price_policy.price}`;
      }
      return "Gratis";
    }
    return "Onbekend";
  });

  // TODO: This needs some improvement with the input field
  function setValue(val: number) {
    const newValue = Math.min(Math.max(product.max_count, 0), val); // Clamp between 0 and max
    const diff = count - newValue;
    count = newValue;

    if (diff < 0) {
      addProductToCart(product, Math.abs(diff));
    } else if (diff > 0) {
      reduceProductQuantity(product, diff);
    }

    inputCount = newValue; //getProductCount(product, true);
  }
</script>

<div class="product-item-selector">
  <p class="product-name">
    { name }
    {#if Object.prototype.hasOwnProperty.call(product.product_meta.other_meta_data, "form") && product.product_meta.other_meta_data.form}
      <span class="text-xs text-orange-500 block italic">Product heeft personalisaties, zie winkelwagen</span>
    {/if}
  </p>

  {#if product.max_count > 0}
    <p class="product-price">{ productPrice }</p>

    <div class="button-quantity-group">
      <button disabled={ count <= 0 } onclick={ () => setValue(count - 1) }>
        <span class="sr-only">Aantal verlagen (nu: { count})</span>
        <span aria-hidden="true">&minus;</span>
      </button>

      <input type="number" min="0" max={ product.max_count }
             bind:value={ inputCount } oninput={ (e) => setValue(Number.parseInt(e.target?.value)) } />

      <button disabled={ count >= product.max_count } onclick={ () => setValue(count + 1) }>
        <span class="sr-only">Aantal verhogen (nu: { count})</span>
        <span aria-hidden="true">&plus;</span>
      </button>
    </div>
  {:else}
    <div class="product-status">
      {#if product.max_count === -1}
        <p>Uitverkocht</p>
      {:else if product.max_count === -2}
        <p>Je hebt dit al gekocht</p>
      {:else if product.max_count === -3}
        <a href={ getLoginUrlWithRedirect(undefined, page) }>Aanmelden vereist</a>
      {:else}
        <p>Toevoegen niet mogelijk</p>
      {/if}
    </div>
  {/if}
</div>


<style lang="scss">
  .button-quantity-group {
    @apply flex items-center rounded-lg border;

    button {
      @apply size-10 leading-10 font-bold transition text-blue-900 hover:text-gray-200 hover:bg-blue-900;

      &:disabled {
        @apply cursor-not-allowed text-gray-500 hover:bg-transparent;
      }

      &:first-child {
        @apply rounded-l-lg;
      }

      &:last-child {
        @apply rounded-r-lg;
      }
    }

    input {
      @apply h-10 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none;
    }
  }

  .product-status {
    p {
      @apply italic;
    }
  }

  .product-item-selector {
    @apply ml-2 py-2 flex flex-row items-center border-b border-gray-200;

    .product-name {
      @apply flex-1;
    }

    .product-price {
      @apply whitespace-nowrap pr-4 text-gray-900;
    }
  }

</style>