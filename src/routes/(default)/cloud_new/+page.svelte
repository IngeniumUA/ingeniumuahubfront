<script lang="ts">
  import Header from '$lib/components/layout/header.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { Filesystem, Directory } from '@capacitor/filesystem';
  import { PUBLIC_API_URL } from '$env/static/public';
  import { getAuthorizationHeaders } from '$lib/auth/auth';


  let PdfRender: any = $state(null);
  let { data } = $props();
  let current_folders: string[] = $state([])
  let current_files: string[][] = $state([])
  let current_metadata: { [key: string]: {last_modified: string} } = $state({})
  let path: string = $state("")
  let openedFile: {open: boolean, url: string, type: string, file: string, blob: Blob | null} = $state({open: false, url: '', type: '', file: '', blob: null})
  let fileHtml = $state('');
  let query = $state('');
  let timeout: ReturnType<typeof setTimeout>;
  let cleared_query = $state(true);
  let loading_file = $state(false);
  let grid_mode = $state(false)

  function get_current_files(update_params=true) {
    query = ''
    openedFile = {open: false, url: '', type: '', file: '', blob: null};
    if (data.file_list === undefined) {return}
    for (const blob of data.file_list) {
      if (blob.startsWith(path)) {
        const blob_in_folder = blob.replace(path, "")
        if (blob_in_folder.includes("/") && !current_folders.includes(blob_in_folder.split("/")[0])) {
          current_folders.push(blob_in_folder.split("/")[0])
        } else if (!blob_in_folder.includes("/")) {
          current_files.push([blob_in_folder, blob])
          getFileMetadata(blob)
        }
      }
    }
    if (update_params) {
      updateSearchParam()
    }
  }

  function search_files(search: string) {
    if (search === "") {
      if (!cleared_query) {
        const url_path = page?.url.searchParams.get('path');
        if (url_path) {
          path = url_path
        } else {
          path = ""
        }
        current_folders = []
        current_files = []
        get_current_files()
        cleared_query = true
      }
      return
    }
    cleared_query = false
    path = ""
    current_folders = []
    current_files= []
    for (const blob of data.file_list) {
      if (blob.toLowerCase().includes(search.toLowerCase())) {
        const split_blob = blob.split("/")
        if (split_blob[split_blob.length - 1].toLowerCase().includes(search.toLowerCase())) {
          current_files.push([split_blob[split_blob.length - 1], blob])
        } else {
          let folder_path = ""
          const folder_path_index = split_blob.findIndex(blob_in_split => blob_in_split.toLowerCase().includes(search.toLowerCase()))
          for (let i = 0; i <= folder_path_index; i++) {
            folder_path = folder_path + split_blob[i] + "/"
          }
          folder_path = folder_path.slice(0, folder_path.length - 1)
          if (!current_folders.includes(folder_path)) {
            current_folders.push(folder_path)
          }
        }
      }
    }
  }
  let currentSearch: string | null = null;
  $effect(() => {
    const newSearch = page?.url.searchParams.get('path');
    if (newSearch !== currentSearch) {
      currentSearch = newSearch;
      const url_path = page?.url.searchParams.get('path');
      current_folders = []
      current_files= []
      if (url_path) {
        path = url_path
        if (!url_path.includes('.')) {
          get_current_files(false)
        }
      } else {
        path = ""
        get_current_files(false)
      }
    }

    const q = query;
    clearTimeout(timeout); // clear any previous debounce
    timeout = setTimeout(() => {
      search_files(q);
    }, 300); // 300ms debounce
  });

  onMount(async ()=>{
    const module = await import('$lib/components/cloud/PdfRender.svelte');
    PdfRender = module.default;

    const url_path = page?.url.searchParams.get('path');
    if (url_path) {
      path = url_path
      if (url_path.includes('.')) {
        await downloadAndOpenFile(url_path)
      } else {
        get_current_files()
      }
    } else {
      get_current_files()
    }
  })

  function openSubFolder(folder: string) {
    path = path + folder + "/"
    current_folders = []
    current_files= []
    get_current_files()
  }

  function openSpecificFolder(folder_pos_in_array: number, folder_name: string) {
    if ((path.endsWith(folder_name + '/') && folder_name !== "") || folder_name.includes(".")) {return}
    const pathlist = path.slice(0, path.length - 2).split("/")
    let temppath = ""
    for (let i = 0; i < folder_pos_in_array+1; i++) {
      temppath = temppath + pathlist[i] + "/"
    }
    path = temppath
    current_folders = []
    current_files= []
    get_current_files()
  }

  function backFolder() {
    const pathlist = path.slice(0, path.length - 2).split("/")
    let temppath = ""
    for (let i = 0; i < pathlist.length-1; i++) {
      temppath = temppath + pathlist[i] + "/"
    }
    path = temppath
    current_folders = []
    current_files= []
    get_current_files()
  }

  function updateSearchParam() {
    const url = new URL(page.url);
    url.searchParams.set('path', path);
    goto(`${url.pathname}?${url.searchParams.toString()}`, { keepFocus: true, replaceState: false });
  }


  async function downloadAndOpenFile(file: string) {
    let response
    try {
      response = await fetch(`${PUBLIC_API_URL}/cloud/get_file/${file}?being_downloaded=false`, {
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

		// Open the file locally
		if (checkFileType(file, [".pdf", ".jpg", ".png", ".jpeg", ".txt", ".csv", ".docx", ".odt", ".md", ".markdown", ".tex"])) {
      const blob = await response.blob();
      let url = URL.createObjectURL(blob);
			loading_file = true
			path = file
			current_folders = []
			current_files= []
			updateSearchParam()

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

			openedFile = {open: true, url: url, type: blob.type, file: file, blob: blob};
      URL.revokeObjectURL(url);
			loading_file = false
			return
		}

    try {
      const arrayBuffer = await response.arrayBuffer();
      const base64Data = await arrayBufferToBase64Async(arrayBuffer);
      const fileName = file.split("/")[file.split("/").length - 1];
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents
      });
      alert('Het bestand werd gedownload.');
    } catch (error) {
      alert(error);
    }
  }
  function arrayBufferToBase64Async(buffer: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([buffer]);
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1]; // remove the "data:*/*;base64," prefix
        resolve(base64String);
      };

      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  }
  async function downloadFile(file: string) {
    let response
    try {
      response = await fetch(`${PUBLIC_API_URL}/cloud/get_file/${file}?being_downloaded=true`, {
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

		try {
			const arrayBuffer = await response.arrayBuffer();
			const base64Data = await arrayBufferToBase64Async(arrayBuffer);
			const fileName = file.split("/")[file.split("/").length - 1];
			await Filesystem.writeFile({
				path: fileName,
				data: base64Data,
				directory: Directory.Documents
			});
			alert('Het bestand werd gedownload.');
		} catch (error) {
			alert(error);
		}
	}
	function downloadFileWithUrl(url: string, file: string) {
		downloadFile(file)
	}

  async function getFileMetadata(file: string) {
    try {
      const metadata = await fetch(`${PUBLIC_API_URL}/cloud/get_file_metadata/${file}`, {  // let backend know a file is being downloaded
        method: 'GET',
        headers: getAuthorizationHeaders(null)
      });
      current_metadata[file] = await metadata.json();
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  function checkFileType(file: string, allowed_types: string[]) {
    for (const allowed_type of allowed_types) {
      if (file.endsWith(allowed_type)) {
        return true
      }
    }
    return false
  }

  function isPathEmpty() {
    return path === ""
  }
  function splitPath() {
    return path.split("/")
  }
  function pathHasFile() {
    return path.includes(".")
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

</script>

<svelte:head>
  <title>Cloud | Ingenium UA</title>
</svelte:head>

<header>
  <Header whiteTheme={true} />
</header>

<main class="ingenium-container relative h-full" id="main-content">
  <div class="flex flex-col items-center">
    <h1>De cloud is voor studenten, van studenten. Upload zelf ook studiemateriaal!</h1>
    <div class="flex-row flex-1">
      <a href="https://forms.gle/CoXVk2Rwk5QMKYLU6" target="_blank" rel="noopener" class="button button-primary button-sm my-4">
        Zelf bestanden uploaden
      </a>
      <a href="https://forms.gle/ExgeXheiDvoip2AZ9" target="_blank" rel="noopener" class="button button-education button-sm my-4">
        Geef feedback!
      </a>
    </div>
  </div>

  <div class="style_buttons">
    <button onclick="{()=>{grid_mode = true}}" class="{grid_mode ? 'style_button_selected' : 'style_button_deselected'}" aria-label="grid">
      <svg class="w-6 h-6 text-gray-800 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z" clip-rule="evenodd"/>
      </svg>
    </button>
    <button onclick="{()=>{grid_mode = false}}" class="{!grid_mode ? 'style_button_selected' : 'style_button_deselected'}" aria-label="list">
      <svg class="w-6 h-6 text-gray-800 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"/>
      </svg>
    </button>
  </div>
  <div class="cloud_container">
    <div class="breadcrumb">
      <p>Map:</p>
      <button class="breadcrumb-button-link" onclick="{()=>{openSpecificFolder(-1, '')}}">Cloud</button>
      {#if splitPath().length > 1 || pathHasFile()}
        <p>/</p>
      {/if}
      {#each splitPath() as folder, i (folder)}
        <button class="breadcrumb-button-link" onclick="{()=>{openSpecificFolder(i, folder)}}">{folder}</button>
        {#if (i < splitPath().length - 2 || pathHasFile()) &&  !folderIsFile(folder)}
          <p>/</p>
        {/if}
      {/each}
      {#if openedFile.open}
        <div class="ml-auto pr-2">
          <button type="button" onclick="{()=>{downloadFileWithUrl(openedFile.url, openedFile.file)}}" class="button button-education button-icon button-icon-only cursor-pointer" aria-label="download">
            <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      {/if}
    </div>
    <div class="breadcrumb form-field">
      <input type="text" bind:value={query} placeholder="Zoeken in de cloud">
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
          <PdfRender pdfBlob={openedFile.blob}></PdfRender>
        {:else}
          <embed title="cloud bestand" src={openedFile.url} width="100%" height="100%" style="min-height: 400px; border-radius: 5px">
        {/if}
      </div>
    {:else}
      {#if loading_file}
        <p>We zijn je bestand aan het openen...</p>
      {:else}
        {#if data.file_list === undefined}
          <p>We zijn de cloud aan het laden...</p>
        {/if}

        <div class="browse_file_container_{grid_mode ? 'grid' : 'list'}">
          {#if !isPathEmpty()}
            <div class="icon-text-wrapper-{grid_mode ? 'grid' : 'list'}" onclick="{()=>{backFolder()}}" onkeyup={()=>{}} role="button" tabindex="0">
              <svg onclick="{()=>{backFolder()}}" style="cursor: pointer" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="m15 19-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <button class="icon-text-{grid_mode ? 'grid' : 'list'}" onclick="{()=>{backFolder()}}">Terug</button>
            </div>
          {/if}
          {#each current_folders as folder}
            <div class="icon-text-wrapper-{grid_mode ? 'grid' : 'list'}"  onclick="{()=>{openSubFolder(folder)}}" onkeyup={()=>{}} role="button" tabindex="0">
              <svg onclick="{()=>{openSubFolder(folder)}}" style="cursor: pointer" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <button class="icon-text-{grid_mode ? 'grid' : 'list'}" onclick="{()=>{openSubFolder(folder)}}">{folder}</button>
            </div>
          {/each}
          {#each current_files as file}
            <div class="icon-text-wrapper-{grid_mode ? 'grid' : 'list'}" onclick="{()=>{downloadAndOpenFile(file[1])}}" onkeyup={()=>{}} role="button" tabindex="0">
              <svg onclick="{()=>{downloadAndOpenFile(file[1])}}" style="cursor: pointer" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <button class="icon-text-{grid_mode ? 'grid' : 'list'}" onclick="{()=>{downloadAndOpenFile(file[1])}}">{file[0]}</button>
              {#if !grid_mode}
                <div class="ml-auto">
                  {#if current_metadata[file[1]] !== null && current_metadata[file[1]] !== undefined}
                    <button type="button" onclick="{()=>{downloadAndOpenFile(file[1])}}">{current_metadata[file[1]].last_modified.split("T")[0].split("-").reverse().join("/")}</button>
                  {/if}
                </div>
                <div class="ml-auto pr-2 pl-2 leftline">
                  <button type="button" onclick="{()=>{downloadFile(file[1])}}" class="button button-education button-icon button-icon-only cursor-pointer" aria-label="download">
                    <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clip-rule="evenodd"/>
                      <path fill-rule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </div>
              {/if}
            </div>
          {/each}
        </div>
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
  .style_button_deselected {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: background 0.2s;
  }
  .style_button_selected {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: background 0.2s;
    background-color: #f5f5f5;
  }
  .style_button_deselected:hover {
    background-color: #f5f5f5;
  }
  .leftline {
    @media (min-width: 500px) {
      border-left: 2px solid #ddd;
    }
    @media (max-width: 500px) {
      visibility: hidden;
      width: 0;
      padding: 0;
      margin: 0;
    }
  }

  .cloud_container {
    touch-action: pinch-zoom;
    display: flex;
    flex-direction: column;
    height: 120vh;
    border: 2px solid lightgray;
    border-radius: 10px;
  }

  .browse_file_container_grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 1rem;
    overflow-y: auto;
    padding: 0.5rem;
    box-sizing: border-box;
    /*flex: 1;*/
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

  .icon-text-wrapper-grid {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .icon-text-wrapper-grid:hover {
    background-color: #f5f5f5;
  }

  .icon-text-grid {
    padding: 0.01rem 0.05rem;
    max-width: 70px;
    margin-top: 0.1rem;
    text-align: center;
    word-wrap: break-word;
    white-space: normal;
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