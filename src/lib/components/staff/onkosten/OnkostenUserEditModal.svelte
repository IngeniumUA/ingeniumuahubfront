<script lang="ts">
	// ---------------------------------------------------------------------------------------------
	// Member-facing edit modal for a REJECTED onkostennota.
	// Suggested location: next to the admin modal, e.g. OnkostenEditUserModal.svelte
	//
	// The member can:
	//   - change description + price of every kost row (the boekhoudpost is shown, not editable)
	//   - remove existing receipts and upload new ones
	//   - read the admin's note (not editable)
	// Saving applies the media changes first, then PUTs the nota with RESUBMIT_STATUS.
	// ---------------------------------------------------------------------------------------------
	import { untrack } from 'svelte';
	import { OnkostenNotaEnum, type OnkostenNotaWideI } from '$lib/models/onkosten/onkostennota';
	import { CoreOnkostenNotaAPI } from '$lib/core_api/onkostennota_api';
	import {
		BOEKHOUDPOSTEN, formatEuro, formatIban,
		formatVolgnummer,
		GEEN_BOEKHOUDPOST, isoToBE,
		onkostenIdentifier
	} from '$lib/utilities/onkosten-utils';
	import { makePretty } from '$lib/utilities/style-utilities';

	let {
		isOpen = $bindable(false),
		nota,
		refresh
	}: {
		isOpen?: boolean;
		nota: OnkostenNotaWideI;
		refresh: () => void;
	} = $props();

	// A resubmitted nota should leave the rejected state so the admin sees it again.
	const RESUBMIT_STATUS = OnkostenNotaEnum.in_afwachting;

	type Row = { key: number; id: number; description: string; price: number | null; boekhoudpost: number };
	type Receipt = {
		key: string; // stable id for the keyed {#each}
		filename: string | null; // server filename; null for a file that has not been uploaded yet
		file: File | null; // the new file (only when filename === null)
		state: 'loading' | 'ok' | 'error';
		url: string | null;
	};

	const BOEKHOUDPOST_LABELS = new Map(BOEKHOUDPOSTEN.map((p) => [p.code, p.label]));
	const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

	// --- State ---
	let saved = $state.raw<OnkostenNotaWideI | null>(null); // the nota as last returned by a PUT
	const current = $derived(saved ?? nota);
	const identifier = $derived(identifierOf(current));
	// Only a rejected nota can be edited by the member.
	const editable = $derived(current.onkostennota_status !== OnkostenNotaEnum.afgewerkt);

	let rows = $state<Row[]>([]);
	let initialRows = '';
	let receipts = $state.raw<Receipt[]>([]);
	let removed = $state.raw<string[]>([]); // server filenames the member removed (deleted on save)
	let newKeyCounter = 0;
	let loadToken = 0; // bumped on every (re)load so late responses of an older nota are dropped

	const totalEuro = $derived(rows.reduce((sum, r) => sum + (r.price ?? 0), 0));
	const receiptsLoading = $derived(receipts.some((r) => r.state === 'loading'));
	const dirty = $derived(
		editable &&
		(JSON.stringify(rows) !== initialRows || removed.length > 0 || receipts.some((r) => r.filename === null))
	);

	let dialog = $state<HTMLDialogElement>();
	let busy = $state(false);
	let busyLabel = $state('');
	let problems = $state<string[]>([]);
	let info = $state('');

	// --- Opening and closing: the dialog follows `isOpen`; every opening starts from the `nota` prop ---
	$effect(() => {
		const d = dialog;
		if (!d) return;
		if (isOpen) {
			untrack(() => {
				if (d.open) return;
				init(nota);
				d.showModal();
			});
		} else {
			untrack(() => {
				if (d.open) d.close();
				releaseMedia();
			});
		}
	});

	// Free the object URLs when the component goes away.
	$effect(() => revokeMediaUrls);

	function identifierOf(n: OnkostenNotaWideI): string {
		return onkostenIdentifier(n.volgnummer, n.billing_information.given_name, n.billing_information.family_name);
	}

	function toRows(n: OnkostenNotaWideI): Row[] {
		return (n.kosten ?? []).map((k, i) => ({
			key: i,
			id: k.id,
			description: k.description ?? '',
			price: Number(k.price_eu), // Decimal: may arrive as a string
			boekhoudpost: k.boekhoudpost ?? GEEN_BOEKHOUDPOST
		}));
	}

	function describeError(err: unknown): string {
		if (typeof err === 'string') return err;
		if (err instanceof Error) return err.message;
		return 'Er ging iets mis. Probeer het opnieuw.';
	}

	/** Puts a nota into the form. Called every time the modal opens. */
	function init(n: OnkostenNotaWideI) {
		releaseMedia();
		saved = null;
		rows = toRows(n);
		initialRows = JSON.stringify(rows);
		removed = [];
		problems = [];
		info = '';
		loadMedia(n);
	}

	// --- Media: fetched through the API (bearer token), shown as object URLs ---
	function revokeMediaUrls() {
		for (const r of receipts) if (r.url) URL.revokeObjectURL(r.url);
	}

	function releaseMedia() {
		loadToken++;
		revokeMediaUrls();
		receipts = [];
	}

	/** media_url_list entries may be plain filenames or objects with a `name`. */
	function mediaName(entry: unknown): string {
		return typeof entry === 'string' ? entry : String((entry as { name: string }).name);
	}

	async function fetchReceipt(id: string, filename: string): Promise<Receipt> {
		try {
			const blob = await CoreOnkostenNotaAPI.fetchMedia(null, current.volgnummer, filename);
			return { key: `srv-${filename}`, filename, file: null, state: 'ok', url: URL.createObjectURL(blob) };
		} catch (err) {
			console.error(err);
			return { key: `srv-${filename}`, filename, file: null, state: 'error', url: null };
		}
	}

	async function loadMedia(n: OnkostenNotaWideI) {
		const token = ++loadToken;
		const id = identifierOf(n);
		const names = (n.media_url_list ?? []).map(mediaName);

		// Put placeholders in the list first, so each finished fetch has something to replace.
		receipts = names.map((filename) => ({
			key: `srv-${filename}`,
			filename,
			file: null,
			state: 'loading' as const,
			url: null
		}));

		await Promise.all(
			names.map(async (filename) => {
				const item = await fetchReceipt(id, filename);
				if (token !== loadToken) {
					if (item.url) URL.revokeObjectURL(item.url);
					return;
				}
				receipts = receipts.map((r) => (r.filename === filename ? item : r));
			})
		);
	}

	async function retryReceipt(item: Receipt) {
		if (!item.filename) return;
		const token = loadToken;
		receipts = receipts.map((r) => (r.key === item.key ? { ...r, state: 'loading' } : r));
		const fresh = await fetchReceipt(identifier, item.filename);
		if (token !== loadToken) {
			if (fresh.url) URL.revokeObjectURL(fresh.url);
			return;
		}
		receipts = receipts.map((r) => (r.key === item.key ? fresh : r));
	}

	// --- Receipts: remove / add (staged locally, applied on save) ---
	function removeReceipt(item: Receipt) {
		if (busy) return;
		if (item.url) URL.revokeObjectURL(item.url);
		if (item.filename) removed = [...removed, item.filename];
		receipts = receipts.filter((r) => r.key !== item.key);
	}

	function onReceiptFiles(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const files = Array.from(input.files ?? []);
		input.value = '';
		const rejected: string[] = [];
		const added: Receipt[] = [];
		for (const file of files) {
			if (!file.type.startsWith('image/')) {
				rejected.push(`${file.name}: enkel afbeeldingen (PNG/JPG) zijn toegestaan.`);
			} else if (file.size > MAX_IMAGE_BYTES) {
				rejected.push(`${file.name}: bestand is te groot (max. 15 MB).`);
			} else {
				added.push({
					key: `new-${newKeyCounter++}`,
					filename: null,
					file,
					state: 'ok',
					url: URL.createObjectURL(file)
				});
			}
		}
		receipts = [...receipts, ...added];
		problems = rejected;
	}

	// --- Validation ---
	function validate(): string[] {
		const out: string[] = [];
		if (rows.length === 0) out.push('Er is minstens één aankoop nodig.');
		rows.forEach((r, i) => {
			const n = i + 1;
			if (!r.description.trim()) out.push(`Aankoop ${n}: beschrijving ontbreekt.`);
			if (r.price === null || !(r.price > 0)) out.push(`Aankoop ${n}: prijs moet groter dan 0 zijn.`);
		});
		if (receiptsLoading) out.push('De bonnen worden nog geladen.');
		else if (receipts.some((r) => r.state === 'error')) {
			out.push('Niet alle bonnen konden geladen worden. Laad ze eerst opnieuw of verwijder ze.');
		}
		return out;
	}

	/** The body of the PUT: the whole nota with the member's changes. Boekhoudpost is passed through untouched. */
	function buildNota(status: typeof current.onkostennota_status): OnkostenNotaWideI {
		return {
			...current,
			onkostennota_status: status,
			kosten: rows.map((r) => ({
				id: r.id,
				onkostennota_volgnummer: current.volgnummer,
				description: r.description.trim(),
				price_eu: Number((r.price ?? 0).toFixed(2)),
				boekhoudpost: r.boekhoudpost
			}))
		};
	}

	async function run(label: string, task: () => Promise<void>) {
		problems = [];
		info = '';
		busy = true;
		busyLabel = label;
		try {
			await task();
		} catch (err) {
			console.error(err);
			problems = [describeError(err)];
		} finally {
			busy = false;
			busyLabel = '';
		}
	}

	/**
	 * Applies the staged receipt changes. Each step is removed from the staged state as soon as it
	 * succeeded, so a retry after a failure only repeats what is still open.
	 */
	async function syncMedia() {
		for (const filename of [...removed]) {
			busyLabel = 'Bon verwijderen…';
			await CoreOnkostenNotaAPI.deleteMedia(null, current.volgnummer, filename);
			removed = removed.filter((f) => f !== filename);
		}
		for (const item of receipts.filter((r) => r.file)) {
			busyLabel = 'Bon uploaden…';
			await CoreOnkostenNotaAPI.uploadMedia(null, current.volgnummer, item.file!, item.filename ?? "file");
			// Uploaded: from now on it is a server file, so a retry does not upload it twice.
			receipts = receipts.map((r) =>
				r.key === item.key ? { ...r, filename: item.file!.name, file: null } : r
			);
		}
	}

	async function submit(resubmit: boolean) {
		const found = validate();
		if (found.length) {
			problems = found;
			return;
		}
		await run('Opslaan…', async () => {
			await syncMedia();
			busyLabel = resubmit ? 'Indienen…' : 'Opslaan…';
			const updated = await CoreOnkostenNotaAPI.putOnkostennota(
				null,
				current.volgnummer,
				buildNota(resubmit ? RESUBMIT_STATUS : current.onkostennota_status)
			);
			saved = updated;
			rows = toRows(updated);
			initialRows = JSON.stringify(rows);
			removed = [];
			// Reload the receipts from the server so the list matches what is stored.
			releaseMedia();
			loadMedia(updated);
			info = resubmit ? 'Onkostennota opnieuw ingediend.' : 'Wijzigingen opgeslagen.';
			refresh();
		});
	}

	function requestClose() {
		if (busy) return;
		if (dirty && !confirm('Je hebt niet-opgeslagen wijzigingen. Toch sluiten?')) return;
		isOpen = false; // the effect above closes the dialog
	}

	function statusToColor(status: OnkostenNotaEnum) {
		switch (status) {
			case OnkostenNotaEnum.in_afwachting: return 'orange';
			case OnkostenNotaEnum.afgewerkt: return 'green';
			case OnkostenNotaEnum.afgewezen: return 'red';
		}
	}
