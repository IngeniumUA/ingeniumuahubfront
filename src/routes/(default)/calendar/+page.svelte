<script>
import Header from '$lib/components/layout/header.svelte';
</script>
<svelte:head>
	<title>Calendar | Ingenium UA</title>
</svelte:head>

<header>
	<Header whiteTheme={true} />
</header>

<main class="relative" id="main-content">
	<div class="flex justify-center py-4 lg:p-4">
		<div class="w-full max-w-6xl aspect-[4/3]">
			<iframe
				title="GoogleCalendar"
				src="https://calendar.google.com/calendar/embed?src=c_46943b61844a6ea2bb79af5c7f3596058b9c8e5bab640525d29322643beac709%40group.calendar.google.com&ctz=Europe%2FBrussels"
				class="w-full h-full border-0 rounded-lg shadow-md"
				frameborder="0"
				scrolling="no"
				allowfullscreen
			></iframe>
		</div>
	</div>
</main>