<script lang="ts">
	import { GetQrDataService, type QrData } from '$lib/scanners/get-qr-data.ts';
	import { onMount } from 'svelte';
	import { scannedQr } from '$lib/scanners/get-qr-data.ts';
	import { eventDict, selectedEvent } from '$lib/scanners/get-events.ts';
	import { base } from '$app/paths';
	import { afterNavigate, goto } from '$app/navigation';
	import { blueprintsDict } from '$lib/scanners/blueprints.ts';
	import { NativeAudio } from '@capgo/native-audio';
	import { TransactionPatcherService } from '$lib/scanners/transaction-patcher.ts';
	import { CheckUserService } from '$lib/scanners/check-user.ts';
	import { disableSound, doAutoReturn, returnTime } from '$lib/scanners/storage.ts';
	import Modal from '$lib/components/layout/modal.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { App } from '@capacitor/app';

	let notesToast: number;

	let isMoreModalOpen = $state(false);
	let isMoreModalEnabled = $state(false)
	let moreModalTitle = $state('');
	let isUserModalOpen = $state(false);
	let userModalTitle = $state('');

	let previousPage : string = base ;

	afterNavigate(({from}) => {
		previousPage = from?.url.pathname || previousPage
	})

	let UserEmail: string = $state("")
	let UserLidstatus: string = $state("")
	let UserGeldigheid: string = $state("")
	let UserStatus: string = $state("")
	let UserItem: string = $state("")
	let UserId: string = $state("")
	let UserNotes: string = ""
	let UserBlueprint: string = $state("")
	let UserPolicyName: string = $state("")

	let savedResult: QrData | undefined = undefined

	let imgPath: string = $state("/sync.png")

	let code: string = ""

	let selectedValidity: string = $state("")
	let inputEmail: string = $state("")
	let showError:boolean = $state(false)
	let errorText: string = $state("")

	const QrService = new GetQrDataService();
	const patcher = new TransactionPatcherService();
	const userChecker = new CheckUserService()

	onMount(()=>{
		const removeListener = App.addListener('backButton', () => {
			if (UserGeldigheid!=='invalid') {
				history.back()
			}
		})

		startup()

		return () => {
			removeListener.then((rm) => rm.remove()); // Cleanup
		};
	})

	function startup() {
		code = scannedQr
		QrService.getQrData(eventDict[selectedEvent], code).then((result) => {
			if (typeof result === "string") {
				if (result === "server_error") {
					goto('/')
				} else if (result === "no_event") {
					Back()
				} else {
					loadElements(false)
				}
			} else {
				savedResult = result
				loadElements(true, result.validity, result).then()
			}
		})
	}

	async function sleep(ms: number): Promise<void> {
		return new Promise(
			(resolve) => setTimeout(resolve, ms));
	}

	async function loadElements(Succeeded: boolean, validity: string = "", result: QrData | undefined = undefined, runAutoValidate: boolean = true) {
		if (Succeeded) {
			isMoreModalEnabled = true
			if (typeof result !== "undefined") {
				UserEmail = result.email
				UserLidstatus = result.lidStatus
				UserGeldigheid = result.validity
				UserStatus = result.checkoutStatus
				UserItem = result.productString
				UserId = result.id
				UserNotes = result.notes
				UserBlueprint = result.blueprintName
				UserPolicyName = result.pricePolicyName
				if (UserItem.length)

					if (blueprintsDict[selectedEvent] !== undefined) {
						if (!blueprintsDict[selectedEvent][UserBlueprint]) {
							validity = "consumed"
							UserGeldigheid = "consumed"
							if (UserNotes === "") {
								UserNotes = "Product blueprint in blacklist"
							} else {
								UserNotes = UserNotes + ", Product blueprint in blacklist"
							}
						}
					}

				if (UserNotes !== "") {showToast().then();}
			}
			if (validity === "valid") {
				imgPath = "/checkmark.png"
				if (runAutoValidate) {
					AutoValidate(UserId)
					if (!disableSound) {await playAudio("oneBeep")}
				}
				if (doAutoReturn) {
					await sleep(returnTime*1000)
					Back()
				}
			} else if (validity === "invalid") {
				imgPath = "/dashmark.png"
				if (!disableSound) {await playAudio("twoBeep")}
			} else {
				imgPath = "/xmark.png"
				if (!disableSound) {await playAudio("longBeep")}
			}

		} else {
			imgPath = "/xmark.png"
			isMoreModalEnabled = false
		}
	}

	async function playAudio(soundId: string) {
		try {
			await NativeAudio.play({
				assetId: soundId
			})
		} catch (e) {
			console.log(e)
		}
	}

	async function showToast() {
		notesToast = toast.push(UserNotes);
	}

	function Back() {
		if (window.location.pathname.includes("result")) {
			toast.pop(notesToast)
			goto(previousPage)
		}
	}

	function ReturnToHome() {
		if (toast !== null) {toast.pop(notesToast)}
		goto('/')
	}

	async function OpenMoreModal(e: Event) {
		e.preventDefault();

		moreModalTitle = `Meer info`;
		isMoreModalOpen = true;
	}

	function closeMoreModal() {
		isMoreModalOpen = false
	}

	async function OpenUserChangeModal(e: Event) {
		e.preventDefault();

		userModalTitle = `Meer info`;
		isUserModalOpen = true;
	}

	function closeUserChangeModal() {
		isUserModalOpen = false;
	}

	async function onFormSubmit(e: any) {
		e.preventDefault();
		UpdateValidity()
	}
	function UpdateValidity() {
		if (typeof selectedValidity !== "undefined") {
			patcher.PatchTransaction(+UserId, selectedValidity)
				.then((result) => {
					if (result === "server_error") {
						goto('/')
					} else {
						loadElements(true, selectedValidity, savedResult, false).then()
						UserGeldigheid = selectedValidity
						closeMoreModal()
					}
				})
		}
	}

	function AutoValidate(interactionID: string) {
		patcher.PatchTransaction(+interactionID, "consumed")
			.then((result) => {
				if (result === "server_error") {
					goto('/')
				} else {
					UserGeldigheid = "consumed"
				}
			})
	}

	function UpdateUser() {
		showError = false
		if (inputEmail !== "") {
			userChecker.checkUser(inputEmail.toLowerCase()).then((result) => {
				if (result === "user_not_found") {
					showError = true
					errorText = "Dit email adres werd niet gevonden"
				} else if (result === "server error") {
					goto('/')
				} else {
					if (result["lid"]) {
						patcher.PatchTransaction(+UserId, "valid", inputEmail.toLowerCase()).then(() => {
							startup()
						})
					} else {
						patcher.PatchTransaction(+UserId, "invalid", inputEmail.toLowerCase()).then(() => {
							startup()
						})
					}
				}
			})
			closeUserChangeModal()
		} else {
			showError = true
			errorText = "Geef een email adres op"
		}
	}

	function InvalidValidate() {
		patcher.PatchTransaction(+UserId, "consumed")
			.then((result) => {
				if (result === "server_error") {
					goto('/')
				} else {
					UserGeldigheid = "consumed"
					imgPath = "/checkmark.png"
					closeMoreModal()
					if (doAutoReturn) {
						sleep(returnTime*1000)
						Back()
					}
				}
			})
	}