</script>

<dialog
	bind:this={dialog}
	class="onkosten-modal"
	aria-labelledby="onkosten-edit-title"
	oncancel={(e) => {
		e.preventDefault(); // ESC goes through requestClose so unsaved edits are not lost silently
		requestClose();
	}}
	onclose={() => (isOpen = false)}
>
	<header class="modal-head">
		<div>
			<h2 id="onkosten-edit-title">Onkostennota {formatVolgnummer(current.volgnummer)}</h2>
			<p class="sub">
				{current.billing_information.given_name}
				{current.billing_information.family_name}
			</p>
		</div>
		<div class="head-right">
			<span class="rounded-lg py-1 px-2 {statusToColor(current.onkostennota_status)}">{makePretty(OnkostenNotaEnum[current.onkostennota_status])}</span>
			<button type="button" class="btn btn-outline" disabled={busy} onclick={requestClose}>Sluiten</button>
		</div>
	</header>

	<div class="modal-body">
		{#if problems.length}
			<div class="banner error" role="alert">
				{#each problems as p}<div>{p}</div>{/each}
			</div>
		{/if}
		{#if info}
			<div class="banner success" role="status">{info}</div>
		{/if}

		{#if current.note}
			<div class="banner note" role="note">
				<strong>Opmerking van de quaestor</strong>
				<p>{current.note}</p>
			</div>
		{/if}

		{#if !editable}
			<div class="banner warn">Deze onkostennota kan enkel aangepast worden wanneer ze afgewezen is.</div>
		{/if}

		<section>
			<h3>Gegevens</h3>
			<dl class="facts">
				<div><dt>E-mail</dt><dd>{current.user_email}</dd></div>
				<div><dt>IBAN</dt><dd>{formatIban(current.billing_information.iban)}</dd></div>
				<div><dt>Datum gemaakte kosten</dt><dd>{isoToBE(current.datum_gemaakte_kosten)}</dd></div>
			</dl>
		</section>

		<section>
			<h3>Aankopen</h3>
			<div class="rows-head"><span>Boekhoudpost</span><span>Beschrijving</span><span>Prijs (€)</span></div>
			{#each rows as row, i (row.key)}
				<div class="row">
					<div class="post" aria-label="Boekhoudpost aankoop {i + 1}">
						{#if row.boekhoudpost === GEEN_BOEKHOUDPOST}
							<span class="muted">Nog niet toegewezen</span>
						{:else}
							{row.boekhoudpost} — {BOEKHOUDPOST_LABELS.get(row.boekhoudpost) ?? ''}
						{/if}
					</div>
					<input
						type="text"
						aria-label="Beschrijving aankoop {i + 1}"
						bind:value={row.description}
						disabled={!editable || busy}
					/>
					<input
						type="number"
						step="0.01"
						min="0"
						aria-label="Prijs aankoop {i + 1}"
						bind:value={row.price}
						disabled={!editable || busy}
					/>
				</div>
			{/each}
			<div class="total"><span>Totaalbedrag:</span><span>{formatEuro(totalEuro)}</span></div>
		</section>

		<section>
			<h3>Bonnen <span class="muted">({receipts.length})</span></h3>
			{#if receipts.length === 0}
				<p class="muted">Geen bonnen.</p>
			{/if}
			<div class="thumbs">
				{#each receipts as item, i (item.key)}
					<div class="thumb">
						{#if item.state === 'ok' && item.url}
							<a href={item.url} target="_blank" rel="noopener" title="Open in nieuw tabblad">
								<img src={item.url} alt="Bon {i + 1}" />
							</a>
							{#if item.file}<span class="tag-new">Nieuw</span>{/if}
						{:else if item.state === 'loading'}
							<span class="muted">Laden…</span>
						{:else}
							<div class="thumb-error">
								<span>Kon bon {i + 1} niet laden</span>
								<button type="button" class="btn btn-outline small" onclick={() => retryReceipt(item)}>
									Opnieuw
								</button>
							</div>
						{/if}
						{#if editable}
							<button
								type="button"
								class="thumb-remove"
								title="Bon verwijderen"
								aria-label="Bon {i + 1} verwijderen"
								disabled={busy}
								onclick={() => removeReceipt(item)}>×</button
							>
						{/if}
					</div>
				{/each}
			</div>
			{#if editable}
				<label class="upload">
					Bon(nen) toevoegen (PNG/JPG)
					<input type="file" accept="image/*" multiple disabled={busy} onchange={onReceiptFiles} />
				</label>
				{#if removed.length}
					<p class="muted">{removed.length} bon(nen) worden verwijderd bij het opslaan.</p>
				{/if}
			{/if}
		</section>
	</div>

	<footer class="modal-foot">
		{#if editable}
			<button type="button" class="btn btn-outline" disabled={busy || !dirty} onclick={() => submit(false)}>
				{busy && busyLabel !== 'Indienen…' ? busyLabel : 'Opslaan'}
			</button>
			<button type="button" class="btn btn-success" disabled={busy || receiptsLoading} onclick={() => submit(true)}>
				{busy && busyLabel === 'Indienen…' ? busyLabel : 'Opnieuw indienen'}
			</button>
		{/if}
	</footer>
</dialog>

<style>
    .onkosten-modal {
        --ing-dark: #0a1931;
        --ing-blue: #1c2b78;
        --ing-light: #e2e8f0;
        --text-main: #1e293b;
        --text-muted: #64748b;
        --danger: #ef4444;
        --success: #10b981;

        width: min(960px, 96vw);
        max-height: 92vh;
        padding: 0;
        border: 0;
        border-radius: 12px;
        box-shadow: 0 20px 50px rgba(10, 25, 49, 0.35);
        font-family: 'Inter', sans-serif;
        color: var(--text-main);
        overflow: hidden;
    }
    .onkosten-modal[open] {
        display: flex;
        flex-direction: column;
    }
    .onkosten-modal::backdrop {
        background: rgba(10, 25, 49, 0.55);
    }

    .modal-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 1.1rem 1.5rem;
        background: linear-gradient(135deg, var(--ing-dark) 0%, var(--ing-blue) 100%);
        color: white;
    }
    .modal-head h2 {
        margin: 0;
        font-size: 1.25rem;
        color: white;
    }
    .sub {
        margin: 0.1rem 0 0;
        opacity: 0.85;
        font-size: 0.9rem;
        color: white;
    }
    .head-right {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .modal-body {
        padding: 1.25rem 1.5rem;
        overflow-y: auto;
        flex: 1;
    }
    .modal-foot {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        padding: 0.9rem 1.5rem;
        border-top: 1px solid var(--ing-light);
        background: #f8fafc;
    }

    section {
        margin-bottom: 1.5rem;
    }
    h3 {
        margin: 0 0 0.75rem;
        padding-bottom: 0.4rem;
        font-size: 1rem;
        color: var(--ing-blue);
        border-bottom: 2px solid var(--ing-light);
    }
    .muted {
        color: var(--text-muted);
        font-weight: 400;
        font-size: 0.88rem;
    }

    .facts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.75rem 1.5rem;
        margin: 0;
    }
    .facts dt {
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-muted);
    }
    .facts dd {
        margin: 0;
        font-size: 0.95rem;
    }

    .rows-head,
    .row {
        display: grid;
        grid-template-columns: minmax(0, 2.2fr) minmax(0, 2.4fr) minmax(0, 1fr);
        gap: 0.75rem;
        align-items: center;
    }
    .rows-head {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted);
        margin-bottom: 0.35rem;
    }
    .row {
        margin-bottom: 0.6rem;
    }
    .post {
        font-size: 0.88rem;
        color: var(--text-muted);
        overflow-wrap: anywhere;
    }
    @media (max-width: 720px) {
        .rows-head {
            display: none;
        }
        .row {
            grid-template-columns: 1fr;
            padding: 0.6rem;
            border: 1px solid var(--ing-light);
            border-radius: 6px;
        }
    }
    .total {
        display: flex;
        justify-content: flex-end;
        gap: 1.5rem;
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 2px solid var(--ing-light);
        font-size: 1.1rem;
        font-weight: 700;
    }

    input[type='text'],
    input[type='number'] {
        box-sizing: border-box;
        width: 100%;
        padding: 0.55rem 0.75rem;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font: inherit;
        font-size: 0.92rem;
        background: white;
    }
    input:focus {
        outline: none;
        border-color: var(--ing-blue);
        box-shadow: 0 0 0 3px rgba(28, 43, 120, 0.15);
    }
    input:disabled {
        background: #f1f5f9;
        color: var(--text-muted);
    }

    .thumbs {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 0.9rem;
    }
    .thumb {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 3 / 4;
        border: 1px solid var(--ing-light);
        border-radius: 6px;
        background: white;
        overflow: hidden;
    }
    .thumb a {
        display: contents;
    }
    .thumb img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
    .thumb-remove {
        position: absolute;
        top: 0.3rem;
        right: 0.3rem;
        width: 1.6rem;
        height: 1.6rem;
        border: none;
        border-radius: 50%;
        background: rgba(10, 25, 49, 0.75);
        color: white;
        font-size: 1.1rem;
        line-height: 1;
        cursor: pointer;
    }
    .thumb-remove:hover:not(:disabled) {
        background: var(--danger);
    }
    .thumb-remove:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .tag-new {
        position: absolute;
        left: 0.3rem;
        bottom: 0.3rem;
        padding: 0.1rem 0.45rem;
        border-radius: 99px;
        background: var(--success);
        color: white;
        font-size: 0.7rem;
        font-weight: 600;
    }
    .thumb-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        text-align: center;
        font-size: 0.8rem;
        color: #991b1b;
    }
    .upload {
        display: block;
        margin-top: 0.9rem;
        font-size: 0.85rem;
        font-weight: 600;
    }
    .upload input {
        display: block;
        margin-top: 0.3rem;
        font-size: 0.85rem;
        font-weight: 400;
    }

    .banner {
        padding: 0.75rem 1rem;
        margin-bottom: 1rem;
        border: 1px solid;
        border-radius: 8px;
        font-size: 0.9rem;
    }
    .banner p {
        margin: 0.25rem 0 0;
        white-space: pre-wrap;
    }
    .banner.error {
        background: #fef2f2;
        border-color: #fecaca;
        color: #991b1b;
    }
    .banner.success {
        background: #ecfdf5;
        border-color: #a7f3d0;
        color: #065f46;
    }
    .banner.note {
        background: #fffbeb;
        border-color: #fde68a;
        color: #92400e;
    }
    .banner.warn {
        background: #f1f5f9;
        border-color: #cbd5e1;
        color: var(--text-main);
    }

    .badge {
        padding: 0.2rem 0.65rem;
        border-radius: 99px;
        font-size: 0.75rem;
        font-weight: 600;
        background: #e2e8f0;
        color: #334155;
    }
    .badge.rejected {
        background: #fee2e2;
        color: #991b1b;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        padding: 0.6rem 1.15rem;
        border: none;
        border-radius: 6px;
        font: inherit;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s;
    }
    .btn.small {
        padding: 0.3rem 0.65rem;
        font-size: 0.78rem;
    }
    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .btn-success {
        background: var(--success);
        color: white;
    }
    .btn-success:hover:not(:disabled) {
        background: #059669;
    }
    .btn-outline {
        background: white;
        border: 1px solid var(--ing-blue);
        color: var(--ing-blue);
    }
    .btn-outline:hover:not(:disabled) {
        background: #f1f5f9;
    }
    .modal-head .btn-outline {
        background: rgba(255, 255, 255, 0.14);
        border-color: rgba(255, 255, 255, 0.4);
        color: white;
    }

    .red {@apply border-red-700 text-red-700 bg-red-100;}
    .orange {@apply  border-orange-700 text-orange-700 bg-orange-100;}
    .green {@apply  border-green-700 text-green-700 bg-green-100;}
    .gray {@apply  border-gray-700 text-gray-700 bg-gray-100;}
</style>