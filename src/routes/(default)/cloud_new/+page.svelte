<script lang="ts">
  import Header from '$lib/components/layout/header.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import mammoth from 'mammoth';
  import { PUBLIC_API_URL } from '$env/static/public';
  import { getAuthorizationHeaders } from '$lib/auth/auth';


  let { data } = $props();
  let current_folders: string[] = $state([])
  let current_files: string[][] = $state([])
  let path: string = $state("")
  let openedFile: {open: boolean, url: string, type: string, file: string} = $state({open: false, url: '', type: '', file: ''})
  let fileHtml = $state('');
  let query = $state('');
  let timeout: ReturnType<typeof setTimeout>;
  let cleared_query = $state(true);

  function get_current_files() {
    query = ''
    openedFile = {open: false, url: '', type: '', file: ''};
    if (data.file_list === undefined) {return}
    for (const blob of data.file_list) {
      if (blob.startsWith(path)) {
        const blob_in_folder = blob.replace(path, "")
        if (blob_in_folder.includes("/") && !current_folders.includes(blob_in_folder.split("/")[0])) {
          current_folders.push(blob_in_folder.split("/")[0])
        } else if (!blob_in_folder.includes("/")) {
          current_files.push([blob_in_folder, blob])
        }
      }
    }
    updateSearchParam()
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
  $effect(() => {
    const q = query;
    clearTimeout(timeout); // clear any previous debounce
    timeout = setTimeout(() => {
      search_files(q);
    }, 300); // 300ms debounce
  });

  onMount(()=>{
    const url_path = page?.url.searchParams.get('path');
    if (url_path) {
      path = url_path
      if (url_path.includes('.')) {
        downloadOrOpenFile(url_path)
      } else {
        get_current_files()
      }
    } else {
      get_current_files()
    }
  })

  onDestroy(() => {
    URL.revokeObjectURL(openedFile.url);
  });

  function openSubFolder(folder: string) {
    path = path + folder + "/"
    current_folders = []
    current_files= []
    get_current_files()
  }

  function openSpecificFolder(folder_pos_in_array: number, folder_name: string) {
    URL.revokeObjectURL(openedFile.url);
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
    goto(`${url.pathname}?${url.searchParams.toString()}`, { keepFocus: true, replaceState: true });
  }


  async function downloadOrOpenFile(file: string) {
    let response
    try {
      response = await fetch(`${PUBLIC_API_URL}/cloud/get_file/${file}`, {
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
    if (checkFileType(file, [".pdf", ".jpg", ".png", ".jpeg", ".txt", ".csv", ".docx"])) {
      path = file
      current_folders = []
      current_files= []
      updateSearchParam()

      if (checkFileType(file, [".docx"])) {
        const arrayBuffer = await blob.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        fileHtml = result.value;
      }

      openedFile = {open: true, url: url, type: blob.type, file: file};
      return
    }

    // Download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = file;
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
  function fileIsDocx(file: string) {
    return checkFileType(file, [".docx"])
  }
  function fileIsImg(file: string) {
    return checkFileType(file, [".jpg", ".png", ".jpeg"])
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
    <a href="https://forms.gle/CoXVk2Rwk5QMKYLU6" target="_blank" rel="noopener" class="button button-primary button-sm my-4">
      Zelf bestanden uploaden
    </a>
  </div>

  <div class="cloud_container">
    <div class="breadcrumb">
      <p>Map:</p>
      <button onclick="{()=>{openSpecificFolder(-1, '')}}">Cloud</button>
      {#if splitPath().length > 1 || pathHasFile()}
        <p>/</p>
      {/if}
      {#each splitPath() as folder, i (folder)}
        <button onclick="{()=>{openSpecificFolder(i, folder)}}">{folder}</button>
        {#if (i < splitPath().length - 2 || pathHasFile()) &&  !folderIsFile(folder)}
          <p>/</p>
        {/if}
      {/each}
    </div>
    <div class="breadcrumb form-field">
      <input type="text" bind:value={query} placeholder="Zoeken in de cloud">
    </div>
    {#if openedFile.open}
      <div class="file_container">
        {#if fileIsDocx(openedFile.file)}
          {@html fileHtml}
        {:else if fileIsImg(openedFile.file)}
          <img src="{openedFile.url}" alt="Cloud">
        {:else}
          <iframe title="cloud bestand" src={openedFile.url} width="100%" height="100%" style="min-height: 400px; border-radius: 5px"></iframe>
        {/if}
      </div>
    {:else}
      <div class="browse_file_container">
        {#if !isPathEmpty()}
          <div class="icon-text-wrapper">
            <svg onclick="{()=>{backFolder()}}" style="cursor: pointer" height="100px" width="100px" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m15 19-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <button class="icon-text" onclick="{()=>{backFolder()}}">Terug</button>
          </div>
        {/if}
        {#each current_folders as folder}
          <div class="icon-text-wrapper">
            <svg onclick="{()=>{openSubFolder(folder)}}" style="cursor: pointer" height="100px" width="100px" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <button class="icon-text" onclick="{()=>{openSubFolder(folder)}}">{folder}</button>
          </div>
        {/each}
        {#each current_files as file}
          <div class="icon-text-wrapper">
            <svg onclick="{()=>{downloadOrOpenFile(file[1])}}" style="cursor: pointer" height="100px" width="100px" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <button class="icon-text" onclick="{()=>{downloadOrOpenFile(file[1])}}">{file[0]}</button>
          </div>
        {/each}
      </div>
    {/if}
  </div>

</main>

<style>
  .cloud_container {
    display: flex;
    flex-direction: column;
    height: 120vh;
    border: 2px solid lightgray;
    border-radius: 10px;
  }

  .browse_file_container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
    overflow-y: auto;
    padding: 1rem;
    box-sizing: border-box;
    flex: 1;
  }

  .file_container {
    height: 100%;
    gap: 1rem;
    overflow-y: auto;
    padding: 1rem;
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
  .breadcrumb button {
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

  .icon-text-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  .icon-text {
    max-width: 100px;
    margin-top: 0.1rem;
    text-align: center;
    word-wrap: break-word;
    white-space: normal;
  }
</style>