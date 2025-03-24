<script lang="ts">
  import { onMount } from "svelte";
  import * as client from 'openid-client';

  import { goto } from '$app/navigation';
  import { auth } from "$lib/states/auth.svelte";
  import { getOpenIdDiscovery, getUserFromToken, storeTokens } from '$lib/auth/auth';
  import Header from "$lib/components/layout/header.svelte";
  import { captureException } from '@sentry/sveltekit';
  import { page } from '$app/state';

  let isFailure = $state(false);
  let hasClearMessage = $state(true);
  let errorMsg = $state('');

  const loginCallback = async () => {
    try {
      const config = await getOpenIdDiscovery();
      const pckeCodeVerifier = window.sessionStorage.getItem('pkce_code_verifier');
      const expectedState = window.sessionStorage.getItem('expected_state');

      // Pre-emtively stop if certain parameters are not present
      if (!pckeCodeVerifier || !expectedState || !page.url.searchParams.has('state') || !page.url.searchParams.has('code')) {
        throw new Error('No matching state found in storage');
      }

      auth.tokens = await client.authorizationCodeGrant(config, new URL(window.location.href), {
        pkceCodeVerifier: pckeCodeVerifier || undefined,
        expectedState: expectedState || undefined,
      });
      storeTokens(auth.tokens);
      auth.user = getUserFromToken(auth.tokens.access_token);

      // Get the state parameter from the url
      const state: Record<string, string> = JSON.parse(expectedState || '/');
      await goto(state?.next || '/', { replaceState: true });
    } catch (error) {
      isFailure = true;
      if (error instanceof Error) {
        console.log(error);
        switch (error.message) { // I don't like this, but it's the only way to provide a clear message
          case 'No matching state found in storage':
            errorMsg = 'De sessie is verlopen of je gebruikte de terug knop in jouw browser. Probeer opnieuw aan te melden.';
            return; // Don't capture this error
          default:
            errorMsg = error.message;
            hasClearMessage = false;
            break;
        }
      } else {
        errorMsg = 'Onbekende fout';
      }

      captureException(error);
    }
  }

  onMount(() => {
    loginCallback();
  });
</script>

<svelte:head>
  <meta name="robots" content="noindex">
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main class="ingenium-container h-full text-center flex flex-1 flex-col justify-center items-center">
  {#if isFailure}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12 stroke-red-800 mb-2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
    <h1 class="white-section-title white-section-title-large">Het aanmelden is mislukt</h1>
    <p>
      {#if hasClearMessage}
        {errorMsg}
      {:else}
        We konden je niet aanmelden. Probeer het opnieuw of contacteer ons voor hulp. <br>
        <span class="text-xs">Fout melding: {errorMsg}</span>
      {/if}
    </p>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12 mb-2 motion-safe:animate-spin">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    <h1 class="white-section-title white-section-title-large">Even geduld</h1>
    <p>De aanmelding wordt gecontroleerd</p>
  {/if}
</main>