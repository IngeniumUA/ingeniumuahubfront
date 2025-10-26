<script lang="ts">
  import Header from "$lib/components/layout/header.svelte";
  import { isAuthenticated } from '$lib/states/auth.svelte';
  import { PUBLIC_API_URL } from '$env/static/public';
  import { getAuthorizationHeaders, getLoginUrlWithRedirect } from '$lib/auth/auth';
  import { handleRequest } from '$lib/utilities/httpUtilities';
  import { goto } from '$app/navigation';

  /**
   * Assigning data from load function in +page.svelte
   */
  let { data } = $props();
  let form = $state({
    email: ""
  })

  /**
   * Disabled card button when a couple prerequisites are not met
   */
  let postError: Error | null = $state(null)
  let loadingHTTP: boolean = $state(false);
  let cardButtonDisabled: boolean = $derived.by(() => {
    return loadingHTTP || form.email === ""
  });

  /**
   * POST for card
   */
  let cardResponse: boolean = $state(false)
  async function postCard() {
    if (loadingHTTP) return;

    const email = form.email;
    if (email === "") {
      postError = Error("Vul je email in!")
      return
    }
    const postObject = {
      email: email.trim()
    }

    loadingHTTP = true;
    try {
      await fetch(`${PUBLIC_API_URL}/account/card/${data.params.id}`, {
        method: "POST",
        headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
        body: JSON.stringify(postObject)
      }).then(handleRequest);
      cardResponse = true;
    } catch (error) {
      console.log(error);
      postError = Error("Er is iets fout gegaan! Probeer het later opnieuw of contacteer ons.")
    } finally {
      loadingHTTP = false;
    }
  }
</script>

<svelte:head>
  <title>Ingenium UA</title>
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main>
  <!-- This page should only be visitable when user is not authenticated -->
  <!-- But authenticated logic is weird sometimes so we provide the edge case-->
  <section>
    {#if isAuthenticated()}
      <div>
        Laden .. !
      </div>
    {:else if cardResponse}
      <div class="flex flex-col gap-4 my-8 p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow">
        <h1 class="text-center">Aanvraag Verstuurd!</h1>
        <div class="flex flex-row items-center justify-center">
          <button
            class="button button-primary w-32 button-inline"
            onclick={() => goto("/account")}
          >
            <span>Naar Account</span>
          </button>
        </div>
        <p>Je zal een mail ontvangen wanneer je je lidkaart hebt gelinkt!</p>
        <p class="text-center">Niet gekregen? Stuur ons een berichtje!</p>
      </div>
    {:else}
      <form class="ingenium-form my-8 p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow">
        <h1 class="text-center">Lidkaart Linken</h1>
        <p class="text-center">Hier kan je je lidkaart linken!</p>

        <h3 class="font-bold text-center w-full mt-4 mb-2">via inloggen</h3>
        <div class="flex flex-row items-center justify-center">
          <button
            class="button button-primary w-32 button-inline"
            onclick={() => goto(getLoginUrlWithRedirect(`/card/${data.params.id}`))}
          >
            <span>Log In</span>
          </button>
        </div>

        <h3 class="font-bold text-center w-full my-4">Of</h3>

        <fieldset>
          <div class="flex-1 form-field max-w-72">
            <label for="itemName">Email</label>
            <input id="itemName" type="text" required bind:value={ form.email }/>
            <p>Vul de email in waaraan je de lidkaart wil koppelen</p>
          </div>
        </fieldset>

        <div class="flex flex-row items-center justify-center">
            <button
              class="button button-primary w-32 button-inline"
              onclick={postCard}
              disabled={cardButtonDisabled}
            >
              <span>Link Lidkaart</span>
            </button>
        </div>
        {#if (postError !== null)}
          <p class="error-message p-4">
            {postError.message}
          </p>
        {/if}
      </form>
    {/if}
  </section>
</main>

<style>
  section {
    @apply flex items-center justify-center w-full;
  }
</style>