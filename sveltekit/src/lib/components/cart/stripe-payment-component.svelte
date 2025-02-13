<script lang="ts">
  import { onMount } from "svelte";
  import {
    loadStripe,
    type PaymentIntentOrSetupIntentResult, type PaymentIntentResult,
    type Stripe,
    type StripeElements
  } from '@stripe/stripe-js';
  import { PUBLIC_STRIPE_PK_KEY, PUBLIC_STRIPE_RETURN_URL } from "$env/static/public";
  import { cartDetails, clearCart } from "$lib/states/cart.svelte";
  import Modal from "$lib/components/layout/modal.svelte";
  import { goToSuccessPage } from "../../states/cart.svelte";

  let isOpen = $state(true);
  let element: StripeElements = null!;
  let stripe: Stripe|null = null;
  let blocked = $state(false);

  onMount(async () => {
    try {
      stripe = await loadStripe(PUBLIC_STRIPE_PK_KEY);
      if (!stripe) return;

      element = stripe.elements({
        clientSecret: cartDetails.checkout.client_secret,
      });
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
    blocked = true;

    try {
      await element.submit();
      clearCart();
      const response = await stripe.confirmPayment({
        elements: element,
        redirect: 'if_required',
        confirmParams: {
          return_url: PUBLIC_STRIPE_RETURN_URL,
        }
      });
      // Handle the response asynchronously because further API calls might be required to finish payment
      await handleStripeResponse(response);
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: This should be revamped cuz it just bad code!
  async function handleStripeResponse(result: PaymentIntentResult|PaymentIntentOrSetupIntentResult) {
    if (!stripe || !cartDetails.checkout) return;
    if (result.error || result.paymentIntent === undefined) {
      // Show error to your customer (e.g., insufficient funds)
      alert(result.error?.message || 'Er is iets foutgegaan!');
      blocked = false;
      return;
    }

    switch (result.paymentIntent.status) {
      case 'succeeded':
        // Redirect to shop confirm
        await goToSuccessPage()
        break;

      case 'requires_action': {
        // https://docs.stripe.com/js/payment_intents/handle_next_action
        if (result.paymentIntent.client_secret == null) {
          alert("Client Secret was invalid!");
          return;
        }

        // Handle then next action and iteratively handle the response again
        const response = await stripe.handleNextAction({ clientSecret: result.paymentIntent.client_secret });
        await handleStripeResponse(response);
        break;
      }

      default:
        // If no status was not handled in previous cases we display error
        alert('Er is iets foutgegaan!');
    }
  }
</script>

<Modal title="Betalen" bind:isOpen={ isOpen } closable={ false }>
  {#snippet children()}
    <form action="#" class="p-4" onsubmit={ (e) => { e.preventDefault(); doPayment(); } }>
      <div id="stripe-card-element"></div>

      <button class="button button-primary button-full mt-2" type="submit" disabled={ blocked }>
        Betalen
      </button>
    </form>
  {/snippet}
</Modal>

