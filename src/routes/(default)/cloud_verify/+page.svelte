<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';
	import Modal from '$lib/components/layout/modal.svelte';


	let PdfRender: any = $state(null);
	let { data } = $props();
	let openedFile: {open: boolean, url: string, type: string, file: string} = $state({open: false, url: '', type: '', file: ''})
	let fileHtml = $state('');
	let loading_file = $state(false);
	let isLocationModalOpen = $state(false);
	let folder_tree: any = {}
	let current_folders_select: string[] = $state([]);
	let folder_path: string = $state("")
	let selected_folder_path: string = $state("")
	let file_index: number = $state(0)
	let deleted_files: string[] = []
	let open_attempts: number = 0


	onMount(()=>{
		(async () => {
			const module = await import('$lib/components/cloud/PdfRender.svelte');
			PdfRender = module.default;

			get_folder_tree()

			await openFile(data.file_list[file_index])
			selected_folder_path = data.file_list[file_index]
		})();
	})

	onDestroy(() => {
		URL.revokeObjectURL(openedFile.url);
	});

	async function openFile(file: string, from_next: boolean = true) {
		if (data.file_list.length === 0) {return}
		if (deleted_files.includes(file)) {
			open_attempts++;
			if (open_attempts >= data.file_list.length) {
				location.reload()
				return
			}
			if (from_next) {await nextFile()} else {await prevFile()}
			return
		}
		URL.revokeObjectURL(openedFile.url);
		openedFile = {open: false, url: '', type: '', file: ''};
		selected_folder_path = data.file_list[file_index]
		let response
		try {
			response = await fetch(`${PUBLIC_API_URL}/cloud/get_review_file/${file}`, {
				method: 'GET',
				headers: getAuthorizationHeaders(null)
			});
		} catch (err) {
			console.error('Fetch error:', err);
		}

		if (!response) {
			alert('No response from the server');
			return;
		}
		if (!response.ok) {
			alert('Failed to fetch the file: ' + response.statusText);
			return;
		}

		const blob = await response.blob();
		let url = URL.createObjectURL(blob);

		// Open the file locally
		if (fileIsOpenable(file)) {
			loading_file = true

			if (fileIsConverted(file)) {
				try {
					const formData = new FormData();
					formData.append('file', blob, file);
					const res = await fetch(`${PUBLIC_API_URL}/cloud/convert`, {
						method: 'POST',
						headers: getAuthorizationHeaders(null),
						body: formData
					});

					if (!res.ok) {
						const { error } = await res.json();
						alert(error || 'Unknown error');
					}

					const data = await res.json();
					fileHtml = data.html;
				} catch (err) {
					console.error('Fetch error:', err);
				}
			}

			openedFile = {open: true, url: url, type: blob.type, file: file};
			loading_file = false
			return
		}
	}
	async function downloadFile(file: string) {
		if (fileIsOpenable(file)) {return}
		let response
		try {
			response = await fetch(`${PUBLIC_API_URL}/cloud/get_review_file/${file}`, {
				method: 'GET',
				headers: getAuthorizationHeaders(null)
			});
		} catch (err) {
			console.error('Fetch error:', err);
		}

		if (!response) {
			alert('No response from the server');
			return;
		}
		if (!response.ok) {
			alert('Failed to fetch the file: ' + response.statusText);
			return;
		}

		const blob = await response.blob();
		let url = URL.createObjectURL(blob);

		// Download the file
		const a = document.createElement('a');
		a.href = url;
		a.download = file.split("/").reverse()[0];
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function checkFileType(file: string, allowed_types: string[]) {
		for (const allowed_type of allowed_types) {
			if (file.endsWith(allowed_type)) {
				return true
			}
		}
		return false
	}

	async function get_folder_tree() {
		let response
		try {
			response = await fetch(`${PUBLIC_API_URL}/cloud/get_file/folder_tree.json?being_downloaded=false`, {
				method: 'GET',
				headers: getAuthorizationHeaders(null)
			});
		} catch (err) {
			console.error('Fetch error:', err);
		}

		if (!response) {
			alert('No response from the server');
			return;
		}
		if (!response.ok) {
			alert('Failed to fetch the file: ' + response.statusText);
			return;
		}

		folder_tree = await response.json();
		folder_tree = {"": folder_tree}
	}


	function openSelectFolder() {
		openSubFolderSelect("")
		isLocationModalOpen = true;
	}

	function get_current_location_folders() {
		current_folders_select = []

		let parts: string[] = []
		parts = parts.concat([""], folder_path.split('/'));
		parts.pop()
		let current = folder_tree;

		for (const part of parts) {
			if (!current || !(part in current)) {
				return;
			}
			current = current[part];
		}

		const current_folder = Object.keys(current);

		for (const iter_folder of current_folder) {
			current_folders_select.push(iter_folder)
		}
	}

	function openSubFolderSelect(folder: string) {
		if (folder !== "") {
			folder_path = folder_path + folder + "/"
		}
		get_current_location_folders()
	}

	function backLocationFolder() {
		const pathlist = folder_path.slice(0, folder_path.length - 2).split("/")
		let temppath = ""
		for (let i = 0; i < pathlist.length-1; i++) {
			temppath = temppath + pathlist[i] + "/"
		}
		folder_path = temppath
		get_current_location_folders()
	}

	function openSpecificLocationFolder(folder_pos_in_array: number, folder_name: string) {
		if ((folder_path.endsWith(folder_name + '/') && folder_name !== "") || folder_name.includes(".")) {return}
		const pathlist = folder_path.slice(0, folder_path.length - 2).split("/")
		let temppath = ""
		for (let i = 0; i < folder_pos_in_array+1; i++) {
			temppath = temppath + pathlist[i] + "/"
		}
		folder_path = temppath
		get_current_location_folders()
	}

	function confirmFolderSelect() {
		selected_folder_path = folder_path;
		selected_folder_path = selected_folder_path + data.file_list[file_index].split('/').reverse()[0]
		isLocationModalOpen = false
	}
	async function nextFile() {
		URL.revokeObjectURL(openedFile.url);
		file_index++
		if (file_index >= data.file_list.length) {
			file_index = 0;
		}
		await openFile(data.file_list[file_index])
	}

	async function prevFile() {
		URL.revokeObjectURL(openedFile.url);
		file_index--
		if (file_index < 0) {
			file_index = data.file_list.length - 1
		}
		await openFile(data.file_list[file_index])
	}

	async function acceptFile() {
		let response
		const formData = new FormData();
		formData.append('reviewed_file_name', data.file_list[file_index]);
		formData.append('upload_file_name', selected_folder_path)
		try {
			response = await fetch(`${PUBLIC_API_URL}/cloud/transfer_reviewed_file`, {
				method: 'POST',
				headers: getAuthorizationHeaders(null),
				body: formData
			});
		} catch (err) {
			console.error('Fetch error:', err);
		}

		if (!response) {
			alert('No response from the server');
			return;
		}
		if (!response.ok) {
			alert('Failed to fetch the file: ' + response.statusText);
			return;
		}

		await deleteFile()

	}

	async function deleteFile() {
		deleted_files.push(data.file_list[file_index])

		let response
		try {
			response = await fetch(`${PUBLIC_API_URL}/cloud/delete_reviewed_file/${data.file_list[file_index]}`, {
				method: 'POST',
				headers: getAuthorizationHeaders(null),
			});
		} catch (err) {
			console.error('Fetch error:', err);
		}

		if (!response) {
			alert('No response from the server');
			return;
		}
		if (!response.ok) {
			alert('Failed to fetch the file: ' + response.statusText);
			return;
		}

		await nextFile()
	}


	function folderIsFile(folder: string) {
		return folder.includes(".")
	}
	function fileIsConverted(file: string) {
		return checkFileType(file, [".docx", ".odt", ".md", ".markdown", ".tex"])
	}
	function fileIsImg(file: string) {
		return checkFileType(file, [".jpg", ".png", ".jpeg"])
	}
	function fileIsPdf(file: string) {
		return checkFileType(file, [".pdf"])
	}
	function fileIsOpenable(file: string) {
		return checkFileType(file, [".pdf", ".jpg", ".png", ".jpeg", ".txt", ".csv", ".docx", ".odt", ".md", ".markdown", ".tex"])
	}
	function isLocationPathEmpty() {
		return folder_path === ""
	}
	function splitLocationPath() {
		return folder_path.split("/")
	}
	function locationPathHasFile() {
		return folder_path.includes(".")
	}

</script>

<svelte:head>
	<title>Cloud | Ingenium UA</title>
</svelte:head>

<header>
	<Header whiteTheme={true} />
</header>


<Modal title="Locatie kiezen" bind:isOpen={ isLocationModalOpen }>
	{#snippet children()}
		<div class="p-4 md:p-5">
			<div class="cloud_container" style="height: 40vh">
				<div class="breadcrumb">
					<p>Locatie:</p>
					<button class="breadcrumb-button-link" onclick="{()=>{openSpecificLocationFolder(-1, '')}}">Cloud</button>
					{#if splitLocationPath().length > 1 || locationPathHasFile()}
						<p>/</p>
					{/if}
					{#each splitLocationPath() as folder, i (folder)}
						<button class="breadcrumb-button-link" onclick="{()=>{openSpecificLocationFolder(i, folder)}}">{folder}</button>
						{#if (i < splitLocationPath().length - 2 || locationPathHasFile()) &&  !folderIsFile(folder)}
							<p>/</p>
						{/if}
					{/each}
				</div>
				<div class="browse_file_container_list">
					{#if !isLocationPathEmpty()}
						<button class="icon-text-wrapper-list"  onclick="{()=>{backLocationFolder()}}">
							<svg style="cursor: pointer" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="m15 19-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"></path>
							</svg>
							<span class="icon-text-list">Terug</span>
						</button>
					{/if}
					{#each current_folders_select as folder}
						<button class="icon-text-wrapper-list" onclick="{()=>{openSubFolderSelect(folder)}}">
							<svg style="cursor: pointer" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z" stroke-linecap="round" stroke-linejoin="round"></path>
							</svg>
							<span class="icon-text-list">{folder}</span>
						</button>
					{/each}
				</div>
			</div>
			<div class="form-field pt-4">
				<button type="button" class="button button-primary button-full" onclick="{()=>{confirmFolderSelect()}}">Huidige locatie selecteren</button>
			</div>
		</div>
	{/snippet}
</Modal>

<main class="ingenium-container relative h-full" id="main-content">

	<div class="style_buttons">
		<button onclick="{()=>{prevFile()}}" class="style_button" aria-label="grid">
			<svg class="w-6 h-6 text-gray-800 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/>
			</svg>
		</button>
		<button onclick="{()=>{nextFile()}}" class="style_button" aria-label="list">
			<svg class="w-6 h-6 text-gray-800 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
			</svg>
		</button>
	</div>
	<div class="cloud_container">

		<div class="breadcrumb">
			<button type="button" class="button button-outline-blue button-sm pr-2" onclick="{()=>{acceptFile()}}">Accepteren</button>
			<button type="button" class="button button-outline-blue button-sm pr-2" onclick="{()=>{openSelectFolder()}}">Kies locatie</button>
			<button type="button" class="button button-outline-blue button-sm pr-2" onclick="{()=>{deleteFile()}}">Afwijzen</button>
			<button type="button" onclick="{()=>{downloadFile(data.file_list[file_index])}}" class="button button-education button-icon button-icon-only cursor-pointer" aria-label="download">
				<svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
					<path fill-rule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clip-rule="evenodd"/>
					<path fill-rule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd"/>
				</svg>
			</button>
			<br>
			<h3>Cloud/{selected_folder_path}</h3>
		</div>
		{#if openedFile.open}
			<div class="file_container">
				{#if fileIsConverted(openedFile.file)}
					<iframe
						title="cloud document"
						srcdoc={fileHtml}
						style="width: 100%; height: 100%; border: none; min-height: 400px; border-radius: 5px"
						sandbox="allow-same-origin allow-scripts"
					></iframe>
				{:else if fileIsImg(openedFile.file)}
					<img src="{openedFile.url}" alt="Cloud">
				{:else if fileIsPdf(openedFile.file)}
					<PdfRender pdfUrl={openedFile.url}></PdfRender>
				{:else}
					<embed title="cloud bestand" src={openedFile.url} width="100%" height="100%" style="min-height: 400px; border-radius: 5px">
				{/if}
			</div>
		{:else}
			{#if loading_file}
				<p>We zijn je bestand aan het openen...</p>
			{/if}
		{/if}
	</div>

</main>

<style>
    .style_buttons {
        display: flex;
        width: fit-content;
        flex-direction: row;
        margin-bottom: 0.25rem;
        /*padding: 0.5rem 1rem;*/
        /*border: 1px solid #ddd;*/
        /*border-radius: 6px;*/
        /*transition: background 0.2s;*/
    }
    .style_button {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        transition: background 0.2s;
    }
    .style_button:hover {
        background-color: #f5f5f5;
    }

    .cloud_container {
        touch-action: pinch-zoom;
        display: flex;
        flex-direction: column;
        height: 120vh;
        border: 2px solid lightgray;
        border-radius: 10px;
    }

    .browse_file_container_list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        overflow-y: auto;
        padding: 0.5rem;
        box-sizing: border-box;
    }

    .file_container {
        height: 100%;
        gap: 1rem;
        overflow-y: auto;
        padding: 0.25rem;
        box-sizing: border-box;
        flex: 1;
    }

    .breadcrumb {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        border-bottom: 2px solid lightgray;
        padding-bottom: 0.5rem;
        padding-left: 0.5rem;
        padding-top: 0.5rem;
    }
    .breadcrumb-button-link {
        background: none;
        border: none;
        color: #007bff;
        cursor: pointer;
        font-size: 1rem;
    }
    .breadcrumb p {
        margin: 0;
        font-size: 1rem;
    }

    .icon-text-wrapper-list {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        transition: background 0.2s;
        cursor: pointer;
    }
    .icon-text-wrapper-list svg {
        width: 1.5rem;
        height: 1.5rem;
    }

    .icon-text-wrapper-list:hover {
        background-color: #f5f5f5;
    }

    .icon-text-list {
        max-width: none;
        margin-top: 0;
        text-align: left;
        word-break: break-word;
        white-space: normal;
        flex: 1;
    }
</style>