<script lang="ts">
  import Header from '$lib/components/layout/header.svelte';

  let { data } = $props();

  // This is little bit stupid, but I want no year at the end of a URL with the current praesidium
  function getCorrectUrlYear(year: string) {
    if (year === data.years[0]) {
      return '';
    }
    return '/' + year;
  }
</script>

<svelte:head>
  <title>Praesidium {data.currentYear} | Ingenium UA</title>
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main class="ingenium-container relative h-full" id="main-content">
  <div class="flex flex-col md:flex-row items-center mb-8">
    <span class="mb-2 mr-0 md:mb-0 md:mr-2">Alle Praesidium jaren:</span>
    <div class="grid grid-cols-4 gap-2 md:block md:space-x-2">
      {#each data.years as year }
        <a href="/info/praesidium{getCorrectUrlYear(year)}" class="button button-outline-blue button-sm { year === data.currentYear ? 'active' : '' }"><span class="sr-only">Jaar </span> { year }</a>
      {/each}
    </div>
  </div>

  <div class="space-y-12">
    {#each data.praesidium as group}
      <section class="praesidium" aria-labelledby={'group-' + group.groupName}>
        <h2 id={'group-' + group.groupName} class="white-section-title white-section-title-blue white-section-title-large">{ group.groupName }</h2>
        <p>{ group.groupDescription }</p>

        <ul>
          {#each group.categories as categorie}
            <li class="group-card">
              <div class="group-card--title">
                <h3 class="white-section-title">{ categorie.categorieName }</h3>
                <p class="small-margin">{ categorie.categorieDescription }</p>
                {#if categorie.button}
                  <a href={categorie.button.url} class="button button-outline-blue button-sm">{ categorie.button.text }</a>
                {/if}
              </div>

              <ul class="group-card--person-list">
                {#each categorie.praesidia as person}
                  <li class="person-card">
                    {#if person.image !== ''}
                      <img src={person.image} alt="" loading="lazy" />
                    {/if}
                    <h4 class="white-section-title">{ person.name }</h4>
                    <p class="no-margin">{ person.functie }</p>
                  </li>
                {/each}
              </ul>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
</main>

<style lang="scss">
  .group-card {
    @apply border-b border-gray-200 mb-6;

    .group-card--title {
      @apply border-l-4 border-blue-950 relative -left-2 pl-2 mb-6;
    }

    .group-card--person-list {
      @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3 mb-6;

      .person-card {
        @apply flex-1 flex flex-col justify-end items-center;

        img {
          @apply rounded max-w-xs sm:max-w-sm w-full mb-2 border-2 border-blue-950 aspect-square;
        }
      }

      .button-card {
        @apply flex-1 flex flex-col justify-center items-center;
      }
    }

    &:last-child {
      @apply border-b-0;
    }
  }
</style>
