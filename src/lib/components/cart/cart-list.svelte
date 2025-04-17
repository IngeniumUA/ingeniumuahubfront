<script lang="ts">
  import {
    cartDetails,
    cartProducts,
    getFailedProduct,
    removeProductFromCart,
    updateProductMeta
  } from '$lib/states/cart.svelte';
  import type { ProductFormI } from '$lib/models/productsI';

  const { loading = false } = $props();

  function getRadioId(cartIndex: number, metaKey: string, formKey: string, option: string) {
    return `${cartIndex}-${metaKey}-${formKey}-${option}`;
  }

  // This is stupid rn, as it just makes sure the type is set correctly.
  // This will be changed in an upcoming update
  function getFormData(meta: string|object|undefined): ProductFormI {
    return meta as ProductFormI;
  }
</script>

<!-- CART LIST -->
<section class="col-span-1 md:col-span-2 lg:col-span-3">
  <h2 class="sr-only">De volgende producten zitten in jouw winkelwagen:</h2>
  <ul class="cart-list">
    {#each cartProducts as product, idx}
      <li class="cart-list-product">
        <div class="cart-list-product__content">
          <p class="cart-list-product__title">
            { product.name }{ product.price_policy !== null && product.price_policy.name !== null ? ': ' + product.price_policy.name : '' }
          </p>
          {#if product.product_meta.other_meta_data}
            <ul class="cart-list-product__options">
              {#each Object.entries(product.product_meta.other_meta_data) as [key, meta] }
                <li>
                  {#if key !== "form"}
                    <span class="capitalize">{ key }</span>: <span>{ meta }</span>
                  {:else}
                    {#each Object.entries(getFormData(meta)) as [formKey, formField] }
                      {#if formField['type'] !== "option" }
                        <input required type="{ formField['type'] }" id="{ product.origin_item_id + key }"
                          value={ formField['value'] } oninput={ (e) => updateProductMeta(idx, formKey, formField, e.currentTarget) } />
                      {:else if formField['type'] === "option" && formField['options'] }
                        <p>Selecteer een keuze:</p>
                        {#each formField['options'] as option}
                          <div class="form-field-checkbox space-y-2 ml-2">
                            <input type="radio" id={ getRadioId(idx, key, formKey, option) } name={ `${idx}-${key}-${formKey}` }
                                   value={ option } checked={ formField['value'] === option }
                                   onchange={ (e) => updateProductMeta(idx, formKey, formField, e.currentTarget) } />
                            <label for={ getRadioId(idx, key, formKey, option) }>{ option }</label>
                          </div>
                        {/each}
                      {:else}
                        <p>Unknown field input</p>
                      {/if}
                    {/each}
                  {/if}
                </li>
              {/each}
            </ul>
          {/if}
          <p class="cart-list-product__price">&euro; { product.price_policy !== null ? product.price_policy.price : '???' }</p>

          <!-- Update this, as it is quite bad -->
          {#if getFailedProduct(product)}
            <p class="text-sm">
              <span class="text-red-700 font-bold underline">Kan niet aangekocht worden:</span>
              <span class="text-ingenium-grey-700 lowercase">
                {#if !getFailedProduct(product).auth_error }
                    { getFailedProduct(product).non_auth_error.error_nl }
                {:else}
                    { getFailedProduct(product).auth_error.error_nl }
                {/if}
              </span>
            </p>
          {/if}
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