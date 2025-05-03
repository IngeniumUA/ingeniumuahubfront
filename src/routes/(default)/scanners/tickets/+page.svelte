<script lang="ts">
	import { Capacitor } from '@capacitor/core';
	import {BarcodeFormat, BarcodeScanner, LensFacing, type StartScanOptions} from '@capacitor-mlkit/barcode-scanning';
	import { eventDict, GetEventsService, selectedEvent } from '$lib/scanners/get-events.ts';
	import { onMount } from 'svelte';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { setQr } from '$lib/scanners/get-qr-data.ts';
	import { App } from '@capacitor/app';
	import { base } from '$app/paths';

	let previousPage : string = base ;

	afterNavigate(({from}) => {
		previousPage = from?.url.pathname || previousPage
	})

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
				goto("/scanners/tickets/blueprints");
			} else {
				goto("/scanners/tickets/settings");
			}
		}
	}


	beforeNavigate(() => {
		stopScan().catch(err => {
			console.error('Error in stopScan before navigating:', err);
		});
	});

	let platform = Capacitor.getPlatform();

	//vars for mobile qr code scanning
	let formats: BarcodeFormat[] = [BarcodeFormat.QrCode];
	let lensFacing: LensFacing = LensFacing.Back;
	let options: StartScanOptions = {
		formats: formats,
		lensFacing: lensFacing,
	};

	let selectedItem = selectedEvent
	let events: any = undefined
	let actualEventSelected: boolean = false

	let showChooseEvent: boolean = true

	const eventService = new GetEventsService()

	onMount( ()=> {
		const removeListener = App.addListener('backButton', () => {
			if (!previousPage.includes("result")) {
				history.back()
			}
		})

		OnEnter()

		return () => {
			removeListener.then((rm) => rm.remove()); // Cleanup
		};
	})

	function OnEnter() {
		startScan().then()
		events = Object.keys(eventDict)
		console.log("scan events: " + JSON.stringify(events))
		selectedItem = selectedEvent
		if (selectedItem !== "") {showChooseEvent = false}
		actualEventSelected = !(selectedItem === "" || selectedItem === 'Alle evenementen');
	}

	async function startScan() {
		if (platform === "android") {
			if (!await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()) {
				BarcodeScanner.installGoogleBarcodeScannerModule().then()
			}
		}
		await BarcodeScanner.checkPermissions().then(result => {
			if (result.camera != "limited" && result.camera != "granted") {
				BarcodeScanner.requestPermissions()
			}
		})
		// The camera is visible behind the WebView, so that you can customize the UI in the WebView.
		// However, this means that you have to hide all elements that should not be visible.
		// You can find an example in our demo repository.
		// In this case we set a class `barcode-scanner-active`, which then contains certain CSS rules for our app.
		document.querySelector('body')?.classList.add('barcode-scanning-active');
		document.querySelector(':root')?.classList.add('barcode-scanning-active-r');

		// Add the `barcodeScanned` listener
		await BarcodeScanner.addListener( 'barcodesScanned',
			(result) => {
				console.log(result);
				if (actualEventSelected) {
					setQr(result.barcodes[result.barcodes.length-1].rawValue)
					stopScan()
					goto('/scanners/tickets/result')
				}
			}
		)

		// Start the barcode scanner
		await BarcodeScanner.startScan(options);
	}

	async function stopScan() {
		// Make all elements in the WebView visible again
		document.querySelector('body')?.classList.remove('barcode-scanning-active');
		document.querySelector(':root')?.classList.remove('barcode-scanning-active-r');

		// Remove all listeners
		await BarcodeScanner.removeAllListeners();

		// Stop the barcode scanner
		await BarcodeScanner.stopScan();
	}

	function onItemSelection() {
		eventService.setEvent(selectedItem)
		showChooseEvent = false
		actualEventSelected = !(selectedItem === "" || selectedItem === 'Alle evenementen');
	}

</script>

<svelte:head>
	<title>Ticket Scanner</title>
</svelte:head>

<main class="ingenium-container" id="main-content" on:touchstart={handleTouchStart}
			on:touchend={handleTouchEnd}>

	<div class="square"></div>

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

	<div class="scan">

		{#if showChooseEvent}
			<h1 class="error">
				Kies eerst een evenement!
			</h1>
		{/if}

	</div>

	<div class="absolute right-0 pr-2 sm:pr-0 bottom-3 flex sm:static sm:inset-auto sm:ml-6 ml-3 z-40">
		<a href="/scanners/tickets/settings" title="Instellingen"
			 class="button button-primary button-icon-only relative items-center justify-center button-accessibility-white h-10 z-50" style="margin: 1.12rem">
			<span class="hidden md:inline">Instellingen</span>
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"/>
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
			</svg>
		</a>
	</div>

	<div class="absolute left-0 pl-2 sm:pl-0 bottom-3 flex sm:static sm:inset-auto sm:ml-6 ml-3 z-40">
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
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

	.scan {
			position: absolute;
			height: 100%;
			width: 100vw;
			@media only screen and (min-width: 768px) {
					width: 30vw;
					left: 35vw;
			}
	}
	.square {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			border-radius: 16px;
			width: 200px;
			height: 200px;
			border: 6px solid white;
			box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.3);
	}

	.error {
			text-align: center;
			font-size: 40px;
			color: #ad000d;
			position: absolute;
			top: 30%;
			width: 100vw;
			@media only screen and (min-width: 768px) {
					width: 30vw;
			}
	}
</style>
