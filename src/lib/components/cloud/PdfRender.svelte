<script>
	import { onMount } from 'svelte';
	import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

	GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

	export let pdfBlob;

	let container;
	let scale = 1; // user-controlled zoom level
	let pdfDoc;

	async function renderAllPages() {
		if (!pdfDoc || !container) return;

		container.innerHTML = ''; // clear previous pages

		const containerWidth = container.clientWidth;

		for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
			const page = await pdfDoc.getPage(pageNum);

			const unscaledViewport = page.getViewport({ scale: 1 });
			const fitScale = containerWidth / unscaledViewport.width;
			const finalScale = fitScale * scale;
			const viewport = page.getViewport({ scale: finalScale });

			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');

			canvas.width = viewport.width;
			canvas.height = viewport.height;

			canvas.style.width = `${viewport.width}px`;
			canvas.style.height = `${viewport.height}px`;
			canvas.style.display = 'block';
			canvas.style.marginBottom = '1rem';

			await page.render({ canvasContext: context, viewport }).promise;
			container.appendChild(canvas);
		}
	}

	async function loadPdf(blob) {
		const buffer = await blob.arrayBuffer();
		const loadingTask = getDocument({ data: buffer });
		pdfDoc = await loadingTask.promise;
		await renderAllPages();
	}

	function zoomIn() {
		scale += 0.1;
		renderAllPages();
	}

	function zoomOut() {
		scale = Math.max(0.1, scale - 0.1);
		renderAllPages();
	}

	onMount(() => {
			if (pdfBlob) {
			loadPdf(pdfBlob);
		}
	});

	$: if (pdfBlob) {
		loadPdf(pdfBlob);
	}
</script>

<style>
    .controls {
        margin-bottom: 1rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
				height: 5vh;
    }

    button {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: 1px solid lightgray;
        background-color: white;
        cursor: pointer;
    }

    button:hover {
        background-color: #f0f0f0;
    }

    .pdf-container {
        overflow-x: auto;
        overflow-y: auto;
				max-height: 95vh;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 1rem;
        box-sizing: border-box;
    }

    canvas {
        display: block;
        margin: 0 auto 1rem;
    }
</style>

<div class="controls">
	<button on:click={zoomOut}>- Zoom Out</button>
	<button on:click={zoomIn}>+ Zoom In</button>
</div>

<div bind:this={container} class="pdf-container"></div>
