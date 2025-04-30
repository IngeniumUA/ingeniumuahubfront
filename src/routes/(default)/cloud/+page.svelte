<script lang="ts">
  import Header from "$lib/components/layout/header.svelte";
</script>

<svelte:head>
  <title>Cloud | Ingenium UA</title>
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main class="ingenium-container relative h-full" id="main-content">
  <div class="flex flex-col items-center">
    <h1>Gebruik password: Ingenium2018</h1>
    <h2>De cloud is voor studenten, van studenten. Upload zelf ook studiemateriaal!</h2>
    <a href="https://forms.gle/CoXVk2Rwk5QMKYLU6" target="_blank" rel="noopener" class="button button-primary button-sm my-4">
      Zelf bestanden uploaden
    </a>
  </div>
  <iframe src="https://eu.ingeniumua.be/d/038d6736ad4b450bbee3/" width="100%" height="70%"></iframe>
</main>

<style>
  iframe {
    height: 70vh;
    @apply w-full;
  }
</style>