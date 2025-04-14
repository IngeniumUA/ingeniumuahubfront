<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { selectedEvent, eventDict, GetEventsService } from '$lib/scanners/get-events.ts';
	import { onMount } from 'svelte';
	import { PriceDict, PricesService } from '$lib/scanners/prices.ts';
	import { AppStorage } from '$lib/scanners/storage.ts';

	let previousPage : string = base ;

	afterNavigate(({from}) => {
		previousPage = from?.url.pathname || previousPage
	})

	let eventSetter = new GetEventsService()
	const pricesService = new PricesService(AppStorage)
	pricesService.setupPrices()

	let EventPrice: number = 0;
	let DisplayPrice: string = "Niet ingesteld"
	let InputPrice: string = ""

	let selectedItem = selectedEvent
	let events: any = undefined

	let confirmDelete: string = ""

	onMount(()=> {
		events = Object.keys(eventDict)
		selectedItem = selectedEvent

		let uuids: any = Object.values(eventDict)

		let PriceDictKeys = Object.keys(PriceDict)
		for (let id of uuids) {
			if (!PriceDictKeys.includes(id)) {
				PriceDict[id] = -1
				let storageDict: any = {}
				storageDict[id] = -1
				AppStorage.setStorage("prices", storageDict)
			}
		}
		if (selectedItem !== undefined) {
			EventPrice = PriceDict[eventDict[selectedItem]]
			if (EventPrice === -1) {
				DisplayPrice = "Niet ingesteld"
			} else {
				DisplayPrice = EventPrice.toFixed(2)
			}
		}
	})

	function SetPrice() {
		let eventUUID = eventDict[selectedItem]
		if (InputPrice !== "") {
			PriceDict[eventUUID] = +InputPrice
			let storageDict: any = {}
			storageDict[eventUUID] = +InputPrice
			AppStorage.setStorage("prices", storageDict)
		}
		goto(previousPage)
	}

	function onItemSelection() {
		eventSetter.setEvent(selectedItem)

		EventPrice = PriceDict[eventDict[selectedItem]]
		if (EventPrice === -1) {
			DisplayPrice = "Niet ingesteld"
		} else {
			DisplayPrice = EventPrice.toFixed(2)
		}
	}

	function clearPrices() {
		if (confirmDelete === "") {
			confirmDelete = "Ben je zeker? Dit kan niet ongedaan gemaakt worden."
		} else {
			AppStorage.clearSpecific("prices")
			confirmDelete = ""
		}
	}

</script>

<svelte:head>
	<title>Prijs instellingen</title>
</svelte:head>

<main class="ingenium-container" id="main-content">
	<div class="absolute inset-y-0 right-0 flex pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ml-3 z-40">

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

	<div class="prices">
<!--		displays current price-->
		<div class="sameline">
			<p>Niet-lid prijs [€]:</p>
			<div class="right">
				<p>{DisplayPrice}</p>
			</div>
		</div>

<!--		input field for new price-->
		<fieldset>
			<div class="form-field">
				<input id="priceInput" type="number" bind:value={ InputPrice } on:change={()=>SetPrice()}/>
			</div>
		</fieldset>

		<div class="flex flex-col items-center">
			<button on:click={()=>{SetPrice()}} role="menuitem" class="button button-primary button-sm my-4">Stel prijs in</button>
		</div>

		<div class="flex flex-col items-center">
			<button on:click={()=>{clearPrices()}} role="menuitem" class="button button-danger button-sm my-4">Verwijder prijslijst</button>
			<p class="alert-danger">{confirmDelete}</p>
		</div>
	</div>


	<div class="absolute right-0 pr-2 sm:pr-0 bottom-3 flex sm:static sm:inset-auto sm:ml-6 ml-3 z-40">
		<button on:click={()=>{goto(previousPage)}} title="Back"
						class="button button-primary button-icon-only relative items-center justify-center button-accessibility-white h-10 z-50" style="margin: 1.12rem">
			<span class="hidden md:inline">Terug</span>
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
			</svg>
		</button>
	</div>
</main>

<style lang="scss">
  main {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

	.sameline {
		display: flex;
	}

	.prices {
		position: absolute;
		top: 25%;
		width: 80vw;
		left: 10vw;
		z-index: 50;
		@media only screen and (min-width: 768px) {
		width: 30vw;
		left: 35vw;
	}
	}

	.right {
		position: absolute;
		right: 10px;
	}
</style>
