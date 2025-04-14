<script lang="ts">
		import { onMount } from 'svelte';
		import {
			AppStorage,
			disableSound,
			doAutoReturn,
			setAutoReturnValue,
			setdisableSoundValue, setreturnTime
		} from '$lib/scanners/storage.ts';
		import { goto } from '$app/navigation';

		let touchStartX = 0;
		let touchEndX = 0;

		function handleTouchStart(e: TouchEvent) {
			touchStartX = e.changedTouches[0].screenX;
		}

		function handleTouchEnd(e: TouchEvent) {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		}

		function handleSwipe() {
			const diff = touchEndX - touchStartX;

			if (Math.abs(diff) > 50) {
				if (diff > 0) {
					goto("/scanners/tickets");
				} else {
					goto("/scanners/tickets/blueprints");
				}
			}
		}

		let inputReturnTime: string = ""

		let confirmDelete: string = ""
		let confirmDeleteAll: string = ""


		let doAutoReturnBox: boolean = false
		let disableSoundBox: boolean = false

		onMount(()=> {
			AppStorage.getStorage("settings")?.then((result: any) => {
				console.log(JSON.stringify(result));
				if (result !== undefined) {
					setAutoReturnValue(result["autoReturn"])
					if (doAutoReturn) {
						doAutoReturnBox = true
					}
					setdisableSoundValue(result["soundDisable"])
					if (disableSound) {
						disableSoundBox = true
					}
					if (result["returnTime"] !== undefined) {
						inputReturnTime = result["returnTime"]
					}
				}
			});

			if (doAutoReturn) {
				doAutoReturnBox = true
			}
			if (disableSound) {
				disableSoundBox = true
			}
		})

		function SetPrices() {
			goto('/scanners/tickets/prices');
		}

		async function setAutoReturn() {
			setAutoReturnValue(!doAutoReturnBox)
			AppStorage.setStorage("settings", { "autoReturn": !doAutoReturnBox })
		}

		async function setDisableSound() {
			setdisableSoundValue(!disableSoundBox)
			AppStorage.setStorage("settings", { "soundDisable": !disableSoundBox })
		}

		function setReturnTime() {
			setreturnTime(+inputReturnTime)
			AppStorage.setStorage("settings", {"returnTime": inputReturnTime})
		}

		function clearMemory() {
			if (confirmDeleteAll === "") {
				confirmDeleteAll = "Ben je zeker? Dit kan niet ongedaan gemaakt worden."
			} else {
				AppStorage.reset()
				confirmDeleteAll = ""
			}
		}

		function clearSettings() {
			if (confirmDelete === "") {
				confirmDelete = "Ben je zeker? Dit kan niet ongedaan gemaakt worden."
			} else {
				AppStorage.clearSpecific("settings")
				confirmDelete = ""
			}
		}
</script>

<svelte:head>
	<title>Scanner instellingen</title>
</svelte:head>

<main class="ingenium-container" id="main-content" on:touchstart={handleTouchStart}
			on:touchend={handleTouchEnd}>

	<div class="absolute inset-y-0 right-0 flex pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ml-3 z-40">
		<a href="/scanners" title="Home"
			 class="button button-primary button-icon-only relative items-center justify-center button-accessibility-white h-10 z-50" style="margin: 1.12rem">
			<span class="hidden md:inline">Home</span>
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
			</svg>
		</a>
	</div>

	<div class="settings">
		<div class="flex flex-col items-center">
			<button on:click={()=>{SetPrices()}} role="menuitem" class="button button-outline-blue button-full button-sm my-4">Stel prijzen in</button>
		</div>

		<fieldset class="grid space-y-1.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
			<div class="form-field form-field-checkbox">
				<input id="mute" type="checkbox" bind:checked={ disableSoundBox } on:click={()=>{setDisableSound()}}>
				<label for="mute">Mute</label>
			</div>
			<div class="form-field form-field-checkbox">
				<input id="autoReturn" type="checkbox" bind:checked={ doAutoReturnBox } on:click={()=>{setAutoReturn()}}>
				<label for="autoReturn">Automatisch terugkeren</label>
			</div>
			<div class="form-field">
				<label for="returnTime">Terugkeertijd [s]</label>
				<input id="returnTime" type="number" bind:value={ inputReturnTime } on:change={()=>{setReturnTime()}}/>
			</div>
		</fieldset>
		<br>

		<div class="flex flex-col items-center">
			<button on:click={()=>{clearSettings()}} role="menuitem" class="button button-danger button-sm my-4">Verwijder opgeslagen instellingen</button>
			<p class="alert-danger">{confirmDelete}</p>
		</div>

		<div class="flex flex-col items-center">
			<button on:click={()=>{clearMemory()}} role="menuitem" class="button button-danger button-sm my-4">Verwijder alle gegevens</button>
			<p class="alert-danger">{confirmDeleteAll}</p>
		</div>
	</div>

	<div class="absolute left-0 pl-2 sm:pl-0 bottom-3 flex sm:static sm:inset-auto sm:ml-6 ml-3 z-40">
		<a href="/scanners/tickets" title="Ticket scanner"
			 class="button button-primary button-icon-only relative items-center justify-center button-accessibility-white h-10 z-50" style="margin: 1.12rem">
			<span class="hidden md:inline">Ticket scanner</span>
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z"/>
				<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z"/>
			</svg>
		</a>
	</div>

	<div class="absolute right-0 pr-2 sm:pr-0 bottom-3 flex sm:static sm:inset-auto sm:ml-6 ml-3 z-40">
		<a href="/scanners/tickets/blueprints" title="Blueprints"
			 class="button button-primary button-icon-only relative items-center justify-center button-accessibility-white h-10 z-50" style="margin: 1.12rem">
			<span class="hidden md:inline">Blueprints</span>
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7h1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h11.5M7 14h6m-6 3h6m0-10h.5m-.5 3h.5M7 7h3v3H7V7Z"/>
			</svg>
		</a>
	</div>
</main>

<style lang="scss">
  main {
    margin: 0;
    padding: 0;
    width: 90%;
    height: 100%;
    overflow: hidden;
  }

  .settings {
    position: absolute;
    top: 15%;
		left: 10vw;
    width: 80vw;
    @media only screen and (min-width: 768px) {
      width: 30vw;
      left: 35vw;
    }
  }
</style>
