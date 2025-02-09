<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import { cartDetails, cartProducts, removeProductFromCart } from '$lib/states/cart.svelte';
	import {hasRole, isAuthenticated} from "$lib/states/auth.svelte.js";

	const totalPrice = $derived.by(() => {
		return cartProducts.reduce((total, product) => {
			return total + product.price_policy.price;
		}, 0);
	})
</script>

<svelte:head>
	<title>Winkelwagen | IngeniumUA</title>
</svelte:head>

<header>
	<Header whiteTheme={true} />
</header>

<main class="ingenium-container">
	<h1 class="white-section-title white-section-title-large white-section-title-blue">Winkelwagen</h1>
	<p>Dit zijn alle producten in jouw winkelwagen.</p>

	{#if cartProducts.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<!-- CART LIST -->
			<section class="col-span-1 md:col-span-2 lg:col-span-3">
				<h2 class="sr-only">De volgende producten zitten in jouw winkelwagen:</h2>
				<ul class="cart-list">
					{#each cartProducts as product, idx }
						<li class="cart-list-product">
							<div class="cart-list-product__content">
								<p class="cart-list-product__title">
									{ product.name }{ product.price_policy.name !== null ? ': ' + product.price_policy.name : '' }
								</p>
								{#if product.product_meta.other_meta_data}
									<ul class="cart-list-product__options">

									</ul>
								{/if}
								<p class="cart-list-product__price">&euro; { product.price_policy.price }</p>
							</div>

							<div class="cart-list-product__actions">
								<button type="button" onclick={ () => removeProductFromCart(idx) }>
									<span class="sr-only">{ product.name } verwijderen uit je winkelwagen.</span>
									<svg class="h-5 w-5" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</section>

			<!-- CART SUMMARY -->
			<aside>
				<div class="cart-summary">
					<h2 class="cart-summary__title">Overzicht</h2>
					<dl class="cart-summary__items">
						<dt>Totaal</dt>
						<dd>&euro; { totalPrice }</dd>
					</dl>

					{#if !isAuthenticated()}
						<div class="form-field mt-2">
							<label for="guest-email" style="font-weight:bold;" >E-mailadres</label>
							<input type="email" id="guest-email" autocomplete="email" required bind:value={ cartDetails.guestEmail } />
						</div>
					{/if}

					<div class="form-field mt-2">
						<label for="remarks">Opmerkingen <span class="sr-only">Dit veld kan je invullen indien je een opmerking wil toevoegen.</span></label>
						<textarea name="remarks" id="remarks" rows="3" class="w-full resize-none" bind:value={ cartDetails.note }></textarea>
					</div>

					{#if hasRole('staff')}
						<div class="form-field form-field-checkbox mt-4">
							<input id="staffCheckout" type="checkbox" bind:checked={ cartDetails.staffCheckout } />
							<label for="staffCheckout">Dit is een kassa bestelling</label>
						</div>
					{/if}

					<a class="mt-4 button button-sm button-primary button-full" href="/shop/pay">
						<span class="text-inherit">Naar betalen</span>
						<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</a>
				</div>
			</aside>
		</div>
	{:else}
		<div class="alert alert-warning alert-border">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm text-yellow-700">
						Jouw winkelwagen is leeg! Op zoek <a href="/events">onze evenementen</a> of onze <a href="/shop">winkel</a>?
					</p>
				</div>
			</div>
		</div>
	{/if}
</main>


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

  .cart-summary {
    @apply flex flex-col p-4 bg-gray-50;

    .cart-summary__title {
      @apply text-lg mb-2;
    }

    .cart-summary__items {
      @apply flex-1 grid grid-cols-3 gap-y-6;

      dt {
        @apply col-span-2 text-gray-500;
      }

      dd {
        @apply text-right;
      }
    }

    .form-field {
      label {
        @apply text-gray-500;
      }
    }
  }
</style>