<script type="ts">
  import InlineSpinner from '$lib/components/spinners/inline-spinner.svelte';

  let { response } = $props();
</script>

<section class="pb-10">
  <h2 class="white-section-title">Jouw lidkaart</h2>
  <p>Met je lidkaart krijg je toegang tot alle voordelen van onze vereniging. Heb je nog geen lidkaart? Koop er dan snel eentje!</p>

  {#await response}
    <InlineSpinner message="We zijn je lidkaart status aan het ophalen..." />
  {:then memberCard}
    {#if Object.is(memberCard) && Object.keys(memberCard).length > 0}
      <div class="lidkaart-card">
        <div class="lidkaart-wrapper">
            <img src="{ memberCard.derived_type.display.image_landscape }" alt="card">
        </div>
        <!--<p><span class="font-bold">{ CardMembershipEnum[memberCard.derived_type.member_type] | titlecase }: </span>{ memberCard.item.name }</p>
        <span *ngIf="failed_notification !== null" class="error-message">{{ failed_notification }}</span>
        <span *ngIf="success_notification !== null" class="success-message">{{ success_notification}}</span>-->
      </div>
    {:else}
      <div class="alert alert-info mb-4">
        <p class="alert-text">Het lijkt erop dat je nog geen lidkaart hebt gekoppeld. Je kan de <span class="font-bold">QR-code op de achterkant van je kaart scannen</span></p>
      </div>
    {/if}
  {:catch error}
    <p>Oeps, daar ging iets mis!</p>
  {/await}
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
