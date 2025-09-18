<script lang="ts">
  import Header from '$lib/components/layout/header.svelte';
</script>

<svelte:head>
  <title>Credits | Ingenium UA</title>
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main class="ingenium-container" id="main-content">
  <h1 class="white-section-title white-section-title-blue">Credits</h1>
  <p>Our website was not made in a few minutes, it required the hard work of a lot of people. This page serves as a thank you to all the people who contributed to the creation of this website.</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
    <div>
      <p class="font-bold text-black">List of core maintainers</p>
      <ul class="list-disc list-inside">
        <li>Robbe De Helt - Broke prod: 1</li>
        <li>Yorben Joosen - Broke prod: 0</li>
        <li>Sigfried Seldeslachts - Broke prod: 0</li>
        <li>Wout De Smit - Broke prod: 0</li>
      </ul>
      <p class="font-bold text-black">List of contributors</p>
      <ul class="list-disc list-inside">
        <li>Inias De Belder</li>
        <li>Bas Calders</li>
        <li>Nicolas Grupping</li>
      </ul>
    </div>
    <div>
      <p class="font-bold text-black">Others</p>
      <ul class="list-disc list-inside">
        <li>Revision: 2025</li>
      </ul>
    </div>
  </div>
</main>