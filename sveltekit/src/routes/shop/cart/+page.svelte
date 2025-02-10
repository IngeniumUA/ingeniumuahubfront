<script lang="ts">
	import { browser } from "$app/environment";
	import { PUBLIC_CLOUDFLARE_TURNSTILE } from "$env/static/public";
	import { hasRole, isAuthenticated } from "$lib/states/auth.svelte";
	import { getLoginUrlWithRedirect } from "$lib/auth/auth";
	import { cartDetails, cartProducts, checkoutCart } from '$lib/states/cart.svelte';
	import Header from '$lib/components/layout/header.svelte';
	import Modal from "$lib/components/layout/modal.svelte";
	import CartList from "$lib/components/cart/cart-list.svelte";
	import StripePaymentComponent from "$lib/components/cart/stripe-payment-component.svelte";
	import InsetSpinner from '$lib/components/spinners/inset-spinner.svelte';

	let error = $state(false);
	let errorMsg = $state('');
	let loading = $state(false);
	let modalOpen = $state(false);
	let turnstileLoaded = $state(false);
	let turnstileElement;
	let turnstileWidgetId = '';

	const totalPrice = $derived.by(() => {
		return cartProducts.reduce((total, product) => {
			return total + product.price_policy.price;
		}, 0);
	})
	const guestButtonDisabled = $derived.by(() => {
		return cartDetails.turnstileToken == null || cartDetails.guestEmail === '';
	});

	if (browser) {
		window.onloadTurnstileCallback = () => {
			turnstileLoaded = true;
		}
	}

	function checkCart() {
		if (isAuthenticated()) {
			doPayment();
		} else {
			modalOpen = true;
			if (turnstileWidgetId !== '') return;

			turnstileWidgetId = window.turnstile.render(turnstileElement, {
				theme: 'light',
				size: 'flexible',
				language: 'nl',
				sitekey: PUBLIC_CLOUDFLARE_TURNSTILE,
				callback: (token: string) => {
					cartDetails.turnstileToken = token;
				},
				expiredCallback: () => {
					cartDetails.turnstileToken = null;
				},
			});
		}
	}

	async function doPayment() {
		loading = true;
		modalOpen = false;

		try {
			const data = await checkoutCart();
		} catch (e) {
			loading = false;
			error = true;

			if (e instanceof Error) {
				errorMsg = e.message;
			} else {
				errorMsg = 'Unknown error';
			}
		}
	}
</script>

<svelte:head>
	<title>Winkelwagen | IngeniumUA</title>
</svelte:head>

<!-- Modal used for guest checkout -->
{#if !isAuthenticated()}
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback" defer></script>
	<Modal title="Betalen als gast" bind:isOpen={ modalOpen }>
		{#snippet children()}
			<div class="p-4 md:p-5">
				<p class="text-sm">
					Je bent niet aangemeld op onze website, hiervoor moet je enkele extra gegevens opgeven.
					<a href={ getLoginUrlWithRedirect() } class="font-bold">Toch nog aanmelden?</a>
				</p>

				<form action="#" onsubmit={ (e) => { e.preventDefault(); doPayment() } } class="mt-4 space-y-3 text-left">
					<div class="form-field">
						<label for="email">E-mailadres</label>
						<input type="email" id="email" name="email" class="w-full" required bind:value={ cartDetails.guestEmail } />
					</div>

					<div class="form-field">
						<label for="name">CAPTCHA</label>
						<div id="turnstile-captcha" bind:this={ turnstileElement }></div>
					</div>

					<div class="form-field">
						<button type="submit" class="button button-primary button-full" disabled={ guestButtonDisabled }>Bevestigen</button>
					</div>
				</form>
			</div>
		{/snippet}
	</Modal>
{/if}
{#if cartDetails.isPaying && cartDetails.stripePayment}
	<StripePaymentComponent />
{/if}

<header>
	<Header whiteTheme={true} />
</header>

<main class="ingenium-container">
	<h1 class="white-section-title white-section-title-large white-section-title-blue">Winkelwagen</h1>
	<p>Dit zijn alle producten in jouw winkelwagen.</p>

	{#if cartProducts.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<CartList loading={ loading } />

			<!-- CART SUMMARY -->
			<aside>
				<div class="cart-summary">
					{#if error}
						<div class="alert alert-danger mb-2" role="alert">
							<p class="alert-text">
								Oei, er ging iets mis bij de bestelling. <br>
								<span class="text-xs">Fout: { errorMsg }</span>
							</p>
						</div>
					{/if}

					<InsetSpinner loading={ loading } message="Je bestelling wordt gecontroleerd..." />

					<h2 class="cart-summary__title">Overzicht</h2>
					<dl class="cart-summary__items">
						<dt>Totaal</dt>
						<dd>&euro; { totalPrice }</dd>
					</dl>

					{#if !cartDetails.isPaying}
						<div class="form-field mt-2">
							<label for="remarks">Opmerkingen <span class="sr-only">Dit veld kan je invullen indien je een opmerking wil toevoegen.</span></label>
							<textarea name="remarks" id="remarks" rows="3" class="w-full resize-none"
												bind:value={ cartDetails.note } disabled={ loading }></textarea>
						</div>

						{#if hasRole('staff')}
							<div class="form-field form-field-checkbox mt-4">
								<input id="staffCheckout" type="checkbox" bind:checked={ cartDetails.staffCheckout } disabled={ loading } />
								<label for="staffCheckout">Dit is een kassa bestelling</label>
							</div>
						{/if}

						<button class="mt-4 button button-sm button-primary button-full" onclick={ checkCart } disabled={ loading }>
							<span class="text-inherit">Naar betalen</span>
							<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" stroke-linecap="round" stroke-linejoin="round"></path>
							</svg>
						</button>
					{/if}
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
  .cart-summary {
    @apply flex flex-col p-4 bg-gray-50 relative;

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