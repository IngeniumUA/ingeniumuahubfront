// ---------------------------------------------------------------------------------------------
// Standalone onkostennota helpers + PDF builder.
// Suggested location: src/lib/utils/onkosten/onkostenPdf.ts
//
// The PDF builder takes ONE plain data object (OnkostenPdfData) containing everything that can be
// printed on the PDF, plus the binary media. It knows nothing about components or API models.
// Use notaToPdfData() to convert an OnkostenNotaWideI into that object.
// ---------------------------------------------------------------------------------------------
import { PDFDocument, PDFName, PDFArray, PDFDict, StandardFonts, rgb, type PDFFont } from 'pdf-lib';
import type { OnkostenNotaWideI } from '$lib/models/onkosten/onkostennota';

// ---- Identifier / formatting helpers --------------------------------------------------------
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
export function onkostenIdentifier(
	volgnummer: number,
	givenName: string,
	familyName: string
): string {
	return `${formatVolgnummer(volgnummer)}_Onkostennota_${nameSlug(givenName)}_${nameSlug(familyName)}`;
}

/** What is printed behind the pre-printed "Volgnummer: 0" on the template: 12 -> "012". */
export function pdfVolgnummer(volgnummer: number): string {
	return String(volgnummer).padStart(3, '0');
}

/** "be68539007547034" -> "BE68 5390 0754 7034" */
export function formatIban(iban: string): string {
	return iban
		.replace(/\s+/g, '')
		.toUpperCase()
		.replace(/(.{4})/g, '$1 ')
		.trim();
}

export const formatEuro = (n: number) => `€ ${n.toFixed(2).replace('.', ',')}`;

/** '2026-10-01T00:00:00' -> '01/10/2026' */
export const isoToBE = (iso: string) => {
	const [yyyy, mm, dd] = iso.slice(0, 10).split('-');
	return `${dd}/${mm}/${yyyy}`;
};

// ---- Boekhoudposten -------------------------------------------------------------------------
// Keep in sync with the backend BoekhoudpostEnum (int enum: unknown codes are rejected).
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

// ---- PDF data model -------------------------------------------------------------------------
export const TEMPLATE_URL =
	'https://ingeniumuapublic.blob.core.windows.net/ingeniumuaimages/onkostennota/IngeniumUA-VZW_Template_2026-2027.pdf';

/** The template table has room for this many rows. */
export const MAX_TABLE_ROWS = 15;
export const RECEIPTS_PER_PAGE = 4;
export const DEFAULT_KM_VERGOEDING = '0.44';

export interface OnkostenPdfRow {
	/** Accounting code; null / 0 prints nothing in the "Boekhoudpost" column. */
	boekhoudpost: number | null;
	description: string;
	price: number;
}

/** Everything that can be printed on the PDF. */
export interface OnkostenPdfData {
	volgnummer: number;
	givenName: string;
	familyName: string;
	email: string;
	iban: string;
	/** ISO date: "Datum gemaakte kosten" */
	datumGemaakteKosten: string;
	/** Printed as-is next to "km-vergoeding". */
	kmVergoeding?: string;
	rows: OnkostenPdfRow[];
	/** ISO date: "Onkosten voldaan op"; null leaves it blank. */
	voldaanOp: string | null;
}

export interface OnkostenPdfMedia {
	receipts: Blob[];
	signature: Blob | null;
}

/** Converts the API model to the plain data the PDF needs. */
export function notaToPdfData(nota: OnkostenNotaWideI): OnkostenPdfData {
	return {
		volgnummer: nota.volgnummer,
		givenName: nota.billing_information.given_name,
		familyName: nota.billing_information.family_name,
		email: nota.user_email,
		iban: nota.billing_information.iban,
		datumGemaakteKosten: nota.datum_gemaakte_kosten,
		rows: (nota.kosten ?? []).map((k) => ({
			boekhoudpost: k.boekhoudpost ?? null,
			description: k.description ?? '',
			price: Number(k.price_eu) // Decimal: the backend may send a string
		})),
		voldaanOp: nota.datum_onkosten_voldaan ?? null
	};
}

