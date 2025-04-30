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
      <p class="font-bold text-black">List of students</p>
      <ul class="list-disc list-inside">
        <li>Robbe De Helt</li>
        <li>Yorben Joosen</li>
        <li>Inias De Belder</li>
        <li>Sigfried Seldeslachts</li>
        <li>Bas Calders</li>
        <li>Nicolas Grupping</li>
        <li>Wout De Smit</li>
      </ul>
    </div>
    <div>
      <p class="font-bold text-black">Others</p>
      <ul class="list-disc list-inside">
        <li>Revision: ????</li>
      </ul>
    </div>
  </div>
</main>