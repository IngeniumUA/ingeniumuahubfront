<script lang="ts">
	import schild from '$assets/svg/biomedica-schild.svg';

	let { serverHostname = '' } = $props();
</script>

<footer>
	<div class="footer-logo">
		<img src={schild} alt="" aria-hidden="true" height="1024" width="1024">
	</div>
	<div class="footer-content">
		<address class="text-center mb-2">Biomedica UA vzw<br>Adres hierzo :)</address>

		<div class="footer-end">
			<p>BTW nummer</p>
			<p>Telefoon</p>
			<div class="flex gap-x-4">
				<a href="/info/contact">Meer contact info</a>
				<a href="/info/credits">Credits</a>
			</div>
		</div>

		<p class="server-info hidden" aria-hidden="true">{ serverHostname }</p>
	</div>
</footer>

<style lang="scss">
  footer {
    @apply mt-12 text-gray-300 border-t border-white/5 relative;

    .footer-logo {
      @apply absolute -top-8 left-0 w-full flex justify-center;

      img {
        @apply max-h-32 drop-shadow-lg;
      }
    }

    &:before {
      @apply block bg-red-950 h-36 w-full;
      content: '';
    }

    .footer-content {
      @apply bg-red-950 -mt-8 pb-4 text-xs text-gray-300 relative;

      .footer-end {
        @apply border-t border-red-900 px-6 pt-4 flex flex-col md:flex-row gap-y-3 gap-x-6 items-center justify-center;

        p {
          @apply text-inherit;
        }
      }

			.server-info {
				@apply text-red-900/90 absolute right-0 bottom-0 px-6 pb-4;
			}
    }

    a {
      @apply outline-white;
    }
  }
</style>
