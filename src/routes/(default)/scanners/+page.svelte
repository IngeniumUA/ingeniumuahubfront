<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import { GetEventsService } from '$lib/scanners/get-events.ts';
	import { goto } from '$app/navigation';

	function gotoScanner(scannerPath: string) {
		const eventService = new GetEventsService()
		eventService.getEvents().then(()=>{
			goto(scannerPath)
		})
	}
</script>

<svelte:head>
	<title>Ticket Scanner</title>
</svelte:head>

<header>
	<Header whiteTheme={true} />
</header>

<main class="ingenium-container" id="main-content">
	<div class="flex flex-col items-center">
		<h1>Scanners:</h1>
		<button on:click={()=>{gotoScanner("/scanners/tickets")}} role="menuitem" class="button button-primary button-sm my-4">Ticket scanner</button>
<!--		<button on:click={()=>{gotoScanner("/scanners/aanwezigheid")}} role="menuitem" class="button button-primary button-sm my-4">Aanwezigheid scanner</button>-->
	</div>
</main>
