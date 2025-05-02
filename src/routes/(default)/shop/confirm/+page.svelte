<script lang="ts">
  import {onMount} from "svelte";
  import Header from "$lib/components/layout/header.svelte";
  import { PUBLIC_API_URL } from '$env/static/public';

  let { data } = $props();

  onMount(() => {
    if (data.trackerId) {
      const sseEvent = new EventSource(`${PUBLIC_API_URL}/api/v1/trackers/${data.trackerId}/events`, {
        withCredentials: true,
      });
    }
  });
</script>

<svelte:head>
  <title>Shop | Ingenium UA</title>
  <meta name="robots" content="noindex">
</svelte:head>

<header>
  <Header whiteTheme={ true } />
</header>

<main id="main-content" class="ingenium-container text-center flex flex-1 flex-col justify-center items-center">
  {#if data.paymentStatus === 'succeeded'}
    <div class="icon-wrapper bg-green-100 rounded-full">
      <svg class="text-green-600" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <h1 class="success">Betaling gelukt</h1>
    {#if data.trackerId}
      <p>
        Jouw bestellingsnummer is <br>
        <span class="inline-block text-center text-3xl text-black font-bold rounded-lg px-4 py-2 mt-4 mb-1 border-2 border-gray-300 bg-gray-50 animate-bounce">
          { data.trackerId }
        </span>
      </p>

      <p>Volg het via je telefoon of via ons eigen scherm.</p>
    {:else}
      <p>
        Er is een e-mail verstuurd met een bevestiging <span class="font-bold">Krijg zeker in je spam folder!</span> <br>
        Niets ontvangen? <a href="/info/contact">Neem dan contact op met ons</a>.
      </p>
    {/if}

    <a href="/account/transactions" class="button button-outline-blue button-sm mt-4">Alle bestellingen bekijken</a>
  {:else if data.paymentStatus === 'failed'}
    <div class="icon-wrapper bg-red-100 rounded-full">
      <svg class="text-red-600" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </div>
    <h1 class="failed">Betaling mislukt</h1>
    <p>
      Er is iets misgegaan met de betaling. <br>
      Probeer het opnieuw of <a href="/info/contact">neem contact met ons op</a>.
    </p>
  {:else}
    <div class="icon-wrapper bg-gray-100 rounded-full">
      <svg class="text-gray-600" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </div>
    <h1 class="unknown">Onbekende betaal status</h1>
    <p>We zitten hier even in Schrödinger's kat situatie. De betaalprovider gaf ons geen status mee.</p>

    <a href="/account/transactions" class="button button-outline-blue button-sm mt-4">Alle bestellingen bekijken</a>
  {/if}
</main>

<style lang="scss">
  .icon-wrapper {
    @apply flex items-center justify-center w-16 h-16 mx-auto mb-4;

    svg {
      @apply w-8 h-8;
    }
  }

  h1 {
    @apply text-xl font-bold mb-2;

    &.success {
      @apply text-green-600;
    }

    &.failed {
      @apply text-red-600;
    }

    &.unknown {
      @apply text-gray-600;
    }
  }

  p {
    @apply max-w-sm;
  }
</style>