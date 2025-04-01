<script lang="ts">
	import { PUBLIC_API_URL } from "$env/static/public";
	import { getAuthorizationHeaders } from "$lib/auth/auth";
  import { HubCheckoutTrackerStatusEnum as StatusEnum } from "$lib/models/trackerI";
	import type { HubCheckoutTrackerI, HubCheckoutTrackerStatusEnum } from "$lib/models/trackerI";
	import { onMount } from "svelte";
	import InlineSpinner from "../spinners/inline-spinner.svelte";
	import { beforeNavigate } from "$app/navigation";

  let interval: any;
  let loading = $state(true);
  let lastUpdate = $state<Date>(null!);
  let trackedItems = $state<HubCheckoutTrackerI[]>([]);

  async function getItems() {
    loading = true;

    try {
      const data: HubCheckoutTrackerI[] = await fetch(`${PUBLIC_API_URL}/account/trackers?salt=${(new Date()).getTime().toString()}`, {
        headers: getAuthorizationHeaders(null)
      }).then(r => r.json());

      trackedItems = data;
      lastUpdate = new Date(Date.now());

      setTimeout(() => {
        loading = false;
      }, 1000);
    } catch (e) {
      console.error("An error occurred");
    }
  }

  let lastUpdateString = $derived.by(() => {
    if (!lastUpdate) return "onbekend";
    return `${lastUpdate.getHours()}:${lastUpdate.getMinutes()}:${lastUpdate.getSeconds()}`;
  });

  onMount(() => {
    getItems();

    interval = setInterval(() => {
      getItems();
    }, 15000);
  });

  beforeNavigate(() => {
    window.clearTimeout(interval);
  });
</script>

{#if trackedItems.length > 0}
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-4" aria-labelledby="in-progress-purchases">
    <div class="col-span-1 md:col-span-2 xl:col-span-4 -mb-6">
      <h2 class="white-section-title white-section-title-blue white-section-title--base flex" id="in-progress-purchases">
        <span class="flex-1">Aankopen in behandeling</span>
        {#if loading} <InlineSpinner message="Updaten..." /> {/if}
      </h2>
      <p>
        De onderstaande aankopen worden momenteel nog behandeld. <br>
        De pagina update automatisch. Laatste update: { lastUpdateString }
      </p>
    </div>

    {#each trackedItems as trackedItem}
      <article class="transaction-card">
        <dl>
          <dt>Bestellingnummer</dt>
          <dd class="font-bold">{ trackedItem.id }</dd>

          <dt>Bedrag</dt>
          <dd>&euro; { trackedItem.checkout.amount }</dd>
        </dl>

        <div class={{ 'badge': true, 'badge-red': trackedItem.checkout_tracker_status === StatusEnum.Pending,
                     'badge-green animate-bounce': trackedItem.checkout_tracker_status === StatusEnum.Ready }}>
          <span class="sr-only">Bestelling status</span>
          {#if trackedItem.checkout_tracker_status === StatusEnum.Pending}
            In behandeling
          {:else if trackedItem.checkout_tracker_status === StatusEnum.Ready}
            Klaar
          {:else if trackedItem.checkout_tracker_status === StatusEnum.Finished}
            Afgehaald
          {:else}
            Onbekend
          {/if}
        </div>
      </article>
    {/each}
  </div>
{/if}

<style lang="scss">
  .transaction-card {
    @apply border rounded p-4;

    dl {
      @apply mb-4;

      dt {
        @apply mt-4 text-gray-500 text-xs;

        &:first-child {
          @apply mt-0;
        }
      }

      dd {
        @apply mt-1 text-gray-900 text-sm;

        .transaction-card-product-price-tag {
          @apply text-gray-600 text-xs;
        }
      }
    }

    .transaction-card-qr {
      @apply flex justify-center items-center;
    }
  }

  td img{
    display: block;
    margin-left: auto;
    margin-right: auto;

  }
</style>