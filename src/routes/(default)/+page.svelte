<script lang="ts">
	import type { PageProps } from './$types';
	import Header from '$lib/components/layout/header.svelte';
	import RecSysPreviewItem from '$lib/components/recsys/rec-sys-preview-item.svelte';
	import PartnersGrid from '$lib/components/partners/partners-grid.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Ingenium UA - Studentenvereninging FTI</title>
</svelte:head>

<div id="homepage-wrapper">
	<header class="hero">
		<enhanced:img src="$assets/images/galabal_bg.webp" fetchpriority="high" sizes="min(1279px, 100vw)" alt="" aria-hidden="true" />

		<div class="hero-wrapper">
			<Header noBackground={true} whiteTheme={false} />

			<div class="hero-content">
				<div class="ingenium-container">
					<h1>
						Toegepaste Ingenieurswetenschappen<br>
						<small>Faculteitsvereniging</small>
					</h1>
				</div>
			</div>
		</div>
	</header>

	<main class="bg-blue-950" id="main-content">
		<section class="ingenium-container">
			<div class="intro-card">
				<div class="intro-card__image">
					<enhanced:img src="$assets/images/praesidium_thumb.webp" alt="" aria-hidden="true" />
				</div>
				<div class="intro-card__content">
					<p class="text-white">
						Sinds 2018 is Ingenium de officiële faculteitsvereniging van de faculteit Toegepaste Ingenieurswetenschappen aan
						de Universiteit Antwerpen.
					</p>
					<div class="mt-4">
						<a class="button button-outline-white button-lg uppercase" href="/shop">
							Word lid
							<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" stroke-linecap="round" stroke-linejoin="round"></path>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</section>

		<!-- Upcoming events -->
		<section class="ingenium-container" aria-labelledby="recommendations-title">
			<h2 id="recommendations-title" class="text-white mb-4">Uitgelicht</h2>

			{#if (Array.isArray(data.recommendations) && data.recommendations.length > 0)}
				<div class="event-card-list grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-items-center gap-4">
					{#each data.recommendations as item}
						<RecSysPreviewItem { item } />
					{/each}
				</div>

				<div class="text-center mt-4">
					<a href="/events" class="button button-outline-white button-lg uppercase" >
						Alle events
						<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</a>
				</div>
			{:else}
				<p class="text-white text-lg w-full">Geen aanbevelingen, check onze social media!</p>
			{/if}
		</section>

		<section class="ingenium-container" aria-labelledby="jobs-title">
			<h2 id="jobs-title" class="text-white mb-4">Vacatures</h2>

			{#if (Array.isArray(data.sponsored) && data.sponsored.length > 0)}
				<div class="event-card-list grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-items-center gap-4">
					{#each data.sponsored as item}
						<RecSysPreviewItem { item } />
					{/each}
				</div>

				<div class="text-center mt-4">
					<a href="/vacatures" class="button button-outline-white button-lg uppercase">
						Alle vacatures
						<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</a>
				</div>
			{:else}
				<p class="text-white text-lg w-full">Er zijn momenteel geen vacatures beschikbaar.</p>
			{/if}
		</section>

		<!-- Sponsorbalkje -->
		<section class="bg-white partner-section">
			<h1 class="white-section-title white-section-title-large white-section-title-blue text-center mb-4">Met dank aan onze partners</h1>

			{#await data.partnersReq}
				<p class="text-center">
					We zijn bezig met het laden van de partners. <br>
					<span class="font-bold">Geen JavaScript? Kijk dan op onze <a href="/info/relations">relations pagina</a> voor meer info.</span>
				</p>
			{:then partners}
				<PartnersGrid { partners } />
			{:catch error}
				<p class="text-center">Er is een fout opgetreden bij het ophalen van de partners.</p>
			{/await}
		</section>

	</main>
</div>


<style lang="scss">
  /* Main */
  :host {
    background-color: var(--mainblue);
  }
  #homepage-wrapper {
    background-color: var(--mainblue);
  }

  /* Sections */
  section {
    width: 100%;

    background-color: var(--mainblue);
    padding-top: 1rem;
    padding-bottom: 2rem;
  }

  .section-center-content {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }


  /* Hero */
  .hero {
    @apply w-full m-0 p-0 relative flex flex-col;
    height: 80vh;


    picture {
      @apply absolute w-full h-full top-0 left-0;

      img {
        @apply w-full h-full object-cover object-center;
      }
    }

    .hero-wrapper {
      @apply flex-1 flex flex-col z-10;

      background-color: var(--mainblue); // Fall back for browsers that don't support background-blend-mode
      background: linear-gradient(to bottom, rgba(0, 5, 61, 0.6), rgba(0, 5, 61, 0.6) 80%, rgba(0, 5, 61, 1));
    }

    .hero-content {
      @apply flex-1 flex flex-col justify-end;
    }

    h1 {
      @apply pb-0 mb-0 text-xl sm:text-3xl md:text-5xl;
      color: var(--mainwhite);

      small {
        @apply block font-normal text-lg sm:text-xl md:text-3xl mt-1.5;
      }
    }

    h3 {
      margin-top: 0;
      padding-top: 0;

      color: var(--mainwhite);
      font-weight: normal;
      font-size: small;
    }
  }

  /* Homepage cards */
  .info-card-section {
    box-sizing: border-box;
    width: 100%;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .info-card-section h1 {
    color: var(--mainwhite);
    margin-bottom: 0;
  }
  .info-card-section h3 {
    color: var(--mainwhite);
    margin-top: 0;
  }

  .intro-card {
    @apply grid grid-cols-1 md:grid-cols-2 rounded-lg text-white text-lg shadow bg-blue-900;

    .intro-card__image {
      img {
        @apply w-full h-full object-cover object-center rounded-lg max-h-none md:max-h-96;
      }
    }

    .intro-card__content {
      @apply flex flex-col justify-center text-center p-4 rounded-lg;

      p {
        @apply text-base md:text-xl tracking-wide md:tracking-wider;
      }
    }
  }

  .homepage-card {
    @apply max-w-md rounded-lg pb-1 flex flex-col items-center;
    background-color: var(--secondblue);

    a {
      color: var(--mainwhite);
    }
  }

  main {
    @apply bg-blue-950;
  }

  .image-wrapper {
    box-sizing: border-box;
    padding-left: 1rem; padding-right: 1rem; padding-bottom: 1rem;
    width: 100%;
    overflow: hidden;
  }

  .homepage-card .lid-button {
    border: solid 2px white;
    color: var(--mainwhite);
    font-weight: bold;
		padding: 0.5rem 2rem;

		margin: 1rem auto;
    text-align: center;
    max-width: 6rem;

    transition: all ease-in-out .2s;
  }

  .homepage-card .lid-button:hover {
    color: var(--mainblue);
    background-color: white;
  }

  /* Event card */
  .homepage-event-card {
    width: 16rem;
    height: 18rem;
    margin-top: clamp(0rem, 2vw, 1rem);
    padding-top: 1rem;
    border-radius: 25px;
    background-color: var(--secondblue);

    display: flex;
    flex-direction: column;
  }

  .homepage-event-card img {
    width: 100%;
    box-sizing: border-box;
  }

  .homepage-event-card h3 {
    color: var(--mainwhite);
  }

  .info-card-section {
    .homepage-card {
      background-color: var(--secondblue);
      align-items: flex-start;
      margin: 0;
      width: 100%;
      padding: 1rem;

      display: flex;
      flex-direction: column;

      &:nth-child(even) {
        background-color: var(--ingenium-grey);

        .content {
          h3, a {
            color: var(--mainblue);
          }
        }
      }

      .image-wrapper {
        padding: 0;
        width: 100%;

        img {
          width: 100%;
          max-height: 16rem;
          object-fit: cover;
          object-position: top;
          border-radius: 5px;
        }
      }

      .content {
        flex: 1;
        padding: 1rem 0;
        display: flex;
        flex-direction: column;

        .title-wrapper {
          display: flex;
          align-items: center;
          flex: 1;

          h3 {
            display: block;
            line-height: 1.5em;
          }
        }

        a {
          margin-top: 1rem;
          text-decoration: underline;

          &:hover {
            text-decoration: none;
          }
        }
      }
    }
  }

  //.info-card-section .homepage-card.news > * {
  //  color: var(--mainblue);
  //}

  .info-card-section .homepage-card.news:nth-child(odd) > * {
    color: var(--mainwhite);
  }

  .info-card-section .homepage-card.news p {
    color: var(--mainblue);
    text-decoration: underline;
    padding: 0;
  }

  .info-card-section .homepage-card.news p::after {
    display: inline-block;
    content: "→";
    text-decoration: none;
    padding-left: .3rem;
  }

  /* Recsys */
  .recsys-section {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .recsys-section h1 {
    width: 100%;
    text-align: left;
    justify-self: left;

    margin-bottom: 1rem;
  }

  .recsys-section h2 {
    margin-top: 1rem;
  }

  .recsys-section .upcoming-events {
    width: 100%;
    height: 100%;

    z-index: 10;

    display: flex;
    flex-direction: row;
    gap: 0.5rem;

    overflow-x: scroll;
    scrollbar-width: none; /* For firefox */
    -ms-overflow-style: none; /* For IE and Edge */
  }
  .recsys-section .upcoming-events::-webkit-scrollbar{
    display: none; /* For webkit */
  }

  @media only screen and (min-width: 768px) {
    .homepage-card p {
      display: block;
    }

    .info-card-section {
      box-sizing: border-box;
      width: 100%;
      padding: 1.5rem;
      justify-content: center;
    }

    #praesidium-card {
      max-width: 100%;
      width: 100%;
      max-height: 30rem;

      padding-bottom: 0;
      border-radius: 15px;

      display: flex;
      flex-direction: row-reverse;
      align-items: center;
    }

    #praesidium-card .image-wrapper {
      padding: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      overflow: hidden;
      border-radius: 15px 0px 0px 15px;
      flex: 1;
    }

    #praesidium-card .image-wrapper img {
      min-height: 100%;
    }

    #praesidium-card .info-container {
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      text-align: center;
      padding: 2rem 0;
      flex: 1;
    }

    #praesidium-card .info-container p {
      font-size: x-large;
      flex: 1;
      width: 85%;
    }

    #praesidium-card .info-container .lid-button {
      flex: 1;
    }
  }

  /**
	 * Scrolling carousel
	 * Credits to: https://codepen.io/studiojvla/pen/qVbQqW
	 */
  @mixin white-gradient {
    background: linear-gradient(to right,  rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
  }

  $animationSpeed: 40s;

  // Animation
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-250px * 7))}
  }

  .slider {
    @apply py-2 bg-white w-full relative overflow-hidden m-auto;

    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, .125);
    height: 100px;

    &::before,
    &::after {
      @include white-gradient;
      content: "";
      height: 100px;
      position: absolute;
      width: 200px;
      z-index: 2;
    }

    &::after {
      right: 0;
      top: 0;
      transform: rotateZ(180deg);
    }

    &::before {
      left: 0;
      top: 0;
    }

    .slide-track {
      animation: scroll $animationSpeed linear infinite;
      display: flex;
      width: calc(100% * 14);
    }

    .slide {
      height: 100px;
      width: 250px;
    }
  }

  .partner-section {
    background-color: var(--mainwhite);
  }
</style>