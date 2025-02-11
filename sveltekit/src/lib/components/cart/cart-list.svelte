<script lang="ts">
  import { cartDetails, cartProducts, removeProductFromCart } from "$lib/states/cart.svelte";

  const { loading = false } = $props();
</script>

<!-- CART LIST -->
<section class="col-span-1 md:col-span-2 lg:col-span-3">
  <h2 class="sr-only">De volgende producten zitten in jouw winkelwagen:</h2>
  <ul class="cart-list">
    {#each cartProducts as product, idx }
      <li class="cart-list-product">
        <div class="cart-list-product__content">
          <p class="cart-list-product__title">
            { product.name }{ product.price_policy !== null && product.price_policy.name !== null ? ': ' + product.price_policy.name : '' }
          </p>
          {#if product.product_meta.other_meta_data}
            <ul class="cart-list-product__options">
              {#each Object.keys(product.product_meta.other_meta_data) as key }
                <li>
                  <span class="capitalize">{ key }</span>: <span>{ product.product_meta.other_meta_data[key] }</span>
                </li>
              {/each}
            </ul>
          {/if}
          <p class="cart-list-product__price">&euro; { product.price_policy !== null ? product.price_policy.price : '???' }</p>
        </div>

        <div class="cart-list-product__actions">
          {#if !cartDetails.isPaying || loading}
            <button type="button" onclick={ () => removeProductFromCart(idx) }>
              <span class="sr-only">{ product.name } verwijderen uit je winkelwagen.</span>
              <svg class="h-5 w-5" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</section>

<style lang="scss">
  .cart-list {
    @apply space-y-4;

    .cart-list-product {
      @apply grid grid-cols-6 py-4 border-b border-gray-100;

      .cart-list-product__title {
        @apply text-base;
      }

      .cart-list-product__price {
        @apply font-bold text-black mt-1.5;
      }

      .cart-list-product__content {
        @apply col-span-5;
      }

      .cart-list-product__actions {
        // align items to the end
        @apply flex items-end justify-end;

        button {
          @apply text-black hover:text-gray-600;
        }
      }

      .cart-list-product__options {
        @apply text-gray-500 text-sm;
      }
    }
  }
</style>