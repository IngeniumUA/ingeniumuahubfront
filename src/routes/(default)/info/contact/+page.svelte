<script lang="ts">
  import Header from '$lib/components/layout/header.svelte';
</script>

<svelte:head>
  <title>Contacteer ons | Ingenium UA</title>
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main class="relative h-full" id="main-content">
  <div class="ingenium-container">
    <h1 class="white-section-title white-section-title-blue white-section-title-large">Contacteer ons</h1>
    <p>Welkom op de website van Ingenium, Ingenium is de studentenvereniging van de faculteit Toegepaste Ingenieurswetenschappen aan de Universiteit Antwerpen.<br>
      Twijfel niet en contacteer ons via social media, mail of telefonisch!</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 mt-6">
      <section class="contact-section" aria-labelledby="br-contact">
        <h2 id="br-contact" class="white-section-title">Voor bedrijven</h2>
        <p>Ons Business Relations team staat voor je klaar!</p>

        <dl>
          <dt>Yorben Joosen</dt>
          <dd>
            Mail: yorben.joosen&#64;ingeniumua.be <br>
            Tel: +32 468 10 37 94
          </dd>

          <dt>Renzo Craeymeersch</dt>
          <dd>
            Mail: renzo.craeymeersch&#64;ingeniumua.be <br>
            Tel: +32 499 14 90 15
          </dd>

          <dt>Ward De Voeght</dt>
          <dd>
            Mail: ward.devoeght&#64;ingeniumua.be <br>
            Tel: +32 474 57 63 27
          </dd>
        </dl>
      </section>

      <section class="contact-section" aria-labelledby="praeses-contact">
        <h2 id="praeses-contact" class="white-section-title">Praeses</h2>
        <p>Zijn onze Business Relations niet helemaal juist voor je vraag?</p>

        <dl>
          <dt>Nico Verstappen</dt>
          <dd>
            Mail: nico.verstappen&#64;ingeniumua.be <br>
            Tel: +32 470 69 80 74
          </dd>
        </dl>
      </section>

      <div class="contact-section" aria-labelledby="pr-contact">
        <h2 id="pr-contact" class="white-section-title">Public Relations</h2>
        <p>Voor vragen over onze social media en/of public relations.</p>

        <dl>
          <dt>Alexander Ceuppens & Lore Philips</dt>
          <dd>
            Mail: public.relations&#64;ingeniumua.be
          </dd>
        </dl>
      </div>
    </div>

    <section class="mt-5">
      <h2 class="white-section-title mb-2">Sociale media</h2>
      <ul class="list-disc list-inside">
        <li><a href="https://www.facebook.com/INGENIUM.FTI" target="_blank" rel="noopener">Facebook</a></li>
        <li><a href="https://www.instagram.com/ingeniumua/" target="_blank" rel="noopener">Instagram</a></li>
        <li><a href="https://www.linkedin.com/company/ingeniumua/" target="_blank" rel="noopener">LinkedIn</a></li>
      </ul>
    </section>
  </div>
</main>

<style lang="scss">
  .contact-section {
    @apply leading-6 text-gray-600 p-4 bg-gray-100 rounded;

    dt {
      @apply text-base font-bold text-blue-950 mt-3 mb-1;
    }

    dl {
      @apply text-sm;
    }
  }
</style>