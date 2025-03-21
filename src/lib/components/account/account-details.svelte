<script lang="ts">
  import InlineSpinner from '$lib/components/spinners/inline-spinner.svelte';
  import {auth} from "$lib/states/auth.svelte";
  import {getAuthorizationHeaders} from "$lib/auth/auth";
  import {PUBLIC_API_URL} from "$env/static/public";

  let { response } = $props();
  let loading = $state(false);
  const tracts = {
    'bouwkunde': 'Bouwkunde',
    'elektromechanica': 'Elektromechanica',
    'elektronica_ict': 'Elektronica-ICT',
    'chemie': 'Chemie',
    'biochemie': 'Biochemie',
    'uantwerpen': 'UAntwerpen',
    'other': 'Andere'
  };

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

      <fieldset>
        <legend class="sr-only">School gegevens</legend>

        <div class="form-field col-span-4">
          <label for="graduationTracts">Afstudeerrichting</label>
          <select id="graduationTracts" required bind:value={ details.graduation_tract }>
            {#each Object.keys(tracts) as tract}
              <option value={ tract }>{ tracts[tract] }</option>
            {/each}
          </select>
        </div>
      </fieldset>

      <fieldset class="grid space-y-1.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <legend>Jouw interesses</legend>

        <div class="form-field form-field-checkbox">
          <input id="recreationInterestCheckbox" type="checkbox" bind:checked={ details.recreation_interest }>
          <label for="recreationInterestCheckbox">Ik wil graag meer weten over recreatie (TD's, Cantussen, ...)</label>
        </div>

        <div class="form-field form-field-checkbox">
          <input id="sportInterestCheckbox" type="checkbox" bind:checked={ details.sport_interest }>
          <label for="sportInterestCheckbox">Ik wil graag meer weten over sport</label>
        </div>

        <div class="form-field form-field-checkbox">
          <input id="relationsInterestCheckbox" type="checkbox" bind:checked={ details.relations_interest }>
          <label for="relationsInterestCheckbox">Ik wil graag meer weten over bedrijfsevents</label>
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
