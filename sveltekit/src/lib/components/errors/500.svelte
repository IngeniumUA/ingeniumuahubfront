<script lang="ts">
  let people = $state({
    'Robbe': 'https://storage.googleapis.com/ingeniumuahubbucket/hub/praesidium/RobbeDeHelt.webp',
    'Wout': 'https://storage.googleapis.com/ingeniumuahubbucket/hub/praesidium/WoutDeSmit.webp',
    'Yorben': 'https://storage.googleapis.com/ingeniumuahubbucket/hub/praesidium/YorbenJoosen.webp',
    'Sigfried': 'https://storage.googleapis.com/ingeniumuahubbucket/hub/praesidium/SigfriedSeldeslachts.webp'
  })
</script>

<svelte:head>
  <title>500 | Ingenium UA</title>
</svelte:head>

<main id="main-content" class="ingenium-container">
  <h1 class="white-section-title white-section-title-large white-section-title-blue text-center">Oh nee, daar ging iets mis!</h1>
  <p class="text-center">500 - Internal server error</p>

  <p class="mb-4 font-bold text-xl text-center">Iemand uit deze lijst is verantwoordelijk voor het introduceren van de fout. Kies de persoon die jij denkt dat schuldig is.</p>

  <div class="people-list">
    {#each Object.keys(people) as name}
      <div>
        <img src={people[name]} alt="" class="rounded-lg">
        <p class="text-center">{ name }</p>
      </div>
    {/each}
  </div>
</main>

<style lang="scss">
  .people-list {
    @apply grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8;
  }
</style>