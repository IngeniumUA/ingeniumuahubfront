<script lang="ts">
	import DashboardIframe from '$lib/components/dashboard_iframe/dashboard_iframe.svelte';
	import { getTokens } from '$lib/auth/auth';

	const access_token = getTokens(null).access_token;
</script>

{#if access_token !== null && access_token !== undefined}
	<DashboardIframe token="{access_token}" path=""></DashboardIframe>
{/if}