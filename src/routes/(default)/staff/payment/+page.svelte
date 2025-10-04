<script>
	import PaymentTable from '$lib/components/staff/payment/PaymentTable.svelte';
</script>

<main class="ingenium-container relative" id="main-content">
	<div class="flex flex-col md:flex-row">
		<h1>Payments</h1>
		<h2 class="ml-auto"><a href="payment/orders">Order Tracking</a></h2>
	</div>

	<PaymentTable></PaymentTable>
</main>