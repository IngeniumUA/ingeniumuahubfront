<script lang="ts">
  import type { RecSysPreviewI } from '$lib/models/RecSysI';
  import {calcColorIntensity, transformColorToRGBA} from "$lib/utilities/style-utilities";

  /** @type {{ item: RecSysPreviewI|null, loading: boolean }} */
  const { item, loading = false } = $props();

  let url = $derived.by(() => {
    if (item === null) return '';

    // If link is /event/ replace it with /events/
    return item.follow_through_link.replace('/event/', '/events/');
  });

  let cardStyle = $derived.by(() => {
    if (item === null) return '';
    return `background: ${transformColorToRGBA(item.color, 1)}; border: solid 2px ${transformColorToRGBA(item.color, 0.5)}`;
  });
  let textStyle = $derived.by(() => {
    if (item === null) return '';
    return calcColorIntensity(item.color) < 180 ? 'white' : 'black';
  })
</script>

{#if loading}
  <article class="event-card loader-card">
    <div class="image">
      <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
      </svg>
    </div>
    <div class="content">
      <div class="title"></div>
      <div class="date"></div>
    </div>
  </article>
{:else}
  <a href="{ url }" class="event-card-link-wrapper">
    <article class="event-card" style="{cardStyle}">
      <div class="image">
        <!-- Image might not be given (either could optionally be null), if null is passed the page breaks -->
        {#if item.image_square !== null}
          <img src="{ item.image_square }" loading="lazy" width="1024" height="1024" alt="" aria-hidden="true">
        {/if}
      </div>
      <div class="content">
        <h3 style:color={ textStyle }>{ item.name }</h3>
      </div>
    </article>
  </a>
{/if}