<script lang="ts">
	import { page } from "$app/state";
	import { auth, isAuthenticated } from "$lib/states/auth.svelte";
	import { getLoginUrlWithRedirect, doLogout } from "$lib/auth/auth";

	import ingeniumSchild from '$assets/svg/ingenium-schild.svg';

	let { noBackground = false, whiteTheme = false } = $props();
	let mobileMenuOpen = $state(false);
	let infoDropdownOpen = $state(false);
	let accountDropdownOpen = $state(false);

	let getNavigationTheme = $derived.by(() => {
		if (noBackground) {
			return 'nav-transparent-background';
		}
		return whiteTheme ? 'nav-white' : 'nav-dark';
	});
</script>

<!-- ACCESSIBILITY BUTTON TO CONTENT -->
<a class="accessibility-go-to-content" href="#main-content">Naar de inhoud</a>
<!-- NAVIGATION -->
<nav class="{ getNavigationTheme }">
	<div class="px-2 sm:px-6 lg:px-8">
		<div class="relative flex h-24 items-center justify-between">

			<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
				<!-- Mobile menu button-->
				<button type="button" class="button button-primary button-icon-only relative inline-flex items-center justify-center { !whiteTheme ? '' : 'button-accessibility-white' }"
								aria-controls="mobile-menu" aria-expanded="{mobileMenuOpen}"
								onclick={ () => mobileMenuOpen = !mobileMenuOpen }
				>
					<span class="sr-only">Open navigatie</span>
					{#if mobileMenuOpen}
						<svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{:else}
						<svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
						</svg>
					{/if}
				</button>
			</div>

			<div class="nav-logo-wrapper">
				<!-- LOGO -->
				<a href="/" class="nav-logo-link">
					<span class="sr-only">Ingenium home pagina</span>
					<img class="h-16 w-auto" src="{ingeniumSchild}" alt="" aria-hidden="true" height="1024" width="1024">
				</a>
			</div>

			<div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0" role="menubar">
				<!-- DESKTOP MENU -->
				<div class="desktop-nav">
					<div class="flex space-x-4">
						<a href="/" class="nav-item" role="menuitem">Home</a>
						<a href="/events" class="nav-item" role="menuitem">Events</a>

						<!-- INFO DROPDOWN -->
						<div class="relative">
							<button type="button" onclick={ () => infoDropdownOpen = !infoDropdownOpen } id="info-menu-button"
											role="menuitem" aria-expanded="{infoDropdownOpen}" aria-haspopup="menu" class="nav-item flex items-center">
								Info <span aria-hidden="true" class="text-inherit ml-2 text-xs">&#9660;</span>
							</button>

							{#if infoDropdownOpen}
								<div class="block nav-dropdown" role="menu" aria-orientation="vertical" aria-labelledby="info-menu-button" tabindex="-1">
									<a href="/info" class="nav-dropdown-item" role="menuitem">Over ons</a>
									<a href="/info/praesidium" class="nav-dropdown-item" role="menuitem">Praesidium</a>
									<a href="/info/relations" class="nav-dropdown-item">Partner relations</a>
									<a href="https://www.engineersoftomorrow.com/" target="_blank" rel="opener" class="nav-dropdown-item" role="menuitem">Engineers Of Tomorrow</a>
									<a href="/vacatures" class="nav-dropdown-item" role="menuitem">Vacatures</a>
									<a href="/info/clublied" class="nav-dropdown-item" role="menuitem">Clublied</a>
									<a href="/info/contact" class="nav-dropdown-item" role="menuitem">Contact</a>
								</div>
							{/if}
						</div>
						<!-- INFO DROPDOWN END -->

						<a href="/shop" class="nav-item" role="menuitem">Shop</a>
						<a href="/cloud" class="nav-item" role="menuitem">Cloud</a>
					</div>
				</div>
				<!-- DESKTOP MENU END -->

				<!-- Profile dropdown -->
				<div class="relative ml-3">
					<div>
						{#if isAuthenticated()}
							<!-- Profile dropdown button -->
							<button type="button" onclick={ () => accountDropdownOpen = !accountDropdownOpen } aria-haspopup="true" id="profile-menu-button"
								class="button button-primary button-icon-only relative inline-flex items-center justify-center { !whiteTheme ? '' : 'button-accessibility-white' }">
								<span class="hidden md:inline">Profiel <span aria-hidden="true" class="text-white ml-2 text-xs">&#9660;</span></span>
								<svg class="md:hidden block h-6 w-6" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke-linecap="round" stroke-linejoin="round"></path>
								</svg>
							</button>
						{:else}
							<!-- Login button -->
							<a href={ getLoginUrlWithRedirect(undefined, page) } title="Aanmelden"
											class="button button-primary button-icon-only relative inline-flex items-center justify-center { !whiteTheme ? '' : 'button-accessibility-white' }">
								<span class="hidden md:inline">Aanmelden</span>
								<svg class="md:hidden block h-6 w-6" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" stroke-linecap="round" stroke-linejoin="round"></path>
								</svg>
							</a>
						{/if}
					</div>

					<!-- Profile dropdown menu -->
					{#if accountDropdownOpen && isAuthenticated() }
						<div class="block nav-dropdown" role="menu" aria-orientation="vertical" aria-labelledby="profile-menu-button" tabindex="-1">
							<a href="/account" class="nav-dropdown-item font-bold text-blue-900" role="menuitem">Jouw profiel</a>
							<a href="/account/transactions" class="nav-dropdown-item" role="menuitem">Aankopen</a>

							<button type="button" class="nav-dropdown-item" role="menuitem" onclick={ doLogout }>Afmelden</button>

							<hr class="nav-dropdown-divider">

							{#if auth.user?.realm_access.roles.includes("staff")}
								<a href="/scanners" class="nav-dropdown-item" role="menuitem">Scanners</a>

								<hr class="nav-dropdown-divider">
							{/if}

							<span class="nav-dropdown-no-link">
								<span class="sr-only">Je bent ingelogd met</span>
								{ auth.user?.email }
							</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="mobile-nav" role="menu">
			<div class="space-y-1 px-2 pb-3 pt-2">
				<a href="/" class="nav-item" role="menuitem">Home</a>
				<a href="/events" class="nav-item" role="menuitem">Events</a>
				<a href="/shop" class="nav-item" role="menuitem">Shop</a>
				<a href="/cloud" class="nav-item" role="menuitem">Cloud</a>
				<a href="/info" class="nav-item" role="menuitem">Over ons</a>
				<a href="/info/praesidium" class="nav-item" role="menuitem">Praesidium</a>
				<a href="/info/relations" class="nav-item" role="menuitem">Partner relations</a>
				<a href="/vacatures" class="nav-item" role="menuitem">Vacatures</a>
				<a href="/info/clublied" class="nav-item" role="menuitem">Clublied</a>
				<a href="/info/contact" class="nav-item" role="menuitem">Contact</a>
			</div>
		</div>
	{/if}
</nav>

<style lang="scss">
  .accessibility-go-to-content {
    @apply fixed bg-black text-white p-4 z-50 text-xl;
    left: 50%;
    transform: translateY(-100%);

    &:focus {
      transform: translateY(1rem) translateX(-50%);
    }
  }

  nav {
    @apply w-full bg-blue-950 border-b border-white/5;

    a {
      @apply no-underline;
    }

    .nav-item {
      @apply text-gray-300 border border-transparent hover:border-b-white hover:text-white rounded px-3.5 py-2.5 font-medium outline-none focus:ring-2 focus-visible:ring-4 ring-white transition-colors ease-in-out;

      &.nav-item-active {
        @apply text-white border-b-white;
      }
    }

    .nav-logo-wrapper {
      @apply flex flex-1 items-center justify-center sm:items-stretch sm:justify-start;

      .nav-logo-link {
        @apply flex flex-shrink-0 items-center outline-none focus-visible:ring-2 ring-white rounded-md;
      }
    }

    .nav-dropdown {
      @apply absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none;

      .nav-dropdown-item {
        @apply rounded w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-blue-950 hover:text-white outline-none ring-offset-2 focus:ring-2 focus-visible:ring-4 ring-black transition-colors ease-in-out;

        &.nav-item-active {
          @apply bg-blue-50 hover:bg-blue-950;
        }
      }

      hr {
        @apply border-t border-gray-200 my-1;
      }

      span.nav-dropdown-no-link {
        @apply block px-4 py-2 text-sm text-gray-500 truncate;
      }
    }

    .desktop-nav {
      @apply hidden sm:ml-6 sm:block;
    }

    .mobile-nav {
      @apply sm:hidden;
      background-color: #d4dbe9fa;

      .nav-item {
        @apply rounded-lg block text-blue-900 hover:bg-blue-900 hover:text-white border-transparent focus-visible:ring-black;

        &.nav-item-active {
          @apply bg-blue-900 text-white;
        }
      }
    }

    &.nav-white {
      @apply bg-white border-gray-100;

      .nav-item {
        @apply text-gray-600 border-transparent hover:border-b-gray-900 hover:text-gray-900 ring-black;

        &.nav-item-active {
          @apply text-blue-900 border-b-blue-900;
        }
      }

      .nav-logo-wrapper {
        .nav-logo-link {
          @apply ring-black;
        }
      }
    }

    &.nav-transparent-background {
      @apply bg-transparent;
    }

  }
</style>