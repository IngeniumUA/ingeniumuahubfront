<script lang="ts">
  import type { PageProps } from './$types';
  import Header from '$lib/components/layout/header.svelte';
  import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Events | Ingenium UA</title>
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main class="ingenium-container relative" id="main-content">
  <h1 class="white-section-title white-section-title-blue white-section-title-large">Evenementen</h1>
  <p>TD's en andere evenementen kan je op deze pagina vinden.</p>

  {#if (Array.isArray(data.events) && data.events.length > 0)}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each data.events as item}
        <RecSysPreviewItem {item} />
      {/each}
    </div>
  {:else}
    <div class="alert alert-info alert-border">
      <p class="text-sm text-blue-700">Er staat momenteel geen evenementen online</p>
    </div>
  {/if}
</main>