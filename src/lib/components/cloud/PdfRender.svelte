<script>
	import { onMount } from 'svelte';
	import * as pdfjsLib from 'pdfjs-dist/build/pdf';

	pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

	export let pdfUrl;

	let container;

	async function renderAllPages(url) {
		const loadingTask = pdfjsLib.getDocument(url);
		const pdfDoc = await loadingTask.promise;
		container.innerHTML = ''; // clear container

		for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
			const page = await pdfDoc.getPage(pageNum);

			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');
			const viewport = page.getViewport({ scale: 1.5 });
			canvas.height = viewport.height;
			canvas.width = viewport.width;

			await page.render({ canvasContext: context, viewport }).promise;

			container.appendChild(canvas);
		}
	}

	onMount(() => {
		if (pdfUrl) {
			renderAllPages(pdfUrl);
		}
	});
</script>

<style>
    div#pdf-container {
        overflow-y: auto;
        min-height: 400px;
        border-radius: 5px;
				width: 100%;
				height: 100%;
    }
    canvas {
        display: block;
        margin: 10px auto;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
    }
</style>

<div id="pdf-container" bind:this={container}></div>