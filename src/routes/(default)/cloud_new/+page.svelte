<script lang="ts">
  import Header from '$lib/components/layout/header.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { CapacitorHttp } from '@capacitor/core';
  import { Filesystem, Directory } from '@capacitor/filesystem';


  let { data } = $props();
  let current_folders: string[] = $state([])
  let current_files: string[][] = $state([])
  let path: string = $state("")

  function get_current_files() {
    if (data.file_list === undefined) {return}
    for (const blob of data.file_list) {
      if (blob.name.startsWith(path)) {
        const blob_in_folder = blob.name.replace(path, "")
        if (blob_in_folder.includes("/") && !current_folders.includes(blob_in_folder.split("/")[0])) {
          current_folders.push(blob_in_folder.split("/")[0])
        } else if (!blob_in_folder.includes("/")) {
          current_files.push([blob_in_folder, blob.name])
        }
      }
    }
    updateSearchParam()
  }

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
    goto(`${url.pathname}?${url.searchParams.toString()}`, { keepFocus: true, replaceState: true });
  }


  async function downloadOrOpenFile(file: string) {
    const fileUrl = `https://ingeniumuacloud.blob.core.windows.net/cloud/${file}?${data.cloud_sas}`;
    try {
      // Fetch the file as a blob using CapacitorHttp
      const response = await CapacitorHttp.request({
        method: 'GET',
        url: fileUrl,
        responseType: 'blob'
      });

      const blob = response.data as Blob;
      // Convert blob to base64 for saving
      const base64Data = await blobToBase64(blob)
      await Filesystem.writeFile({
        path: file,
        data: base64Data,
        directory: Directory.Documents
      });

    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Download failed');
    }
  }

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onloadend = () => {
        const base64 = reader.result?.toString().split(',')[1]; // remove the data prefix
        resolve(base64 ?? '');
      };
      reader.readAsDataURL(blob);
    });
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
    <div class="browse_file_container">
      {#if !isPathEmpty()}
        <div class="icon-text-wrapper">
          <svg onclick="{()=>{backFolder()}}" style="cursor: pointer" height="100px" width="100px" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m15 19-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <button class="icon-text" onclick="{()=>{backFolder()}}">Terug</button>
        </div>
      {/if}
      {#each current_files as file}
        <div class="icon-text-wrapper">
          <svg onclick="{()=>{downloadOrOpenFile(file[1])}}" style="cursor: pointer" height="100px" width="100px" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <button class="icon-text" onclick="{()=>{downloadOrOpenFile(file[1])}}">{file[0]}</button>
        </div>
      {/each}
      {#each current_folders as folder}
        <div class="icon-text-wrapper">
          <svg onclick="{()=>{openSubFolder(folder)}}" style="cursor: pointer" height="100px" width="100px" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <button class="icon-text" onclick="{()=>{openSubFolder(folder)}}">{folder}</button>
        </div>
      {/each}
    </div>
  </div>

</main>

<style>
  .cloud_container {
    display: flex;
    flex-direction: column;
    height: 90vh;
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