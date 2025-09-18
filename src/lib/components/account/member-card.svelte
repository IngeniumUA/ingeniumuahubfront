<script lang="ts">
  let { imageString, failed_notification, success_notification }: {
    imageString: string|null, failed_notification: string|null, success_notification: string|null
  } = $props();
</script>

<section class="pb-10">
  <h2 class="white-section-title">Jouw lidkaart</h2>
  <p>Met je lidkaart krijg je toegang tot alle voordelen van onze vereniging. Heb je nog geen lidkaart? Koop er dan snel eentje!</p>

  {#if imageString !== null}
    <div class="lidkaart-card">
      <div class="lidkaart-wrapper">
          <img src="{ imageString }" alt="card">
      </div>

      {#if failed_notification !== null}
        <span class="error-message">{ failed_notification }</span>
      {:else if success_notification !== null}
        <span class="success-message">{ success_notification }</span>
      {/if}
    </div>
  {:else}
    <div class="alert alert-info mb-4">
      <p class="alert-text">Het lijkt erop dat je nog geen lidkaart hebt gekoppeld. Je kan de <span class="font-bold">QR-code op de achterkant van je kaart scannen</span></p>
    </div>
  {/if}
</section>

<style>
    .lidkaart-card {
        background-color: var(--ingenium-grey);
        min-width: clamp(12rem, 20vh, 18rem);
        max-width: 20rem;
        min-height: 10rem;


        margin-top: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        padding-bottom: 0;
        border-radius: 15px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .lidkaart-card p {
        margin: 0;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
        color: grey;
    }

    .lidkaart-wrapper {
        min-width: 12rem;
        min-height: 7rem;

        border: solid rgb(128, 128, 128) 2px;
        border-radius: 15px;
        background-color: var(--ingenium-grey);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .lidkaart-wrapper img {
        width: 100%;
        height: auto;
        border-radius: 13px;
    }
</style>
