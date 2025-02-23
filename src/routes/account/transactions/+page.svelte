<script lang="ts">
  import dayjs from "dayjs";
  import QRCode from "qrcode";
  import Modal from "$lib/components/layout/modal.svelte";
  import type {TransactionLimitedI} from "$lib/models/transactionI";

  let { data }: { data: { transactions: TransactionLimitedI[] }} = $props();
  let isModalOpen = $state(false);
  let modalTitle = $state('');
  let qrCode = $state('');

  function parseDate(date: string) {
    return dayjs(date).format('D MMM YYYY, H:mm');
  }

  async function showQrCode(e: Event, transaction: TransactionLimitedI) {
    e.preventDefault();

    modalTitle = `QR Code voor ${transaction.interaction.item_name}`;
    qrCode = await QRCode.toDataURL(transaction.interaction.interaction_uuid, {
      color: {
        dark: '#00053D',
        light: '#FFF',
      },
      width: 400,
    });

    isModalOpen = true;
  }

  // TODO: Fix this
  function getWalletLink(transaction: TransactionLimitedI, platform: string) {
    const transaction_uuid: string = transaction.interaction.interaction_uuid
    let nummer: number = + transaction_uuid.replace(/\D/g, "")
    let nummer_str = "" + nummer
    nummer_str = nummer_str.split("e")[0].replace(".", "")
    nummer = +nummer_str
    const locatie_naam: string = "Ingenium" //TODO fix once location is implemented

    // Get and redirect to wallet link
    return `/wallet/?transaction_uuid=${transaction_uuid}&nummer=${nummer}&locatie_naam=${locatie_naam}&platform=${platform}`;
  }
</script>

<Modal title={ modalTitle } bind:isOpen={ isModalOpen }>
  {#snippet children()}
    <div class="p-4">
      <img src={ qrCode } alt="QR Code" />
    </div>
  {/snippet}
</Modal>

<section class="h-full">
  <h1 class="white-section-title">Jouw aankopen</h1>
  <p>Op deze pagina kan je al jouw voltooide aankopen herbekijken.</p>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-4" aria-labelledby="past-purchases">
    <div class="col-span-1 md:col-span-2 xl:col-span-4 -mb-6">
      <hr class="border-t border-gray-100 mb-4">
      <h2 class="white-section-title white-section-title-blue white-section-title--base" id="past-purchases">Vorige aankopen</h2>
      <p>Dit is jouw aankoop geschiedenis.</p>
    </div>

    {#if data.transactions.length === 0}
      <div class="alert alert-info alert-border mb-6 col-span-1 md:col-span-2 xl:col-span-4">
        <p class="text-sm text-blue-300">Je hebt geen vorige aankopen</p>
      </div>
    {:else}
      {#each data.transactions as transaction}
        <article class="transaction-card">
          <!-- PRODUCT DETAILS -->
          <dl>
            <dt>Evenement</dt>
            <dd>{ transaction.interaction.item_name }</dd>

            <dt>Product</dt>
            <dd>
              { transaction.purchased_product.name}
            </dd>

            <dt>Bedrag</dt>
            <dd>
              {#if transaction.purchased_product.price_policy.price === 0}
                Gratis
              {:else}
                &euro; { transaction.purchased_product.price_policy.price }
              {/if}
            </dd>

            <dt>Betaald op</dt>
            {#if transaction.completed_timestamp === null}
              <dd class="not-paid">Niet betaald</dd>
            {:else}
              <dd>{ parseDate(transaction.completed_timestamp) }</dd>
            {/if}
          </dl>

          <!-- QR Code -->
          <button onclick={ (e) => showQrCode(e, transaction) } type="button" class="button button-outline-blue button-sm button-full">
            Toon QR Code
            <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>

          <div class="flex gap-4 items-center justify-center mt-3">
            <a href={ getWalletLink(transaction, 'google') } data-sveltekit-preload-data="tap">
              <img src="https://storage.googleapis.com/ingeniumuahubbucket/hub/items/nl_add_to_google_wallet_add-wallet-badge.png" alt="add to wallet" style="height: 30px; cursor: pointer">
            </a>
            <a href={ getWalletLink(transaction, 'apple') } data-sveltekit-preload-data="tap">
              <img src="https://storage.googleapis.com/ingeniumuahubbucket/hub/items/NL_Add_to_Apple_Wallet_RGB_101921.png" alt="add to wallet" style="height: 30px; cursor: pointer">
            </a>
          </div>
        </article>
      {/each}
    {/if}
  </div>
</section>

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

        &.not-paid {
          @apply text-red-700;
        }
      }
    }

    .transaction-card-qr {
      @apply flex justify-center items-center;
    }
  }

  img {
    @apply block mx-auto;
  }
</style>