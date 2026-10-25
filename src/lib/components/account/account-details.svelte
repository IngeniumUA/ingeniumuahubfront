<script lang="ts">
  import InlineSpinner from '$lib/components/spinners/inline-spinner.svelte';
  import {auth} from "$lib/states/auth.svelte";
  import {getAuthorizationHeaders} from "$lib/auth/auth";
  import {PUBLIC_API_URL} from "$env/static/public";

  let { response } = $props();
  let loading = $state(false);

  async function onFormSubmit(e, details) {
    e.preventDefault();
    loading = true;

    try {
      await fetch(`${PUBLIC_API_URL}/account`, {
        method: 'PUT',
        headers: getAuthorizationHeaders(null, { 'Content-Type': 'application/json' }),
        body: JSON.stringify(details)
      });
    } catch (error) {
      console.error(error);
    }

    loading = false;
  }
</script>

<section class="border-t border-gray-900/10 pt-12">
  <h2 class="white-section-title">Jouw gegevens</h2>
  <p>Wijzig hier jouw persoonlijke gegevens.</p>

  {#await response}
    <InlineSpinner message="We halen jouw account gegevens op..." />
  {:then details}
    <form target="#" onsubmit={ (e) => onFormSubmit(e, details) } class="mt-6 w-full space-y-6">
      <fieldset>
        <div class="form-field">
          <label for="email">E-mailadres</label>
          <input id="email" type="email" readonly disabled value={ auth.user?.email || '' } />
          <p class="text-sm text-gray-500 mt-1.5">Je kan je e-mailadres niet wijzigen. Contacteer ons als je dit toch wil aanpassen.</p>
        </div>
      </fieldset>

      <fieldset>
        <div class="form-field">
          <label for="phoneNumber">Telefoonnummer</label>
          <input id="phoneNumber" type="text" required bind:value={ details.telephone }/>
        </div>
      </fieldset>

      <div class="form-field text-right">
        <button type="submit" class="button button-danger" disabled={ loading }>Opslaan</button>
      </div>
    </form>
  {:catch error}
    <p>Something went wrong...</p>
  {/await}
</section>
