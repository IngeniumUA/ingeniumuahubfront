<script lang="ts">
  import InlineSpinner from '$lib/components/spinners/inline-spinner.svelte';

  let { response } = $props();
</script>

<section class="border-t border-gray-900/10 pt-12">
  <h2 class="white-section-title">Jouw gegevens</h2>
  <p>Wijzig hier jouw persoonlijke gegevens.</p>

  {#await response}
    <InlineSpinner message="We halen jouw account gegevens op..." />
  {:then details}
    { JSON.stringify(details) }
  {:catch error}
    <p></p>
  {/await}
</section>