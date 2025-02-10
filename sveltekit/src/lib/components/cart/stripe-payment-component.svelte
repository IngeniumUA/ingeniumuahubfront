<script lang="ts">
  import { onMount } from "svelte";
  import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';
  import { PUBLIC_STRIPE_PK_KEY, PUBLIC_STRIPE_RETURN_URL } from "$env/static/public";
  import { cartDetails, clearCart } from "$lib/states/cart.svelte";
  import Modal from "$lib/components/layout/modal.svelte";

  let isOpen = $state(true);
  let element: StripeElements = null!;
  let stripe: Stripe|null = null;

  onMount(async () => {
    try {
      stripe = await loadStripe(PUBLIC_STRIPE_PK_KEY);
      if (!stripe) return;

      element = stripe.elements({
        clientSecret: cartDetails.checkout.client_secret,
      })
      const paymentElement = element.create('payment', {
        paymentMethodOrder: ['bancontact', 'ideal', 'card'],
      });
      paymentElement.mount("#stripe-card-element");
    } catch (error) {
      console.error(error);
    }
  });

  async function doPayment() {
    if (!stripe) return;

    try {
      await element.submit();
      clearCart();
      const data = await stripe.confirmPayment({
        elements: element,
        redirect: 'if_required',
        confirmParams: {
          return_url: PUBLIC_STRIPE_RETURN_URL,
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
</script>

<Modal title="Betalen" bind:isOpen={ isOpen } closable={ false }>
  {#snippet children()}
    <form action="#" class="p-4" onsubmit={ (e) => { e.preventDefault(); doPayment(); } }>
      <div id="stripe-card-element"></div>

      <button class="button button-primary button-full mt-2" type="submit">
        Betalen
      </button>
    </form>
  {/snippet}
</Modal>

