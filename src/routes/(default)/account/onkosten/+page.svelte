<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { OnkostenNotaEnum, type OnkostenNotaI, type OnkostenNotaWideI } from '$lib/models/onkosten/onkostennota';
	import { formatEuro, formatVolgnummer, isoToBE } from '$lib/utilities/onkosten-utils';
	import OnkostenUserEditModal from '$lib/components/staff/onkosten/OnkostenUserEditModal.svelte';
	import { CoreOnkostenNotaAPI } from '$lib/core_api/onkostennota_api';

	let { data }: { data: { onkostennotas: OnkostenNotaI[] } } = $props();

	let isModalOpen = $state(false);
	// Store the volgnummer, not the object: after a save + refresh the list is replaced and the
	// modal then receives the fresh version of the same nota.
	let selectedVolgnummer = $state<number | null>(null);
	let selected: null | OnkostenNotaWideI = $state(null)

	// Newest first
	const sorted = $derived([...data.onkostennotas].sort((a, b) => b.volgnummer - a.volgnummer));

	async function open(n: OnkostenNotaI) {
		selectedVolgnummer = n.volgnummer;
		selected = await CoreOnkostenNotaAPI.getOnkostennota(null, selectedVolgnummer);
		isModalOpen = true;
	}

	function totalOf(n: OnkostenNotaI | OnkostenNotaWideI): number {
		return (n.kosten ?? []).reduce((sum, k) => sum + Number(k.price_eu), 0);
	}

	function statusOf(n: OnkostenNotaI | OnkostenNotaWideI): { label: string; cls: string } {
		switch (n.onkostennota_status) {
			case OnkostenNotaEnum.afgewerkt:
				return { label: 'Afgewerkt', cls: 'done' };
			case OnkostenNotaEnum.afgewezen:
				return { label: 'Afgewezen', cls: 'rejected' };
			default:
				return { label: 'In afwachting', cls: 'pending' };
		}
	}
</script>

<section class="h-full">
	<h1 class="white-section-title">Jouw onkosten</h1>
	<p>Op deze pagina kan je onkosten die je hebt ingediend bekijken en bewerken.</p>

	<div class="flex flex-row justify-center items-center">
		<a href="/onkosten" class="button button-primary">Nieuwe onkostennota indienen</a>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-4" aria-label="Onkostennota's">
		{#if sorted.length === 0}
			<div class="alert alert-info alert-border mb-6 col-span-1 md:col-span-2 xl:col-span-4">
				<p class="text-sm text-blue-300">Je hebt nog geen onkostennota's ingediend</p>
			</div>
		{:else}
			{#each sorted as nota (nota.volgnummer)}
				{@const status = statusOf(nota)}
				<article class="onkosten-card">
					<dl>
						<dt>Onkostennota</dt>
						<dd>{formatVolgnummer(nota.volgnummer)}</dd>

						<dt>Datum gemaakte kosten</dt>
						<dd>{isoToBE(nota.datum_gemaakte_kosten)}</dd>

						<dt>Aantal aankopen</dt>
						<dd>{nota.kosten?.length ?? 0}</dd>

						<dt>Totaalbedrag</dt>
						<dd>{formatEuro(totalOf(nota))}</dd>

						<dt>Status</dt>
						<dd><span class="status {status.cls}">{status.label}</span></dd>
					</dl>

					{#if nota.onkostennota_status === OnkostenNotaEnum.afgewezen && nota.note}
						<p class="note">Opmerking: {nota.note}</p>
					{/if}

					<button
						type="button"
						class="button button-outline-blue button-sm button-full"
						onclick={() => open(nota)}
					>
						{nota.onkostennota_status === OnkostenNotaEnum.afgewezen ? 'Bewerken' : 'Bekijken'}
					</button>
				</article>
			{/each}
		{/if}
	</div>
</section>

{#if selected}
	<OnkostenUserEditModal bind:isOpen={isModalOpen} nota={selected} refresh={() => invalidateAll()} />
{/if}

<style lang="scss">
  .onkosten-card {
    @apply border rounded p-4;

    dl {
      @apply mb-4;

      dt {
        @apply mt-4 text-gray-500 text-xs;

        &:first-child {
          @apply mt-0;
        }
      }

      dd {
        @apply mt-1 text-gray-900 text-sm;
      }
    }

    .note {
      @apply mb-4 text-xs text-red-700;
    }

    .status {
      @apply inline-block rounded-full px-2 py-0.5 text-xs font-semibold;

      &.done {
        @apply bg-green-100 text-green-800;
      }
      &.rejected {
        @apply bg-red-100 text-red-800;
      }
      &.pending {
        @apply bg-yellow-100 text-yellow-800;
      }
    }
  }
</style>