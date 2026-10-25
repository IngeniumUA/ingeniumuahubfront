<script module lang="ts">
	// ---------------------------------------------------------------------------------------------
	// Everything that does not depend on component state lives here: identifier helpers, the list of
	// boekhoudposten and the PDF builder. The named exports can be imported from this file when the
	// table or another page needs them.
	// ---------------------------------------------------------------------------------------------
	import { PDFDocument, PDFName, PDFArray, PDFDict, StandardFonts, rgb, type PDFFont } from 'pdf-lib';
	import type { OnkostenNotaWideI } from '$lib/models/onkosten/onkostennota';

	// ---- Identifier helpers --------------------------------------------------------------------
	export function nameSlug(s: string): string {
		return s
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '')
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^A-Za-z-]/g, '')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');
	}

	/** 12 -> "O0012" */
	export function formatVolgnummer(volgnummer: number): string {
		return `O${String(volgnummer).padStart(4, '0')}`;
	}

	/** O0012_Onkostennota_Jan_Janssens: key for uploads and the PDF file name (without extension). */
	export function onkostenIdentifier(volgnummer: number, givenName: string, familyName: string): string {
		return `${formatVolgnummer(volgnummer)}_Onkostennota_${nameSlug(givenName)}_${nameSlug(familyName)}`;
	}

	/** What is printed behind the pre-printed "Volgnummer: 0" on the template: 12 -> "012". */
	export function pdfVolgnummer(volgnummer: number): string {
		return String(volgnummer).padStart(3, '0');
	}

	/** "be68539007547034" -> "BE68 5390 0754 7034" */
	export function formatIban(iban: string): string {
		return iban.replace(/\s+/g, '').toUpperCase().replace(/(.{4})/g, '$1 ').trim();
	}

	// ---- Boekhoudposten ------------------------------------------------------------------------
	// KostenI.boekhoudpost holds the code. Keep this list in sync with the backend BoekhoudpostEnum
	// (the backend stores an int enum, so a code that is missing there is rejected).
	export const GEEN_BOEKHOUDPOST = 0;

	export const BOEKHOUDPOSTEN: ReadonlyArray<{ code: number; label: string }> = [
		{ code: 600100, label: 'Activiteiten kosten' },
		{ code: 600200, label: 'Cultuur kosten' },
		{ code: 600300, label: 'Praesidium kosten' },
		{ code: 600400, label: 'Sport kosten' },
		{ code: 600500, label: 'Merchandise kosten' },
		{ code: 604000, label: 'Bedrijvenrelaties kosten' },
		{ code: 610000, label: 'Huur terreinen en gebouwen' },
		{ code: 610100, label: 'Huur installaties, machines, inrichting' },
		{ code: 613000, label: 'Kantoorkosten (printer, papier, schrijfgerei,...)' },
		{ code: 613010, label: 'Website (hosting, online diensten)' },
		{ code: 613025, label: 'Documentatie & Lidgelden (kranten, artikelen, boeken,...)' },
		{ code: 613040, label: 'Promotie (Facebook, Instagram, ...)' },
		{ code: 613050, label: 'Klein materiaal (sleutels, handdoeken, opbergdozen, ed.)' },
		{ code: 613070, label: 'Erelonen, honoraria en prestaties (boekhoudster, architect, ...)' },
		{ code: 613090, label: 'Vergoeding artiesten' },
		{ code: 614000, label: 'Verzekeringen' },
		{ code: 615000, label: 'Vervoersonkosten (leden km-vergoeding, bus, trein, tram)' }
	];

	// ---- PDF ------------------------------------------------------------------------------------
	// Fills the original Ingenium PDF template: member data, boekhoudposten, voldaan date, signature
	// and the receipts (4 per page).
	export const TEMPLATE_URL =
		'https://ingeniumuapublic.blob.core.windows.net/ingeniumuaimages/onkostennota/IngeniumUA-VZW_Template_2026-2027.pdf';

	/** The template table has room for this many rows. */
	export const MAX_TABLE_ROWS = 15;
	export const RECEIPTS_PER_PAGE = 4;

	// EXACTE GEKALIBREERDE COÖRDINATEN
	const PDF_COORDS = {
		volgnummer: { x: 525, y: 746 }, // komt achter het voorgedrukte "Volgnummer: 0"
		voornaam: { x: 140, y: 672 },
		achternaam: { x: 140, y: 657 },
		email: { x: 140, y: 642 },
		iban: { x: 140, y: 627 },
		datum: { x: 105, y: 599 },
		kmVergoeding: { x: 205, y: 584 },
		tableStartY: 512,
		tableRowStep: 16.0,
		colPostX: 60, // kolom Boekhoudpost
		colDescX: 122,
		colPriceX: 518,
		totalY: 264,
		voldaanOp: { x: 145, y: 175 },
		signature: { x: 80, y: 100, w: 165, h: 60 }
	};

	// Bonnen (max. 4 per pagina)
	const GRID_BOXES = [
		{ x: 45, y: 430, w: 235, h: 350 },
		{ x: 315, y: 430, w: 235, h: 350 },
		{ x: 45, y: 50, w: 235, h: 350 },
		{ x: 315, y: 50, w: 235, h: 350 }
	];

	let templatePdfBytes: ArrayBuffer | null = null;

	/** The template, fetched once. Throws when it cannot be loaded. */
	export async function getTemplateBytes(): Promise<ArrayBuffer> {
		if (!templatePdfBytes) {
			const res = await fetch(TEMPLATE_URL);
			if (!res.ok) throw new Error(`De PDF-template kon niet geladen worden (HTTP ${res.status}).`);
			templatePdfBytes = await res.arrayBuffer();
		}
		return templatePdfBytes;
	}

	// Verwijdert alle formulier-widgets (de blauwe vakjes) en het AcroForm-woordenboek,
	// zonder pdf-lib's form.removeField() (die kan dangling referenties achterlaten).
	function stripFormFields(pdfDoc: PDFDocument) {
		const widget = PDFName.of('Widget');
		for (const page of pdfDoc.getPages()) {
			const annots = page.node.lookupMaybe(PDFName.of('Annots'), PDFArray);
			if (!annots) continue;
			for (let i = annots.size() - 1; i >= 0; i--) {
				const annot = annots.lookupMaybe(i, PDFDict);
				if (annot && annot.get(PDFName.of('Subtype')) === widget) annots.remove(i);
			}
		}
		pdfDoc.catalog.delete(PDFName.of('AcroForm'));
	}

	const formatEuro = (n: number) => `€ ${n.toFixed(2).replace('.', ',')}`;

	/** '2026-10-01T00:00:00' -> '01/10/2026' */
	const isoToBE = (iso: string) => {
		const [yyyy, mm, dd] = iso.slice(0, 10).split('-');
		return `${dd}/${mm}/${yyyy}`;
	};

	// Helvetica (WinAnsi) throws on characters it cannot encode (emoji, newlines, ...).
	// A failing PDF after the nota is already finished would be annoying, so replace them.
	function safeText(font: PDFFont, text: string): string {
		return Array.from(text.replace(/\s+/g, ' '))
			.map((ch) => {
				try {
					font.encodeText(ch);
					return ch;
				} catch {
					return '?';
				}
			})
			.join('');
	}

	async function embedImage(pdfDoc: PDFDocument, blob: Blob) {
		const bytes = new Uint8Array(await blob.arrayBuffer());
		const isPng = bytes[0] === 0x89 && bytes[1] === 0x50; // sniff: the server's content-type is not relied on
		return isPng ? pdfDoc.embedPng(bytes) : pdfDoc.embedJpg(bytes);
	}

	export interface PdfMedia {
		receipts: Blob[];
		signature: Blob | null;
	}

	export async function buildOnkostenPdf(
		nota: OnkostenNotaWideI,
		templateBytes: ArrayBuffer,
		media: PdfMedia
	): Promise<Uint8Array> {
		const pdfDoc = await PDFDocument.load(templateBytes);
		const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

		// Verwijder blauwe vakjes (formuliervelden)
		stripFormFields(pdfDoc);

		const page1 = pdfDoc.getPages()[0];
		const color = rgb(0, 0, 0);
		const fontSize = 10;
		const text = (value: string, x: number, y: number, size = fontSize, font = fontRegular) =>
			page1.drawText(safeText(font, value), { x, y, size, font, color });

		const billing = nota.billing_information;

		text(pdfVolgnummer(nota.volgnummer), PDF_COORDS.volgnummer.x, PDF_COORDS.volgnummer.y, 12, fontBold);
		text(billing.given_name, PDF_COORDS.voornaam.x, PDF_COORDS.voornaam.y);
		text(billing.family_name, PDF_COORDS.achternaam.x, PDF_COORDS.achternaam.y);
		text(nota.user_email, PDF_COORDS.email.x, PDF_COORDS.email.y);
		text(formatIban(billing.iban), PDF_COORDS.iban.x, PDF_COORDS.iban.y);
		text(isoToBE(nota.datum_gemaakte_kosten), PDF_COORDS.datum.x, PDF_COORDS.datum.y);
		text('0.44', PDF_COORDS.kmVergoeding.x, PDF_COORDS.kmVergoeding.y);

		// Price_eu is a Decimal: the backend may send it as a string.
		const kosten = nota.kosten.map((k) => ({ ...k, price: Number(k.price_eu) }));

		kosten.slice(0, MAX_TABLE_ROWS).forEach((k, index) => {
			const yPos = PDF_COORDS.tableStartY - index * PDF_COORDS.tableRowStep;
			if (k.boekhoudpost && k.boekhoudpost !== GEEN_BOEKHOUDPOST) {
				text(String(k.boekhoudpost), PDF_COORDS.colPostX, yPos, 9.5);
			}
			text(k.description ?? '', PDF_COORDS.colDescX, yPos, 9.5);
			text(formatEuro(k.price), PDF_COORDS.colPriceX, yPos, 9.5);
		});

		const total = kosten.reduce((sum, k) => sum + k.price, 0);
		text(formatEuro(total), PDF_COORDS.colPriceX, PDF_COORDS.totalY, 10, fontBold);

		if (nota.datum_onkosten_voldaan) {
			text(isoToBE(nota.datum_onkosten_voldaan), PDF_COORDS.voldaanOp.x, PDF_COORDS.voldaanOp.y, 9.5);
		}

		if (media.signature) {
			const sig = await embedImage(pdfDoc, media.signature);
			const dims = sig.scaleToFit(PDF_COORDS.signature.w, PDF_COORDS.signature.h);
			page1.drawImage(sig, {
				x: PDF_COORDS.signature.x,
				y: PDF_COORDS.signature.y,
				width: dims.width,
				height: dims.height
			});
		}

		for (let i = 0; i < media.receipts.length; i++) {
			const pageIndex = Math.floor(i / RECEIPTS_PER_PAGE) + 1;
			const targetPage =
				pageIndex < pdfDoc.getPageCount() ? pdfDoc.getPage(pageIndex) : pdfDoc.addPage([595.28, 841.89]);
			const slot = GRID_BOXES[i % RECEIPTS_PER_PAGE];
			const image = await embedImage(pdfDoc, media.receipts[i]);
			const dims = image.scaleToFit(slot.w, slot.h);

			targetPage.drawImage(image, {
				x: slot.x + (slot.w - dims.width) / 2,
				y: slot.y + (slot.h - dims.height) / 2,
				width: dims.width,
				height: dims.height
			});
		}

		return pdfDoc.save({ updateFieldAppearances: false });
	}

	export function downloadPdf(pdfBytes: Uint8Array, fileName: string) {
		const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { OnkostenNotaEnum } from '$lib/models/onkosten/onkostennota';
	import { CoreOnkostenNotaAPI } from '$lib/core_api/onkostennota_api';

	let {
		isOpen = $bindable(false),
		nota,
		refresh
	}: {
		isOpen?: boolean;
		nota: OnkostenNotaWideI;
		refresh: () => void;
	} = $props();

	type Row = { key: number; description: string; price: number | null; boekhoudpost: number; id: number };
	type MediaItem = { filename: string; state: 'loading' | 'ok' | 'error'; blob: Blob | null; url: string | null };

	const KNOWN_CODES = new Set(BOEKHOUDPOSTEN.map((p) => p.code));
	const SIG_WIDTH = 340;
	const SIG_HEIGHT = 110;
	// The drawn signature is remembered in this browser so the quaestor does not redraw it for every nota.
	const SIG_STORAGE_KEY = 'ingenium_quaestor_signature';

	// --- State ---
	let saved = $state.raw<OnkostenNotaWideI | null>(null); // the nota as last returned by a PUT
	const current = $derived(saved ?? nota);
	const identifier = $derived(identifierOf(current));
	const readonly = $derived(current.onkostennota_status === OnkostenNotaEnum.afgewerkt);

	let rows = $state<Row[]>([]);
	let voldaan = $state(todayISO());
	let initialSnapshot = $state('');
	const totalEuro = $derived(rows.reduce((sum, r) => sum + (r.price ?? 0), 0));
	const dirty = $derived(!readonly && JSON.stringify([rows, voldaan]) !== initialSnapshot);

	let receipts = $state.raw<MediaItem[]>([]);
	let signatureMedia = $state.raw<MediaItem | null>(null);
	let signatureError = $state(false); // the stored signature could not be fetched
	let hasSignature = $state(false); // the pad holds a signature
	let signatureOnServer = false; // a signature file exists for this nota
	let signatureChanged = false; // the pad changed since it was last uploaded
	const receiptsLoading = $derived(receipts.some((r) => r.state === 'loading'));

	let dialog = $state<HTMLDialogElement>();
	let busy = $state(false);
	let busyLabel = $state('');
	let problems = $state<string[]>([]);
	let info = $state('');

	let sigCanvas: HTMLCanvasElement | null = null;
	let sigCtx = $state.raw<CanvasRenderingContext2D | null>(null);
	let sigDrawing = false;
	let shownSignatureUrl: string | null = null;
	let loadToken = 0; // bumped on every (re)load so late responses of an older nota are dropped

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

	// A signature that is already on the server replaces the remembered one as soon as it has loaded.
	$effect(() => {
		const url = signatureMedia?.url;
		if (sigCtx && url && url !== shownSignatureUrl) {
			shownSignatureUrl = url;
			drawSignatureFrom(url).then(() => (hasSignature = true));
		}
	});

	// Free the object URLs when the component goes away.
	$effect(() => revokeMediaUrls);

	function identifierOf(n: OnkostenNotaWideI): string {
		return onkostenIdentifier(n.volgnummer, n.billing_information.given_name, n.billing_information.family_name);
	}

	function todayISO() {
		const d = new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

	function snapshot(): string {
		return JSON.stringify([rows, voldaan]);
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
		voldaan = n.datum_onkosten_voldaan?.slice(0, 10) ?? todayISO();
		initialSnapshot = snapshot();
		signatureOnServer = false;
		signatureError = false;
		signatureChanged = false;
		problems = [];
		info = '';
		clearPad();
		loadRememberedSignature();
		loadMedia(n);
	}

	// --- Media: fetched through the API (bearer token), shown as object URLs ---
	function revokeMediaUrls() {
		for (const item of [...receipts, signatureMedia]) if (item?.url) URL.revokeObjectURL(item.url);
	}

	function releaseMedia() {
		loadToken++;
		revokeMediaUrls();
		receipts = [];
		signatureMedia = null;
		shownSignatureUrl = null;
	}

	async function fetchItem(id: string, filename: string): Promise<MediaItem> {
		try {
			const blob = await CoreOnkostenNotaAPI.fetchMedia(null, id, filename["name"]);
			return { filename, state: 'ok', blob, url: URL.createObjectURL(blob) };
		} catch (err) {
			console.error(err);
			return { filename, state: 'error', blob: null, url: null };
		}
	}

	// Receipts are listed in media_url_list. The signature is stored separately (its own endpoint), so it
	// is fetched on its own: 404 means "not signed yet".
	async function loadSignature(id = identifier, token = loadToken) {
		signatureError = false;
		try {
			const blob = await CoreOnkostenNotaAPI.fetchSignature(null, id);
			if (token !== loadToken) return;
			if (blob) {
				signatureMedia = { filename: 'signature', state: 'ok', blob, url: URL.createObjectURL(blob) };
				signatureOnServer = true;
			}
		} catch (err) {
			if (token !== loadToken) return;
			console.error(err);
			signatureError = true;
		}
	}

	async function loadMedia(n: OnkostenNotaWideI) {
		const token = ++loadToken;
		const id = identifierOf(n);
		const names = [...(n.media_url_list ?? [])];
		receipts = names.map((filename) => ({ filename, state: 'loading', blob: null, url: null }));
		await Promise.all([
			loadSignature(id, token),
			...names.map(async (filename) => {
				const item = await fetchItem(id, filename);
				if (token !== loadToken) {
					if (item.url) URL.revokeObjectURL(item.url);
					return;
				}
				receipts = receipts.map((r) => (r.filename === filename ? item : r));
			})
		]);
	}

	async function retryItem(item: MediaItem) {
		const token = loadToken;
		receipts = receipts.map((r) => (r.filename === item.filename ? { ...r, state: 'loading' } : r));
		const fresh = await fetchItem(identifier, item.filename);
		if (token !== loadToken) {
			if (fresh.url) URL.revokeObjectURL(fresh.url);
			return;
		}
		receipts = receipts.map((r) => (r.filename === item.filename ? fresh : r));
		// The "not all receipts loaded" message is out of date once nothing has failed any more.
		if (!receipts.some((r) => r.state === 'error')) {
			problems = problems.filter((p) => !p.startsWith('Niet alle bonnen'));
		}
	}

	// --- Signature pad (canvas) ---
	/** Svelte action: runs when the canvas appears (not in the read-only view). */
	function signaturePad(node: HTMLCanvasElement) {
		const ctx = node.getContext('2d')!;
		ctx.strokeStyle = '#0a1931';
		ctx.lineWidth = 2.2;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		sigCanvas = node;
		sigCtx = ctx;
		loadRememberedSignature();
		return {
			destroy() {
				sigCanvas = null;
				sigCtx = null;
			}
		};
	}

	function loadRememberedSignature() {
		if (!sigCtx || signatureMedia?.url) return;
		try {
			const remembered = localStorage.getItem(SIG_STORAGE_KEY);
			if (remembered) drawSignatureFrom(remembered).then(() => (hasSignature = true));
		} catch {
			// storage can be unavailable (private window): the pad still works
		}
	}

	function clearPad() {
		sigCtx?.clearRect(0, 0, SIG_WIDTH, SIG_HEIGHT);
		hasSignature = false;
	}

	function drawSignatureFrom(url: string): Promise<void> {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				if (sigCtx) {
					const scale = Math.min(SIG_WIDTH / img.width, SIG_HEIGHT / img.height);
					const w = img.width * scale;
					const h = img.height * scale;
					sigCtx.clearRect(0, 0, SIG_WIDTH, SIG_HEIGHT);
					sigCtx.drawImage(img, (SIG_WIDTH - w) / 2, (SIG_HEIGHT - h) / 2, w, h);
				}
				resolve();
			};
			img.onerror = () => resolve();
			img.src = url;
		});
	}

	function rememberSignature() {
		try {
			if (hasSignature && sigCanvas) localStorage.setItem(SIG_STORAGE_KEY, sigCanvas.toDataURL('image/png'));
			else localStorage.removeItem(SIG_STORAGE_KEY);
		} catch {
			// ignore
		}
	}

	function sigPosition(e: PointerEvent) {
		const rect = sigCanvas!.getBoundingClientRect();
		return {
			x: (e.clientX - rect.left) * (SIG_WIDTH / rect.width),
			y: (e.clientY - rect.top) * (SIG_HEIGHT / rect.height)
		};
	}

	function sigDown(e: PointerEvent) {
		if (busy || !sigCtx || !sigCanvas) return;
		e.preventDefault();
		sigCanvas.setPointerCapture(e.pointerId);
		sigDrawing = true;
		const p = sigPosition(e);
		sigCtx.beginPath();
		sigCtx.moveTo(p.x, p.y);
		sigCtx.lineTo(p.x, p.y); // a tap leaves a dot
		sigCtx.stroke();
	}

	function sigMove(e: PointerEvent) {
		if (!sigDrawing || !sigCtx) return;
		e.preventDefault();
		const p = sigPosition(e);
		sigCtx.lineTo(p.x, p.y);
		sigCtx.stroke();
	}

	function sigUp() {
		if (!sigDrawing) return;
		sigDrawing = false;
		hasSignature = true;
		signatureChanged = true;
		rememberSignature();
	}

	function clearSignature() {
		clearPad();
		signatureChanged = true;
		rememberSignature();
	}

	async function onSignatureFile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		const url = URL.createObjectURL(file);
		await drawSignatureFrom(url);
		URL.revokeObjectURL(url);
		hasSignature = true;
		signatureChanged = true;
		rememberSignature();
	}

	/** The signature as a PNG, or null when the pad is empty. */
	function signatureToBlob(): Promise<Blob | null> {
		if (!hasSignature || !sigCanvas) return Promise.resolve(null);
		return new Promise((resolve) => sigCanvas!.toBlob((blob) => resolve(blob), 'image/png'));
	}

	// --- Validation ---
	function validate(finalize: boolean): string[] {
		const out: string[] = [];
		if (rows.length === 0) out.push('Er is minstens één aankoop nodig.');
		rows.forEach((r, i) => {
			const n = i + 1;
			if (!r.description.trim()) out.push(`Aankoop ${n}: beschrijving ontbreekt.`);
			if (r.price === null || !(r.price > 0)) out.push(`Aankoop ${n}: prijs moet groter dan 0 zijn.`);
			if (finalize && r.boekhoudpost === GEEN_BOEKHOUDPOST) out.push(`Aankoop ${n}: kies een boekhoudpost.`);
		});
		if (finalize) {
			if (!voldaan) out.push('Vul de datum "Onkosten voldaan op" in.');
			if (!hasSignature) out.push('Plaats een handtekening.');
			if (receiptsLoading) out.push('De bonnen worden nog geladen.');
			else if (receipts.some((r) => r.state === 'error')) {
				out.push('Niet alle bonnen konden geladen worden. Laad ze eerst opnieuw: de PDF zou onvolledig zijn.');
			}
		}
		return out;
	}

	/** The body of the PUT: the whole nota with the quaestor's changes applied. */
	function buildNota(finalize: boolean): OnkostenNotaWideI {
		return {
			...current,
			datum_onkosten_voldaan: voldaan ? `${voldaan}T00:00:00` : null,
			onkostennota_status: finalize ? OnkostenNotaEnum.afgewerkt : current.onkostennota_status,
			kosten: rows.map((r) => ({
				id: r.id,
				onkostennota_volgnummer: current.volgnummer,
				description: r.description.trim(),
				price_eu: Number((r.price ?? 0).toFixed(2)),
				boekhoudpost: r.boekhoudpost
			}))
		};
	}

	function applyUpdated(updated: OnkostenNotaWideI) {
		saved = updated;
		rows = toRows(updated);
		voldaan = updated.datum_onkosten_voldaan?.slice(0, 10) ?? voldaan;
		initialSnapshot = snapshot();
		refresh();
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

	// --- Actions ---
	async function save() {
		const found = validate(false);
		if (found.length) {
			problems = found;
			return;
		}
		await run('Opslaan…', async () => {
			applyUpdated(await CoreOnkostenNotaAPI.putOnkostennota(null, current.volgnummer, buildNota(false)));
			info = 'Wijzigingen opgeslagen.';
		});
	}

	/** Builds the PDF from the nota as last saved and downloads it. */
	async function makePdf(template: ArrayBuffer, signature: Blob | null) {
		const bytes = await buildOnkostenPdf(current, template, {
			receipts: receipts.flatMap((r) => (r.blob ? [r.blob] : [])),
			signature: signature ?? signatureMedia?.blob ?? null
		});
		downloadPdf(bytes, `${identifier}.pdf`);
	}

	async function finalize() {
		const found = validate(true);
		if (found.length) {
			problems = found;
			return;
		}
		await run('PDF-template laden…', async () => {
			// 1. Fail fast: without the template there is no PDF, so don't finish the nota yet.
			const template = await getTemplateBytes();

			// 2. Signature first. It is uploaded once: a retry after a failed save does not upload it again.
			const signature = await signatureToBlob();
			if (signature && (!signatureOnServer || signatureChanged)) {
				busyLabel = 'Handtekening uploaden…';
				await CoreOnkostenNotaAPI.uploadSignature(null, identifier, signature);
				signatureOnServer = true;
				signatureChanged = false;
				const url = URL.createObjectURL(signature);
				shownSignatureUrl = url; // already on the pad, no need to draw it again
				signatureMedia = { filename: 'signature.png', state: 'ok', blob: signature, url };
			}

			// 3. Then the data, with the finished status. Only now is the nota finished.
			busyLabel = 'Onkostennota afwerken…';
			applyUpdated(await CoreOnkostenNotaAPI.putOnkostennota(null, current.volgnummer, buildNota(true)));

			// 4. Finally the PDF. If this fails the nota is already finished; the read-only view can download it again.
			busyLabel = 'PDF genereren…';
			await makePdf(template, signature);
			info = 'Onkostennota is afgewerkt en de PDF is gedownload.';
		});
	}

	async function downloadAgain() {
		if (signatureError) {
			problems = ['De handtekening kon niet geladen worden: de PDF zou onvolledig zijn. Probeer opnieuw.'];
			return;
		}
		await run('PDF genereren…', async () => {
			await makePdf(await getTemplateBytes(), null);
		});
	}

	function requestClose() {
		if (busy) return;
		if (dirty && !confirm('Je hebt niet-opgeslagen wijzigingen. Toch sluiten?')) return;
		isOpen = false; // the effect above closes the dialog
	}
</script>

<dialog
	bind:this={dialog}
	class="onkosten-modal"
	aria-labelledby="onkosten-modal-title"
	oncancel={(e) => {
		e.preventDefault(); // ESC goes through requestClose so unsaved edits are not lost silently
		requestClose();
	}}
	onclose={() => (isOpen = false)}
>
	<header class="modal-head">
		<div>
			<h2 class="text-white">Onkostennota {formatVolgnummer(current.volgnummer)}</h2>
			<p class="text-white sub">
				{current.billing_information.given_name}
				{current.billing_information.family_name}
			</p>
		</div>
		<div class="head-right">
			<span class="badge" class:done={readonly}>{readonly ? 'Afgewerkt' : 'In afwachting'}</span>
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

		<section>
			<h3>Lid</h3>
			<dl class="facts">
				<div><dt>E-mail</dt><dd>{current.user_email}</dd></div>
				<div><dt>IBAN</dt><dd>{formatIban(current.billing_information.iban)}</dd></div>
				<div><dt>Datum gemaakte kosten</dt><dd>{isoToBE(current.datum_gemaakte_kosten)}</dd></div>
			</dl>
		</section>

		<section>
			<h3>Aankopen &amp; boekhoudposten</h3>
			<div class="rows-head"><span>Boekhoudpost</span><span>Beschrijving</span><span>Prijs (€)</span></div>
			{#each rows as row, i (row.key)}
				<div class="row">
					<select
						aria-label="Boekhoudpost aankoop {i + 1}"
						bind:value={row.boekhoudpost}
						disabled={readonly || busy}
					>
						<option value={GEEN_BOEKHOUDPOST}>-- Kies boekhoudpost --</option>
						{#each BOEKHOUDPOSTEN as p (p.code)}
							<option value={p.code}>{p.code} — {p.label}</option>
						{/each}
						{#if row.boekhoudpost !== GEEN_BOEKHOUDPOST && !KNOWN_CODES.has(row.boekhoudpost)}
							<option value={row.boekhoudpost}>{row.boekhoudpost}</option>
						{/if}
					</select>
					<input
						type="text"
						aria-label="Beschrijving aankoop {i + 1}"
						bind:value={row.description}
						disabled={readonly || busy}
					/>
					<input
						type="number"
						step="0.01"
						min="0"
						aria-label="Prijs aankoop {i + 1}"
						bind:value={row.price}
						disabled={readonly || busy}
					/>
				</div>
			{/each}
			<div class="total"><span>Totaalbedrag:</span><span>{formatEuro(totalEuro)}</span></div>
		</section>

		<section>
			<h3>Bonnen <span class="muted">({receipts.length})</span></h3>
			{#if receipts.length === 0}
				<p class="muted">Geen bonnen geüpload.</p>
			{/if}
			<div class="thumbs">
				{#each receipts as item, i (item.filename)}
					<div class="thumb">
						{#if item.state === 'ok' && item.url}
							<a href={item.url} target="_blank" rel="noopener" title="Open in nieuw tabblad">
								<img src={item.url} alt="Bon {i + 1}" />
							</a>
						{:else if item.state === 'loading'}
							<span class="muted">Laden…</span>
						{:else}
							<div class="thumb-error">
								<span>Kon bon {i + 1} niet laden</span>
								<button type="button" class="btn btn-outline small" onclick={() => retryItem(item)}>
									Opnieuw
								</button>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>

		<section class="finish">
			<h3>Afwerking</h3>
			<div class="finish-grid">
				<div>
					<label for="onkosten-voldaan">Onkosten voldaan op</label>
					<input id="onkosten-voldaan" type="date" bind:value={voldaan} disabled={readonly || busy} />
				</div>
				<div>
					<p class="label">Handtekening Quaestor</p>
					{#if readonly}
						{#if signatureMedia?.url}
							<img class="sig-view" src={signatureMedia.url} alt="Handtekening Quaestor" />
						{:else if signatureError}
							<p class="muted">
								Handtekening kon niet geladen worden.
								<button type="button" class="btn btn-outline small" onclick={() => loadSignature()}>Opnieuw</button>
							</p>
						{:else}
							<p class="muted">Geen handtekening beschikbaar.</p>
						{/if}
					{:else}
						<canvas
							use:signaturePad
							class="sig-canvas"
							class:disabled={busy}
							width={SIG_WIDTH}
							height={SIG_HEIGHT}
							aria-label="Handtekening Quaestor"
							onpointerdown={sigDown}
							onpointermove={sigMove}
							onpointerup={sigUp}
							onpointercancel={sigUp}
						></canvas>
						<div class="sig-actions">
							<button type="button" class="btn btn-outline small" disabled={busy} onclick={clearSignature}>
								Handtekening wissen
							</button>
							<label class="sig-file">
								Of upload een afbeelding (PNG/JPG)
								<input type="file" accept="image/*" disabled={busy} onchange={onSignatureFile} />
							</label>
						</div>
					{/if}
				</div>
			</div>
		</section>
	</div>

	<footer class="modal-foot">
		{#if readonly}
			<button type="button" class="btn btn-primary" disabled={busy || receiptsLoading} onclick={downloadAgain}>
				{busy ? busyLabel : 'PDF downloaden'}
			</button>
		{:else}
			<button type="button" class="btn btn-outline" disabled={busy} onclick={save}>
				{busy && busyLabel === 'Opslaan…' ? busyLabel : 'Opslaan'}
			</button>
			<button type="button" class="btn btn-success" disabled={busy || receiptsLoading} onclick={finalize}>
				{busy && busyLabel !== 'Opslaan…' ? busyLabel : '✅ Finaliseren & PDF downloaden'}
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
    }
    .sub {
        margin: 0.1rem 0 0;
        opacity: 0.85;
        font-size: 0.9rem;
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
    input[type='number'],
    input[type='date'],
    select {
        box-sizing: border-box;
        width: 100%;
        padding: 0.55rem 0.75rem;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font: inherit;
        font-size: 0.92rem;
        background: white;
    }
    input:focus,
    select:focus {
        outline: none;
        border-color: var(--ing-blue);
        box-shadow: 0 0 0 3px rgba(28, 43, 120, 0.15);
    }
    input:disabled,
    select:disabled {
        background: #f1f5f9;
        color: var(--text-muted);
    }
    label,
    .label {
        margin-top: 0;
        display: block;
        margin-bottom: 0.35rem;
        font-size: 0.85rem;
        font-weight: 600;
    }

    .thumbs {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 0.9rem;
    }
    .thumb {
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

    .finish-grid {
        display: grid;
        grid-template-columns: minmax(180px, 280px) 1fr;
        gap: 1.5rem;
    }
    @media (max-width: 720px) {
        .finish-grid {
            grid-template-columns: 1fr;
        }
    }
    .sig-canvas {
        display: block;
        width: 100%;
        max-width: 340px;
        aspect-ratio: 340 / 110;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background: #fff;
        cursor: crosshair;
        touch-action: none;
    }
    .sig-canvas.disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .sig-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.4rem;
    }
    .sig-file {
        margin: 0;
        font-size: 0.78rem;
        font-weight: 400;
        color: var(--text-muted);
    }
    .sig-file input {
        display: block;
        margin-top: 0.2rem;
        font-size: 0.78rem;
    }
    .sig-view {
        max-width: 340px;
        width: 100%;
        border: 1px solid var(--ing-light);
        border-radius: 6px;
        background: white;
    }

    .banner {
        padding: 0.75rem 1rem;
        margin-bottom: 1rem;
        border: 1px solid;
        border-radius: 8px;
        font-size: 0.9rem;
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

    .badge {
        padding: 0.2rem 0.65rem;
        border-radius: 99px;
        font-size: 0.75rem;
        font-weight: 600;
        background: #fef3c7;
        color: #92400e;
    }
    .badge.done {
        background: #d1fae5;
        color: #065f46;
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
    .btn-primary {
        background: var(--ing-blue);
        color: white;
    }
    .btn-primary:hover:not(:disabled) {
        background: var(--ing-dark);
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
</style>