<script lang="ts">

import OnkostenNotaTable from '$lib/components/staff/onkosten/OnkostenNotaTable.svelte';
</script>

<main class="ingenium-container relative" id="main-content">
	<h1>Quaestor Pagina</h1>

	<section class="ingenium-form-card mt-4">
		<h2>Instellingen</h2>
		<p>TODO, Links instellingen, rechts "op deze pagina" overzicht</p>
	</section>

	<section class="ingenium-form-card mt-4">
		<OnkostenNotaTable baseQueryParam={new URLSearchParams({ limit: '20', offset:'0' })}></OnkostenNotaTable>
	</section>
</main>