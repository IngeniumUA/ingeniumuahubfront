<script lang="ts">
  import Header from '$lib/components/layout/header.svelte';
</script>

<svelte:head>
  <title>Over ons | Ingenium UA</title>
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main class="relative h-full" id="main-content">
  <div class="ingenium-container">
    <h1 class="white-section-title white-section-title-blue white-section-title-large">Over Ingenium</h1>
    <p></p>

    <!-- WHO ARE WE -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="col-span-1 md:col-span-2">
        <p>Ingenium bestaat inmiddels al vijf jaar en we merken dat een sterke connectie tussen
          de bedrijfswereld en studenten steeds belangrijker wordt. Al vier academiejaren
          organiseert Ingenium samen met DavingA (alumnivereniging) ons jobevent, Engineers
          of Tomorrow. Na twee succesvolle online jobevents hebben we het afgelopen academiejaar met
          veel succes een fysiek evenement georganiseerd, waarmee we direct impact hebben
          gemaakt in de Antwerpse bedrijfswereld. Net als vorig jaar hebben we weer een groot aantal nieuwe leden verwelkomd en we
          integreren steeds meer in het studentenleven van Antwerpen. Hoewel we nog steeds
          nieuwe dingen leren, mogen we trots zijn op wat we als jonge vereniging in vijf jaar
          hebben bereikt. Als vereniging hechten wij veel belang aan feedback van onze leden en partners. Aan
          de hand van deze feedback en constante evaluaties van evenementen heeft Ingenium
          de afgelopen 5 jaar een enorme groei gekend. Deze groei zullen wij komende jaren
          verderzetten met een compleet nieuw marketingteam. Met onze kennis en visie
          zullen er gegarandeerd nog veel succesvolle jaren aankomen.
        </p>
        <a href="/info/praesidium" class="mt-3 block button button-outline-blue button-sm">Bekijk het huidig praesidium</a>
      </div>
      <enhanced:img src="$assets/images/praesidium_thumb.webp" alt="" aria-hidden="true" />
    </div>
  </div>

  <!-- VISION AND AMBITION -->
  <section class="visual-break-section">
    <div class="ingenium-container grid grid-cols-1 lg:grid-cols-3 gap-4">
      <enhanced:img src="$assets/images/galabal.jpg"  alt="" aria-hidden="true" />
      <div class="col-span-1 md:col-span-2">
        <h2>Onze visie</h2>

        <p>We willen een frisse blik werpen op het huidige studentenleven en bijdragen
          leveren aan een duurzame levensstijl voor de studenten. Het combineren van de
          traditionele activiteiten en feesten van de studentenverenigingen met een goede
          dosis leerbegeleiding en verantwoorde evenementen die de studenten in hun verdere
          carrière zullen helpen. Wij willen dan ook de samenwerking aangaan met de industrie
          om van onze studenten de ideale toekomstige werknemers te maken.
        </p>

        <h2 class="mt-6">Onze ambitie</h2>
        <p>Als jonge vereniging zijn we absoluut niet verlegen om ambitieus te zijn. Ons team werkt heel nauw samen om elk jaar een goede dosis activiteiten te voorzien van elke soort. Dit kan gaan van een pop-up middagfestival, een TD tot Engineers of Tomorrow, ons eigen jobevent dat we samen met DavingA, de alumniverenging van onze faculteit organiseren.</p>
      </div>
    </div>
  </section>

  <!-- EDUCATION -->
  <div class="ingenium-container">
    <section class="education-section">
      <h2>Ingenium Education</h2>
      <p>Een goed evenwicht vinden tussen het studentikoze gedeelte en
        het studeergedeelte is voor ons de voornaamste doelstelling.
        Als faculteitsvereniging willen wij ons dus ook enorm inspannen
        om studenten aan onze faculteit op alle manieren mogelijk te
        helpen in hun studies. Dit heeft ons gebracht tot Ingenium Education, een platform voor en door
        studenten. Het ondersteunt de studenten op vlak van studeren door sessies te
        geven over hoe te studeren, een boekenverkoop te plannen, etc. Ook is het een
        aanspreekpunt voor de studenten als ze vragen hebben over allerlei vakken.
        Sinds het academiejaar 2021-2022 verwezenlijkt het Education Team ook de meter/peterwerking van de faculteit mee. Dit zijn studenten die fungeren als eerste
        aanspreekpunt voor eventuele vragen van eerstejaars bachelorstudenten en
        schakelstudenten.
      </p>
      <a href="/cloud" class="mt-3 block button button-outline-blue button-sm">Ingenium Cloud bezoeken</a>
    </section>
  </div>

  <!-- IMAGINELAB -->
  <section class="visual-break-section">
    <div class="ingenium-container grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="col-span-1 md:col-span-2">
        <h2 id="imaginelab">iMaginelab</h2>

        <p>
          iMagineLab is een technologie club voor en door studenten die buiten de lesuren bezig zijn met
          wetenschap en technologie. Het voorbije jaar hebben ze vanuit de faculteit de vraag gekregen
          om IT-gerelateerde sessies te organiseren voor alle studenten. Op die manier wil onze faculteit
          ervoor zorgen dat onze ingenieurs niet alleen gespecialiseerd zijn in hun opleiding maar dat ze
          zeker ook de mogelijkheden hebben gekregen om zichzelf op technologisch vlak volledig te
          ontwikkelen. Naar aanleiding van deze vraag heeft iMaginelab contact met ons opgenomen.
        <p>
          <a href="https://imaginelab.club" rel="noopener" referrerpolicy="origin" class="mt-3 block button button-outline-blue button-sm">Bezoek imaginelab.club</a>
      </div>
      <enhanced:img alt="" aria-hidden="true" src="$assets/images/imaginelab_project.png" />
    </div>
  </section>
</main>

<style>
  .visual-break-section {
      @apply bg-gray-200 my-5;
  }

  h2 {
      @apply text-base mb-2 font-bold;
  }

  picture, img, picture > source {
      @apply w-full mx-auto rounded-sm;
  }
</style>
