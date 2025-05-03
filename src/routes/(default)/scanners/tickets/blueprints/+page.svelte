<script lang="ts">
	import { eventDict, GetEventsService, selectedEvent } from '$lib/scanners/get-events.ts';
	import { BlueprintsService, blueprintsDict } from '$lib/scanners/blueprints.ts';
	import { onMount } from 'svelte';
	import { AppStorage } from '$lib/scanners/storage.ts';
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
				goto("/scanners/tickets/settings");
			} else {
				goto("/scanners/tickets");
			}
		}
	}

	let eventBlueprints: any = []
	let boxStates: any = {}

	let selectedItem = selectedEvent
	let events: any = undefined
	let actualEventSelected: boolean = false

	const blueprintGetter = new BlueprintsService()
	const eventSetter = new GetEventsService()

	let confirmDelete: string = ""


	onMount(async ()=>{
		events = Object.keys(eventDict)
		selectedItem = selectedEvent
		actualEventSelected = !(selectedItem === "" || selectedItem === 'Alle evenementen');
		await setBlueprints()
	})

	async function setBlueprints() {
		const result = await blueprintGetter.getBlueprints()
		if (result === "server_error") {
			goto('/')
		} else {
			eventBlueprints = Object.keys(blueprintsDict[selectedEvent])
			boxStates = blueprintsDict[selectedEvent]
		}
	}

	function onItemSelection() {
		eventSetter.setEvent(selectedItem)
		actualEventSelected = !(selectedItem === "" || selectedItem === 'Alle evenementen');
		setBlueprints()
	}

	function boxToggled() {
		blueprintGetter.dictSetter(boxStates, selectedEvent)
	}

	function clearBlueprints() {
		if (confirmDelete === "") {
			confirmDelete = "Ben je zeker? Dit kan niet ongedaan gemaakt worden."
		} else {
			AppStorage.clearSpecific("blueprints")
			confirmDelete = ""
		}
	}

</script>

<svelte:head>
	<title>Blueprint opties</title>
</svelte:head>

<main class="ingenium-container" id="main-content" on:touchstart={handleTouchStart}
			on:touchend={handleTouchEnd}>

	<div class="absolute inset-y-0 right-0 flex pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ml-3 z-40 mt-6">
		<div class="form-field" style="padding: 10px;">
			<div>
				<select
					id="eventSelect"
					bind:value={selectedItem}
					on:change={()=>{onItemSelection()}}
				>
					<option disabled value="">
						Selecteer een evenement
					</option>
					{#each events as event}
						<option value={event}>{event}</option>
					{/each}
				</select>
			</div>
		</div>

		<a href="/scanners" title="Home"
			 class="button button-primary button-icon-only relative items-center justify-center button-accessibility-white h-10 z-50" style="margin: 1.12rem">
			<span class="hidden md:inline">Home</span>
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
			</svg>
		</a>
	</div>

	<div class="blueprints">

		{#if actualEventSelected}
			<div class="p-4">
				{#each eventBlueprints as blueprint}
					<div class=" form-field form-field-checkbox flex items-center justify-between border-b py-2">
						<input
							id="{blueprint}"
							type="checkbox"
							bind:checked={boxStates[blueprint]}
							on:change={()=>{boxToggled()}}
						/>
						<label for="{blueprint}" class="flex items-center space-x-2">
							<span>{blueprint}</span>
						</label>
					</div>
				{/each}
			</div>
		{/if}

		<div class="flex flex-col items-center">
			<button on:click={()=>{clearBlueprints()}} role="menuitem" class="button button-danger button-sm my-4">Verwijder blueprint instellingen</button>
			<p class="alert-danger">{confirmDelete}</p>
		</div>
	</div>


	<div class="absolute right-0 pr-2 sm:pr-0 bottom-3 flex sm:static sm:inset-auto sm:ml-6 ml-3 z-40">
		<a href="/scanners/tickets" title="Ticket scanner"
			 class="button button-primary button-icon-only relative items-center justify-center button-accessibility-white h-10 z-50" style="margin: 1.12rem">
			<span class="hidden md:inline">Ticket scanner</span>
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z"/>
				<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z"/>
			</svg>
		</a>
	</div>

	<div class="absolute left-0 pl-2 sm:pl-0 bottom-3 flex sm:static sm:inset-auto sm:ml-6 ml-3 z-40">
		<a href="/scanners/tickets/settings" title="Instellingen"
			 class="button button-primary button-icon-only relative items-center justify-center button-accessibility-white h-10 z-50" style="margin: 1.12rem">
			<span class="hidden md:inline">Instellingen</span>
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"/>
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
			</svg>
		</a>
	</div>
</main>

<style lang="scss">
  .blueprints {
    position: absolute;
		top: 15%;
    width: 80vw;
		left: 10vw;
    height: 60vh;
		z-index: 55;
    @media only screen and (min-width: 768px) {
      width: 30vw;
      left: 35vw;
    }
  }
</style>
