<script>
	import { onMount } from 'svelte';
	import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

	const TEMPLATE_URL =
		'https://ingeniumuapublic.blob.core.windows.net/ingeniumuaimages/onkostennota/IngeniumUA-VZW_Template_2026-2027.pdf';
	const PROFILE_STORAGE_KEY = 'ingenium_onkosten_profiles';
	const SUBMISSIONS_STORAGE_KEY = 'ingenium_submitted_expenses';

	// EXACTE GEKALIBREERDE COÖRDINATEN
	const PDF_COORDS = {
		voornaam: { x: 140, y: 672 },
		achternaam: { x: 140, y: 657 },
		email: { x: 140, y: 642 },
		iban: { x: 140, y: 627 },
		datum: { x: 105, y: 599 },
		kmVergoeding: { x: 205, y: 584 },
		tableStartY: 512,
		tableRowStep: 16.0,
		colDescX: 122,
		colPriceX: 518,
		totalY: 264
	};

	// --- State ---
	let profiles = [];
	let selectedProfileId = '';

	let voornaam = '';
	let achternaam = '';
	let email = '';
	let iban = '';
	let datum = todayLocalISO();

	let nextRowId = 1;
	let rows = [];

	let receipts = [];

	let templatePdfBytes = null;
	let templateState = 'loading'; // 'loading' | 'ok' | 'error'
	let templateLabel = '';

	$: total = rows.reduce((sum, r) => {
		const v = parseFloat(r.price);
		return Number.isFinite(v) ? sum + v : sum;
	}, 0);
	$: pagesCount = Math.max(1, Math.ceil(receipts.length / 4));

	onMount(async () => {
		profiles = readProfiles();
		for (let i = 0; i < 3; i++) addExpenseRow();
		await loadTemplate();
	});

	function todayLocalISO() {
		const d = new Date();
		const mm = String(d.getMonth() + 1).padStart(2, '0');
		const dd = String(d.getDate()).padStart(2, '0');
		return `${d.getFullYear()}-${mm}-${dd}`;
	}

	function formatEuro(n) {
		return `€ ${n.toFixed(2).replace('.', ',')}`;
	}

	// --- Template laden vanaf Azure Blob Storage ---
	async function loadTemplate() {
		templateState = 'loading';
		try {
			const res = await fetch(TEMPLATE_URL);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			templatePdfBytes = await res.arrayBuffer();
			templateLabel = 'Originele PDF-template (2026-2027) geladen.';
			templateState = 'ok';
			return true;
		} catch (err) {
			console.error('Template kon niet geladen worden:', err);
			templateLabel = 'Template kon niet automatisch geladen worden. Selecteer rechts je originele PDF.';
			templateState = 'error';
			return false;
		}
	}

	async function handleManualTemplate(event) {
		const file = event.currentTarget.files?.[0];
		if (!file) return;
		templatePdfBytes = await file.arrayBuffer();
		templateLabel = `Originele PDF (${file.name}) ingeladen!`;
		templateState = 'ok';
	}

	// --- INSPECTEER PDF VELDEN (handig voor coördinaten) ---
	async function inspectPdfFields() {
		if (!templatePdfBytes) {
			alert('Laad eerst een PDF-template in.');
			return;
		}
		const pdfDoc = await PDFDocument.load(templatePdfBytes);
		const fields = pdfDoc.getForm().getFields();

		let info = `Gevonden PDF-formuliervelden (${fields.length}):\n\n`;
		fields.forEach((f) => {
			info += `- Naam: "${f.getName()}" (Type: ${f.constructor.name})\n`;
		});
		if (fields.length === 0) {
			info +=
				'Geen interactieve formuliervelden gevonden. De coördinaten worden op basis van vaste posities geplaatst.';
		}
		alert(info);
		console.log(fields);
	}

	// --- 1. PROFIELEN BEHEREN ---
	function readProfiles() {
		try {
			const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	}

	function writeProfiles(list) {
		profiles = list;
		localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(list));
	}

	function saveProfile() {
		const v = voornaam.trim();
		const a = achternaam.trim();
		if (!v || !a) {
			alert('Vul minstens je voornaam en naam in.');
			return;
		}
		const id = `${v.toLowerCase()}_${a.toLowerCase()}`;
		const newProfile = { id, voornaam: v, achternaam: a, email: email.trim(), iban: iban.trim() };

		const list = [...profiles];
		const idx = list.findIndex((p) => p.id === id);
		if (idx >= 0) list[idx] = newProfile;
		else list.push(newProfile);

		writeProfiles(list);
		selectedProfileId = id;
		alert(`Profiel voor ${v} ${a} opgeslagen!`);
	}

	function loadSelectedProfile(id) {
		selectedProfileId = id;
		const profile = profiles.find((p) => p.id === id);
		voornaam = profile?.voornaam ?? '';
		achternaam = profile?.achternaam ?? '';
		email = profile?.email ?? '';
		iban = profile?.iban ?? '';
	}

	function deleteProfile() {
		if (!selectedProfileId) return;
		if (!confirm('Profiel verwijderen?')) return;
		writeProfiles(profiles.filter((p) => p.id !== selectedProfileId));
		loadSelectedProfile('');
	}

	// --- 2. ONKOSTENRIJEN ---
	function addExpenseRow() {
		rows = [...rows, { id: nextRowId++, desc: '', price: '' }];
	}

	function removeExpenseRow(id) {
		rows = rows.filter((r) => r.id !== id);
	}

	// --- 3. BONNEN UPLOADEN ---
	function fileToJpegDataUrl(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = reject;
			reader.onload = (e) => {
				const img = new Image();
				img.onerror = reject;
				img.onload = () => {
					const canvas = document.createElement('canvas');
					canvas.width = img.width;
					canvas.height = img.height;
					const ctx = canvas.getContext('2d');
					ctx.fillStyle = '#FFFFFF';
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(img, 0, 0);
					resolve({ name: file.name, dataUrl: canvas.toDataURL('image/jpeg', 0.9) });
				};
				img.src = e.target.result;
			};
			reader.readAsDataURL(file);
		});
	}

	async function handleReceiptsUpload(event) {
		const input = event.currentTarget;
		const files = Array.from(input.files ?? []);
		input.value = '';
		try {
			const converted = await Promise.all(files.map(fileToJpegDataUrl));
			receipts = [...receipts, ...converted];
		} catch (err) {
			console.error(err);
			alert('Een van de afbeeldingen kon niet gelezen worden.');
		}
	}

	function removeReceipt(index) {
		receipts = receipts.filter((_, i) => i !== index);
	}

	// --- 4. EXACTE ORIGINELE PDF INVULLEN ---
	async function submitAndDownloadPDF() {
		if (!templatePdfBytes) {
			const ok = await loadTemplate();
			if (!ok) {
				alert('De PDF-template kon niet geladen worden. Probeer het later opnieuw of kies de PDF manueel.');
				return;
			}
		}

		const v = voornaam.trim();
		const a = achternaam.trim();
		const mail = email.trim();
		const ibanVal = iban.trim();

		if (!v || !a || !mail || !ibanVal || !datum) {
			alert('Vul alle persoonsgegevens en de datum in.');
			return;
		}

		const items = [];
		rows.forEach((r) => {
			const desc = r.desc.trim();
			const priceVal = parseFloat(r.price);
			if (desc || !Number.isNaN(priceVal)) {
				items.push({
					boekhoudpost: '',
					beschrijving: desc,
					prijs: Number.isNaN(priceVal) ? 0 : priceVal
				});
			}
		});

		if (items.length === 0) {
			alert('Voeg minstens één aankoop toe.');
			return;
		}

		const [yyyy, mm, dd] = datum.split('-');
		const formattedDate = `${dd}/${mm}/${yyyy}`;
		const totalAmount = items.reduce((s, i) => s + i.prijs, 0);

		// Opslaan voor Quaestor-dashboard
		const submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_STORAGE_KEY) || '[]');
		submissions.push({
			id: 'EXP_' + Date.now(),
			ingediendOp: new Date().toISOString(),
			status: 'In afwachting van Quaestor',
			volgnummer: '',
			voornaam: v,
			achternaam: a,
			email: mail,
			iban: ibanVal,
			datum: formattedDate,
			datumISO: datum,
			items,
			totaal: totalAmount,
			receipts
		});
		localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));

		const pdfDoc = await PDFDocument.load(templatePdfBytes);
		const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

		// Verwijder blauwe vakjes
		try {
			const form = pdfDoc.getForm();
			form.getFields().forEach((field) => {
				try {
					form.removeField(field);
				} catch (e) {}
			});
		} catch (e) {}

		const page1 = pdfDoc.getPages()[0];
		const color = rgb(0, 0, 0);
		const fontSize = 10;

		page1.drawText(v, { x: PDF_COORDS.voornaam.x, y: PDF_COORDS.voornaam.y, size: fontSize, font: fontRegular, color });
		page1.drawText(a, { x: PDF_COORDS.achternaam.x, y: PDF_COORDS.achternaam.y, size: fontSize, font: fontRegular, color });
		page1.drawText(mail, { x: PDF_COORDS.email.x, y: PDF_COORDS.email.y, size: fontSize, font: fontRegular, color });
		page1.drawText(ibanVal, { x: PDF_COORDS.iban.x, y: PDF_COORDS.iban.y, size: fontSize, font: fontRegular, color });

		page1.drawText(formattedDate, { x: PDF_COORDS.datum.x, y: PDF_COORDS.datum.y, size: fontSize, font: fontRegular, color });
		page1.drawText('0.44', { x: PDF_COORDS.kmVergoeding.x, y: PDF_COORDS.kmVergoeding.y, size: fontSize, font: fontRegular, color });

		items.slice(0, 15).forEach((item, index) => {
			const yPos = PDF_COORDS.tableStartY - index * PDF_COORDS.tableRowStep;
			page1.drawText(item.beschrijving, { x: PDF_COORDS.colDescX, y: yPos, size: 9.5, font: fontRegular, color });
			page1.drawText(formatEuro(item.prijs), { x: PDF_COORDS.colPriceX, y: yPos, size: 9.5, font: fontRegular, color });
		});

		page1.drawText(formatEuro(totalAmount), {
			x: PDF_COORDS.colPriceX,
			y: PDF_COORDS.totalY,
			size: 10,
			font: fontBold,
			color
		});

		// Bonnen (max. 4 per pagina)
		const gridBoxes = [
			{ x: 45, y: 430, w: 235, h: 350 },
			{ x: 315, y: 430, w: 235, h: 350 },
			{ x: 45, y: 50, w: 235, h: 350 },
			{ x: 315, y: 50, w: 235, h: 350 }
		];

		for (let i = 0; i < receipts.length; i++) {
			const pageIndex = Math.floor(i / 4) + 1;
			const targetPage =
				pageIndex < pdfDoc.getPageCount() ? pdfDoc.getPage(pageIndex) : pdfDoc.addPage([595.28, 841.89]);
			const slot = gridBoxes[i % 4];
			const embeddedJpg = await pdfDoc.embedJpg(receipts[i].dataUrl);
			const dims = embeddedJpg.scaleToFit(slot.w, slot.h);

			targetPage.drawImage(embeddedJpg, {
				x: slot.x + (slot.w - dims.width) / 2,
				y: slot.y + (slot.h - dims.height) / 2,
				width: dims.width,
				height: dims.height
			});
		}

		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `O0xxx_Onkostennota_${v}_${a}.pdf`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>Onkostennota Indienen | Ingenium UA</title>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="page">
	<main class="container">
		<!-- Template status -->
		<div
			class="template-status-bar"
			class:ok={templateState === 'ok'}
			class:error={templateState === 'error'}
		>
			<span>
				{#if templateState === 'loading'}
					Originele PDF-template wordt geladen...
				{:else if templateState === 'ok'}
					✅ {templateLabel}
				{:else}
					⚠️ {templateLabel}
				{/if}
			</span>
			<div class="status-actions">
				<button type="button" class="btn btn-outline btn-small" on:click={inspectPdfFields}>
					Inspecteer PDF-velden
				</button>
				<input
					type="file"
					id="manualTemplateInput"
					accept="application/pdf"
					hidden
					on:change={handleManualTemplate}
				/>
				<button
					type="button"
					class="btn btn-outline btn-small"
					on:click={() => document.getElementById('manualTemplateInput').click()}
				>
					Kies PDF
				</button>
			</div>
		</div>

		<!-- 1. PERSOONSGEGEVENS -->
		<section class="card">
			<div class="card-title"><span>1. Persoonsgegevens</span></div>

			<div class="profile-bar">
				<div class="form-group">
					<label for="profileSelect">Selecteer je naam (of maak eenmalig je profiel aan):</label>
					<select
						id="profileSelect"
						value={selectedProfileId}
						on:change={(e) => loadSelectedProfile(e.currentTarget.value)}
					>
						<option value="">-- Nieuw profiel invullen --</option>
						{#each profiles as p (p.id)}
							<option value={p.id}>{p.voornaam} {p.achternaam}</option>
						{/each}
					</select>
				</div>
				<button disabled type="button" class="btn btn-outline" on:click={saveProfile}>
					Gegevens opslaan onder mijn naam
				</button>
				<button
					disabled
					type="button"
					class="btn btn-danger"
					on:click={deleteProfile}
					title="Verwijder geselecteerd profiel">✕</button
				>
			</div>

			<div class="grid-2">
				<div class="form-group">
					<label for="voornaam">Voornaam *</label>
					<input type="text" id="voornaam" placeholder="Bijv. Jan" required bind:value={voornaam} />
				</div>
				<div class="form-group">
					<label for="achternaam">Naam *</label>
					<input type="text" id="achternaam" placeholder="Bijv. Janssens" required bind:value={achternaam} />
				</div>
				<div class="form-group">
					<label for="email">E-mailadres *</label>
					<input
						type="email"
						id="email"
						placeholder="jan.janssens@ingeniumua.be"
						required
						bind:value={email}
					/>
				</div>
				<div class="form-group">
					<label for="iban">Rekeningnummer (IBAN) *</label>
					<input type="text" id="iban" placeholder="BE00 0000 0000 0000" required bind:value={iban} />
				</div>
			</div>
		</section>

		<!-- 2. GEMAAKTE ONKOSTEN -->
		<section class="card">
			<div class="card-title">
				<span>2. Gemaakte Onkosten</span>
				<button type="button" class="btn btn-outline" on:click={addExpenseRow}>+ Aankoop toevoegen</button>
			</div>

			<div class="form-group date-group">
				<label for="datum">Datum van gemaakte kosten *</label>
				<input type="date" id="datum" required bind:value={datum} />
			</div>

			<p class="km-info">Vervoersonkosten worden voor 0,44 euro/km vergoed.</p>

			<div>
				{#each rows as row (row.id)}
					<div class="expense-row">
						<input
							type="text"
							placeholder="Beschrijving van aankoop"
							bind:value={row.desc}
						/>
						<input
							type="number"
							placeholder="Prijs (€)"
							step="0.01"
							min="0"
							bind:value={row.price}
						/>
						<button
							type="button"
							class="btn btn-danger"
							on:click={() => removeExpenseRow(row.id)}
							title="Verwijder rij">✕</button
						>
					</div>
				{/each}
			</div>

			<div class="total-bar">
				<span>Totaalbedrag:</span>
				<span>{formatEuro(total)}</span>
			</div>
		</section>

		<!-- 3. BONNEN & FOTO'S UPLOADEN -->
		<section class="card">
			<div class="card-title">
				<span>3. Bonnen &amp; Foto's Uploaden</span>
				<span class="badge">
					{receipts.length} bon(nen) ({pagesCount} bijlagepagina{pagesCount === 1 ? '' : "'s"})
				</span>
			</div>
			<p class="upload-help">
				Upload hier de foto's van je kasticketjes of facturen. Ze worden automatisch op de witte
				bijlagepagina van de onkostennota geplaatst (<strong>maximaal 4 bonnen per pagina</strong>, bij
				meer bonnen komt er automatisch een pagina bij).
			</p>

			<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
			<div class="upload-zone" on:click={() => document.getElementById('receiptInput').click()}>
				<input
					type="file"
					id="receiptInput"
					accept="image/*"
					multiple
					hidden
					on:change={handleReceiptsUpload}
				/>
				<strong>Klik hier om bonnen of foto's toe te voegen</strong>
				<p class="upload-sub">Ondersteunt JPG, PNG, WEBP (meerdere foto's tegelijk mogelijk)</p>
			</div>

			<div class="receipt-preview-grid">
				{#each receipts as rec, index (rec.dataUrl)}
					<div class="receipt-thumb">
						<img src={rec.dataUrl} alt="Bon {index + 1}" />
						<button type="button" on:click={() => removeReceipt(index)} title="Verwijder bon">✕</button>
					</div>
				{/each}
			</div>
		</section>

		<!-- ACTIEKNOPPEN -->
		<div class="actions">
			<button type="button" class="btn btn-primary btn-large" on:click={submitAndDownloadPDF}>
				Onkostennota Indienen &amp; Originele PDF Downloaden
			</button>
		</div>
	</main>
</div>

<style>
    :root {
        --ing-dark: #0a1931;
        --ing-blue: #1c2b78;
        --ing-accent: #3b4ba8;
        --ing-light: #e2e8f0;
        --ing-bg: #f8fafc;
        --text-main: #1e293b;
        --text-muted: #64748b;
        --danger: #ef4444;
        --success: #10b981;
        --radius: 10px;
    }

    .page {
        font-family: 'Inter', sans-serif;
        background-color: var(--ing-bg);
        color: var(--text-main);
        line-height: 1.5;
        min-height: 100vh;
    }

    .page :global(*),
    .page :global(*::before),
    .page :global(*::after) {
        box-sizing: border-box;
    }

    /* --- CONTAINER & CARDS --- */
    .container {
        max-width: 850px;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    .card {
        background: white;
        border-radius: var(--radius);
        padding: 2rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--ing-light);
    }

    .card-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--ing-blue);
        margin-bottom: 1.25rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--ing-light);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    @media (max-width: 640px) {
        .grid-2 {
            grid-template-columns: 1fr;
        }
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .date-group {
        max-width: 320px;
        margin-bottom: 1.25rem;
    }

    label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 0.4rem;
        color: var(--text-main);
    }

    input[type='text'],
    input[type='email'],
    input[type='date'],
    input[type='number'],
    select {
        width: 100%;
        padding: 0.65rem 0.85rem;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font-size: 0.95rem;
        font-family: inherit;
        transition:
                border-color 0.2s,
                box-shadow 0.2s;
    }

    input:focus,
    select:focus {
        outline: none;
        border-color: var(--ing-blue);
        box-shadow: 0 0 0 3px rgba(28, 43, 120, 0.15);
    }

    /* --- KNOPPEN --- */
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.65rem 1.2rem;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.9rem;
        font-family: inherit;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
    }

    .btn-small {
        padding: 0.35rem 0.75rem;
        font-size: 0.8rem;
    }

    .btn-large {
        font-size: 1.05rem;
        padding: 0.85rem 2rem;
    }

    .btn-primary {
        background-color: var(--ing-blue);
        color: white;
    }

    .btn-primary:hover {
        background-color: var(--ing-dark);
    }

    .btn-outline {
        background-color: transparent;
        border: 1px solid var(--ing-blue);
        color: var(--ing-blue);
    }

    .btn-outline:hover {
        background-color: rgba(28, 43, 120, 0.05);
    }

    .btn-danger {
        background-color: #fee2e2;
        color: var(--danger);
        padding: 0.5rem 0.8rem;
    }

    .btn-danger:hover {
        background-color: #fecaca;
    }

    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* --- PROFIEL BALK --- */
    .profile-bar {
        display: flex;
        gap: 0.75rem;
        align-items: flex-end;
        margin-bottom: 1.25rem;
        background: #f1f5f9;
        padding: 1rem;
        border-radius: 8px;
        flex-wrap: wrap;
    }

    .profile-bar .form-group {
        flex: 1;
        min-width: 220px;
        margin-bottom: 0;
    }

    /* --- ONKOSTEN RIJEN --- */
    .expense-row {
        display: grid;
        grid-template-columns: 3.5fr 1.2fr auto;
        gap: 0.75rem;
        align-items: center;
        margin-bottom: 0.75rem;
    }

    @media (max-width: 640px) {
        .expense-row {
            grid-template-columns: 1fr;
            background: #f8fafc;
            padding: 0.75rem;
            border-radius: 6px;
            border: 1px solid var(--ing-light);
        }
    }

    .total-bar {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1.5rem;
        margin-top: 1.25rem;
        padding-top: 1rem;
        border-top: 2px solid var(--ing-light);
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--ing-dark);
    }

    .km-info {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-bottom: 1rem;
        font-style: italic;
    }

    /* --- BONNEN UPLOAD --- */
    .badge {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-muted);
    }

    .upload-help {
        font-size: 0.9rem;
        color: var(--text-muted);
        margin-bottom: 1rem;
    }

    .upload-sub {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 0.25rem;
    }

    .upload-zone {
        border: 2px dashed #94a3b8;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        cursor: pointer;
        transition:
                border-color 0.2s,
                background 0.2s;
    }

    .upload-zone:hover {
        border-color: var(--ing-blue);
        background: #f1f5f9;
    }

    .receipt-preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1.25rem;
    }

    .receipt-thumb {
        position: relative;
        border: 1px solid var(--ing-light);
        border-radius: 6px;
        overflow: hidden;
        background: #fff;
        aspect-ratio: 3/4;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .receipt-thumb img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

    .receipt-thumb button {
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        border: none;
        border-radius: 50%;
        width: 26px;
        height: 26px;
        cursor: pointer;
        font-weight: bold;
    }

    /* --- TEMPLATE STATUS BALK --- */
    .template-status-bar {
        background: #eef2ff;
        border: 1px solid #c7d2fe;
        color: var(--ing-blue);
        padding: 0.75rem 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.88rem;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .template-status-bar.ok {
        background: #ecfdf5;
        border-color: #a7f3d0;
        color: #065f46;
    }

    .template-status-bar.error {
        background: #fef2f2;
        border-color: #fecaca;
        color: #991b1b;
    }

    .status-actions {
        display: flex;
        gap: 0.5rem;
    }

    /* --- ACTIEKNOPPEN --- */
    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-bottom: 4rem;
    }
</style>