// ---- Calibrated coordinates -----------------------------------------------------------------
const PDF_COORDS = {
	volgnummer: { x: 525, y: 746 }, // after the pre-printed "Volgnummer: 0"
	voornaam: { x: 140, y: 672 },
	achternaam: { x: 140, y: 657 },
	email: { x: 140, y: 642 },
	iban: { x: 140, y: 627 },
	datum: { x: 105, y: 599 },
	kmVergoeding: { x: 205, y: 584 },
	tableStartY: 512,
	tableRowStep: 16.0,
	colPostX: 60,
	colDescX: 122,
	colPriceX: 518,
	totalY: 264,
	voldaanOp: { x: 145, y: 175 },
	signature: { x: 80, y: 100, w: 165, h: 60 }
};

// Receipts (max. 4 per page)
const GRID_BOXES = [
	{ x: 45, y: 430, w: 235, h: 350 },
	{ x: 315, y: 430, w: 235, h: 350 },
	{ x: 45, y: 50, w: 235, h: 350 },
	{ x: 315, y: 50, w: 235, h: 350 }
];

// ---- Template -------------------------------------------------------------------------------
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

// Removes all form widgets (the blue boxes) and the AcroForm dictionary without pdf-lib's
// form.removeField() (which can leave dangling references).
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

// Helvetica (WinAnsi) throws on characters it cannot encode (emoji, ...): replace them.
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
	const isPng = bytes[0] === 0x89 && bytes[1] === 0x50; // sniff: content-type is not relied on
	return isPng ? pdfDoc.embedPng(bytes) : pdfDoc.embedJpg(bytes);
}

// ---- The builder ----------------------------------------------------------------------------
/**
 * Builds the filled-in PDF from plain data + media.
 * `templateBytes` defaults to the (cached) official template.
 */
export async function generateOnkostenPdf(
	data: OnkostenPdfData,
	media: OnkostenPdfMedia,
	templateBytes?: ArrayBuffer
): Promise<Uint8Array> {
	const pdfDoc = await PDFDocument.load(templateBytes ?? (await getTemplateBytes()));
	const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

	stripFormFields(pdfDoc);

	const page1 = pdfDoc.getPages()[0];
	const color = rgb(0, 0, 0);
	const fontSize = 10;
	const text = (value: string, x: number, y: number, size = fontSize, font = fontRegular) =>
		page1.drawText(safeText(font, value), { x, y, size, font, color });

	text(
		pdfVolgnummer(data.volgnummer),
		PDF_COORDS.volgnummer.x,
		PDF_COORDS.volgnummer.y,
		12,
		fontBold
	);
	text(data.givenName, PDF_COORDS.voornaam.x, PDF_COORDS.voornaam.y);
	text(data.familyName, PDF_COORDS.achternaam.x, PDF_COORDS.achternaam.y);
	text(data.email, PDF_COORDS.email.x, PDF_COORDS.email.y);
	text(formatIban(data.iban), PDF_COORDS.iban.x, PDF_COORDS.iban.y);
	text(isoToBE(data.datumGemaakteKosten), PDF_COORDS.datum.x, PDF_COORDS.datum.y);
	text(
		data.kmVergoeding ?? DEFAULT_KM_VERGOEDING,
		PDF_COORDS.kmVergoeding.x,
		PDF_COORDS.kmVergoeding.y
	);

	data.rows.slice(0, MAX_TABLE_ROWS).forEach((row, index) => {
		const yPos = PDF_COORDS.tableStartY - index * PDF_COORDS.tableRowStep;
		if (row.boekhoudpost && row.boekhoudpost !== GEEN_BOEKHOUDPOST) {
			text(String(row.boekhoudpost), PDF_COORDS.colPostX, yPos, 9.5);
		}
		text(row.description ?? '', PDF_COORDS.colDescX, yPos, 9.5);
		text(formatEuro(row.price), PDF_COORDS.colPriceX, yPos, 9.5);
	});

	const total = data.rows.reduce((sum, r) => sum + r.price, 0);
	text(formatEuro(total), PDF_COORDS.colPriceX, PDF_COORDS.totalY, 10, fontBold);

	if (data.voldaanOp) {
		text(isoToBE(data.voldaanOp), PDF_COORDS.voldaanOp.x, PDF_COORDS.voldaanOp.y, 9.5);
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
			pageIndex < pdfDoc.getPageCount()
				? pdfDoc.getPage(pageIndex)
				: pdfDoc.addPage([595.28, 841.89]);
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

/** Backwards compatible wrapper: same signature the admin modal already uses. */
export function buildOnkostenPdf(
	nota: OnkostenNotaWideI,
	templateBytes: ArrayBuffer,
	media: OnkostenPdfMedia
): Promise<Uint8Array> {
	return generateOnkostenPdf(notaToPdfData(nota), media, templateBytes);
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
