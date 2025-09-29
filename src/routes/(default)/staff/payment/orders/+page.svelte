<script lang="ts">
	import OrderTable from '$lib/components/staff/payment/OrderTable.svelte';
</script>

<main class="ingenium-container relative" id="main-content">
	<h1>Trackers for Checkouts</h1>
	<OrderTable baseQueryParam={new URLSearchParams({limit: '100'})}></OrderTable>
</main>