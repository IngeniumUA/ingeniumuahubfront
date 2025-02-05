<script lang="ts">
  import Header from '$lib/components/layout/header.svelte';
  import PartnersGrid from '$lib/components/partners/partners-grid.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Partner relations | Ingenium UA</title>
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main class="relative h-full" id="main-content">
  <div class="ingenium-container">
    <h1 class="white-section-title white-section-title-blue white-section-title-large" lang="en">Partner relations</h1>
    <p>Ingenium organiseert verschillende activiteiten en evenementen om de studenten te ondersteunen in hun academische
      en professionele carrière. Hieronder vindt u meer informatie over onze evenementen en hoe u als bedrijf hieraan
      kan deelnemen.</p>

    <!-- EOT -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="col-span-1 md:col-span-2">
        <h2 class="text-base mb-2 font-bold">Engineers of Tomorrow</h2>
        <p>Sinds het academiejaar 2019-2020 hebben wij vanuit de faculteit de kans gekregen om samen
          met de alumnivereniging DavingA het job-event Bedrijf zoekt Ingenieur over te nemen. Onze eerste editie was
          direct een zeer geslaagd event. Met iets meer dan 150 studenten en
          meer dan 60 bedrijven hadden we de lat voor onszelf meteen hoog gelegd. De vorige jaren
          hebben we ondanks Covid-19 deze getallen kunnen evenaren in een onlineversie van het event,
          gemaakt door onze eigen ICT studenten en Alumni binnen de twee clubs. Sinds vorig jaar heeft
          het evenement weer in het echt plaatsgevonden. Onze jobbeurs bestaat uit twee delen, het speeddate gedeelte
          voor de masterstudenten en
          vervolgens de jobbeurs waarbij de bachelorstudenten en de alumnistudenten ook welkom
          zijn. We hebben al de feedback die de bedrijven ons hebben gegeven bestudeerd en zijn alvast
          bezig met het plannen van de vijfde editie! Zo gaan we onze matchmaking aanpassen zodat
          deze beter uitkomt en gaan we ook onze timing aanpassen. We hebben ook aan de faculteit
          gevraagd om op deze dag geen lessen te laten doorgaan.</p>
        <p>Natuurlijk vraagt u zich af waarom het een meerwaarde is om via ons deel te nemen aan
          Engineers of Tomorrow. We werken namelijk met een selectieprocedure voor de bedrijven, zo
          willen we vermijden dat er te veel bedrijven op de beurs zouden staan waarvoor er eigenlijk
          geen interesse is. Partners van Ingenium hebben vanaf het begin de zekerheid van een plaats, zo krijgen zij de
          kans om hun bedrijf alsnog te promoten bij de studenten. Ook bieden wij onze partners een
          gunstige plaats aan tijdens de jobbeurs, dit kan variëren van een plek vlak bij de inkom tot
          een plaats naast de bar. Want laten we eerlijk zijn, daar zijn de meeste studenten natuurlijk te
          vinden!</p>
        <a href="https://www.engineersoftomorrow.com/eot-voor-bedrijven/home" target="_blank" referrerpolicy="origin" rel="noopener"
           class="mt-3 block button button-outline-blue button-sm">Meer op de EoT website</a>
      </div>
      <enhanced:img src="$assets/images/EoT_interview.png" alt="" aria-hidden="true" />
    </section>

    <!-- NOON PITCH -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
      <enhanced:img src="$assets/images/pitch.png" alt="" aria-hidden="true" />
      <div class="col-span-1 md:col-span-2">
        <h2 class="text-base mb-2 font-bold">Bedrijfspitch-middag op campus</h2>
        <p>
          Company branding is hottopic. In samenwerking met UAntwerpen, richten wij sessies in waarin bedrijven
          zich kunnen voorstellen aan de studenten van FTI om zo reeds een connectie op te bouwen met de ingenieurs
          van de toekomst. Het is aan het bedrijf om de student 45 minuten te boeien met een interessant, technisch
          topic. Leuke onderwerpen zijn bijvoorbeeld: IoT, blockchain technology, duurzame innovatie, grote
          projecten en de inpakt hiervan, etc. Goodies zijn altijd welkom. Wij voorzien ook een broodje en drankje
          voor de aanwezige studenten en sprekers. De studenten dienen zich in te schrijven voor de pitch zodat wij
          een idee hebben van het aantal aanwezigen.
          In het verleden zijn de pitches wel degelijk een succes geweest, we hebben reeds bedrijven gehad die zeer
          interessante onderwerpen voorstelden op een zeer interactieve manier.
          De aanwezige studenten hebben vaak ook de kans gekregen om kennis te maken met een ingenieur die voor het
          bedrijf werkt. Op deze manier krijgen ze een uitgebreid beeld van wat ze zouden kunnen verwachten wanneer
          zo voor dit bedrijf kunnen gaan werken.
        </p>
      </div>
    </section>

    <!-- EVENING PITCH -->
    <section class="mt-6 py-6 border-y border-gray-200 mb-8">
      <h2 class="text-base mb-2 font-bold">Bedrijfspitch-avond op campus</h2>
      <p>
        Na succes van vorige jaren, zullen er ook dit jaar weer pitchavonden zijn!
        Het concept is hetzelfde als de pitch maar hier komen meerdere bedrijven op één avond zich voorstellen. Er zullen in plaats van broodjes, pizza’s worden voorzien als avondeten, waarna de pitches zullen beginnen.
        De pitches zijn ook per studeerrichting ingedeeld zodat verschillende bedrijven tegelijk gericht kunnen pitchen.
        Na de laatste pitches is er nog de mogelijkheid om te netwerken met de studenten.
      </p>
    </section>
  </div>

  <section>
    <div class="ingenium-container">
      <h2 class="white-section-title white-section-title-blue">De partners van Ingenium UA</h2>
    </div>
    <PartnersGrid partners={ data.partners } />
  </section>
</main>
