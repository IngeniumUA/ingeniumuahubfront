<script lang="ts">
  let { partners = [] }: { partners: string[] } = $props();
</script>


<div class="partners-grid">
  {#each partners as partner}
    <div class="partner-card">
      <div class="partner-logo-wrapper" aria-hidden="true">
        <img src={ partner } loading="lazy" alt="">
      </div>
    </div>
  {/each}
</div>


<style lang="scss">
  .partners-grid {
    @apply flex flex-row flex-wrap justify-center gap-4 m-1;
  }

  .partner-card {
    @apply w-32 h-48 max-w-min flex flex-col flex-grow items-center justify-center text-blue-950 shadow-inner rounded-lg;
    border: solid var(--ingenium-grey) 2px;

    .partner-logo-wrapper {
      @apply h-28 w-28 flex justify-items-center align-middle m-1
    }

    img {
      object-fit: contain;
      width: 100%;
    }

    h3 {
      @apply text-black font-bold m-1 text-center w-max;
    }

    p {
      @apply ml-1.5
    }
  }
</style>