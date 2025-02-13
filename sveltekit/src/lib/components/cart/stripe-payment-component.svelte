<script lang="ts">
  import { onMount } from "svelte";
  import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';
  import { PUBLIC_STRIPE_PK_KEY, PUBLIC_STRIPE_RETURN_URL } from "$env/static/public";
  import { cartDetails, clearCart } from "$lib/states/cart.svelte";
  import Modal from "$lib/components/layout/modal.svelte";
  import {PaymentIntentResult} from "@stripe/stripe-js/dist/stripe-js/stripe";
  import {goToSuccessPage} from "../../states/cart.svelte";

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
      const response = await stripe.confirmPayment({
        elements: element,
        redirect: 'if_required',
        confirmParams: {
          return_url: PUBLIC_STRIPE_RETURN_URL,
        }
      });
      // Handle the response asynchronously because further API calls might be required to finish payment
      await handleStripeResponse(response)
    } catch (error) {
      console.error(error);
    }
  }

  async function handleStripeResponse(result: PaymentIntentResult) {
    if (result.error || result.paymentIntent === undefined) {
      // Show error to your customer (e.g., insufficient funds)
      alert( result.error.message );
      return;
    }

    switch (result.paymentIntent.status) {
      case 'succeeded':
        // Show a success message to your customer
        alert( 'Betaling Success!' );

        // Redirect to shop confirm
        await goToSuccessPage()
        break;

      case 'requires_action':
        // Big one!
        // We sent about 35 mails over 5 months to get this issue fixed
        // It's a specific Bancontact authentication problem where a bank requires extra authentication
        // https://docs.stripe.com/js/payment_intents/handle_next_action
        if (cartDetails.checkout.client_secret == null) {
          alert("Client Secret was invalid!");
          return;
        }
        // Handle then next action and iteratively handle the response again
        response = await stripe.handleNextAction({clientSecret: cartDetails.checkout.client_secret});
        await handleStripeResponse(response)

        break;

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

      <button class="button button-primary button-full mt-2" type="submit">
        Betalen
      </button>
    </form>
  {/snippet}
</Modal>