</script>

<svelte:head>
	<title>Ticket Scanner</title>
</svelte:head>

<Modal title={ moreModalTitle } bind:isOpen={ isMoreModalOpen }>
	{#snippet children()}
		<div class="p-2">
			<div class="form-field" style="padding: 10px;">
				<div class="sameline">
					<p>Email:</p>
					<div class="right">
						<p>{UserEmail}</p>
					</div>
				</div>
				<div class="sameline">
					<p>Lidstatus:</p>
					<div class="right">
						<p>{UserLidstatus}</p>
					</div>
				</div>
				<div class="sameline">
					<p>Status:</p>
					<div class="right">
						<p>{UserStatus}</p>
					</div>
				</div>
				<div class="sameline">
					<p>Item en product:</p>
					<div class="right">
						<p>{UserItem}</p>
					</div>
				</div>
				<div class="sameline">
					<p>Geldigheid</p>
					<div class="right">
						<p>{UserGeldigheid}</p>
					</div>
				</div>
				<div class="sameline">
					<p>ID:</p>
					<div class="right">
						<p>{UserId}</p>
					</div>
				</div>
				<div class="sameline">
					<p>Blueprint:</p>
					<div class="right">
						<p>{UserBlueprint}</p>
					</div>
				</div>
			</div>
			<form target="#" onsubmit={ (e) => onFormSubmit(e) } class="mt-6 w-full space-y-6">
				<fieldset>
					<legend class="sr-only">School gegevens</legend>

					<div class="form-field col-span-4">
						<label for="validity">Geldigheid</label>
						<select id="validity" bind:value={ selectedValidity }>
							<option value="valid">valid</option>
							<option value="invalid">invalid</option>
							<option value="consumed">consumed</option>
						</select>
					</div>
				</fieldset>
				<div class="form-field text-right">
					<button type="submit" class="button button-danger">Update</button>
				</div>
			</form>
		</div>
	{/snippet}
</Modal>

<Modal title={ userModalTitle } bind:isOpen={ isUserModalOpen }>
	{#snippet children()}
		<div class="p-2">
			<div class="resultModal">
				<fieldset>
					<div class="form-field">
						<label for="email">E-mailadres</label>
						<input id="email" type="email" bind:value={inputEmail} onchange={()=>{UpdateUser()}} />
					</div>
				</fieldset>
				{#if showError}
					<p style="font-size:14px; color:darkred">{errorText}</p>
				{/if}
			</div>
		</div>
	{/snippet}
</Modal>

<main class="ingenium-container" id="main-content">

	<div class="absolute inset-y-0 right-0 flex pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ml-3 z-30">
		<button onclick={()=>{ReturnToHome()}} title="Home"
			 class="button button-primary button-icon-only relative items-center justify-center button-accessibility-white h-10 z-50" style="margin: 1.12rem">
			<span class="hidden md:inline">Home</span>
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
			</svg>
		</button>
	</div>

	{#if UserGeldigheid!=='invalid'}
		<div class="absolute right-0 pr-2 sm:pr-0 bottom-3 flex sm:static sm:inset-auto sm:ml-6 ml-3 z-30">
			<button onclick={()=>{Back()}} title="Back"
							class="button button-primary button-icon-only relative items-center justify-center button-accessibility-white h-10 z-40" style="margin: 1.12rem">
				<span class="hidden md:inline">Terug</span>
				<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
				</svg>
			</button>
		</div>
	{/if}

	<div class="absolute inset-y-0 left-0 flex pl-2 sm:static sm:inset-auto sm:ml-6 sm:pl-0 ml-3 z-40">
		<button onclick={ (e) => OpenMoreModal(e) } disabled="{!isMoreModalEnabled}" title="More"
						class="button button-primary button-icon-only relative items-center justify-center button-accessibility-white h-10 z-50" style="margin: 1.12rem">
			<span class="hidden md:inline">More</span>
			<svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
			</svg>
		</button>
	</div>

	<div class="result">
		<div class="form-field" style="padding: 10px;">
			<div class="sameline">
				<p>Item blueprint:</p>
				<div class="right">
					<p>{UserBlueprint}</p>
				</div>
			</div>
			<div class="sameline">
				<p>Price policy:</p>
				<div class="right">
					<p>{UserPolicyName}</p>
				</div>
			</div>
		</div>

		<img src="{imgPath}" alt="Validity" style="width: 100%"/>

		{#if UserGeldigheid==='invalid'}
			<div class="flex flex-col items-center">
				<button onclick={(e)=>{OpenUserChangeModal(e)}} role="menuitem" class="button button-outline-blue button-full button-sm my-4 z-40">Pas gebruiker aan</button>
			</div>
			<div class="right-invalid">
				<div class="flex flex-col items-center">
					<button onclick={()=>{InvalidValidate()}} role="menuitem" class="button button-outline-blue button-full button-sm my-4 z-50">Valideer</button>
				</div>
			</div>
			<div class="left-invalid">
				<div class="flex flex-col items-center">
					<button onclick={()=>{Back()}} role="menuitem" class="button button-danger button-full button-sm my-4 z-50">Annuleer</button>
				</div>
			</div>
		{/if}
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

  .result {
    position: absolute;
    top: 15%;
    width: 100vw;
    @media only screen and (min-width: 768px) {
      width: 30vw;
      left: 35vw;
    }
  }

  .sameline {
    display: flex;
  }

  .right {
    position: absolute;
    right: 10px;
  }

  .right-invalid {
    position: absolute;
    width: 50%;
    right: 0;
  }

  .left-invalid {
    position: absolute;
    width: 50%;
    left: 0;
  }
</style>