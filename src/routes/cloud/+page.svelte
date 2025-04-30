<script lang="ts">
  import Header from '$lib/components/layout/header.svelte';
  import { onMount } from 'svelte';

  let { data } = $props();
  let current_folders: string[] = $state([])
  let current_files: string[] = $state([])
  let path: string = $state("")

  function get_current_files() {
    if (data.file_list === undefined) {return}
    for (const blob of data.file_list) {
      if (blob.name.startsWith(path)) {
        const blob_in_folder = blob.name.replace(path, "")
        if (blob_in_folder.includes("/") && !current_folders.includes(blob_in_folder.split("/")[0])) {
          current_folders.push(blob_in_folder.split("/")[0])
        } else if (!blob_in_folder.includes("/")) {
          current_files.push(blob_in_folder)
        }
      }
    }
  }

  onMount(()=>{
    get_current_files()
  })

  function openSubFolder(folder: string) {
    path = path + folder + "/"
    current_folders = []
    current_files= []
    get_current_files()
  }


  async function downloadFile(file: string) {
    const response = await fetch(`https://ingeniumuacloud.blob.core.windows.net/cloud/${file}?${data.cloud_sas}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    <h1>Gebruik password: Ingenium2018</h1>
    <h2>De cloud is voor studenten, van studenten. Upload zelf ook studiemateriaal!</h2>
    <a href="https://forms.gle/CoXVk2Rwk5QMKYLU6" target="_blank" rel="noopener" class="button button-primary button-sm my-4">
      Zelf bestanden uploaden
    </a>
  </div>

  <div class="cloud_container">
    {#each current_files as file}
      <div class="icon-text-wrapper">
        <svg onclick="{()=>{downloadFile(file)}}" style="cursor: pointer" height="8vw" width="8vw" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <button class="icon-text" onclick="{()=>{downloadFile(file)}}">{file}</button>
      </div>
    {/each}
    {#each current_folders as folder}
      <div class="icon-text-wrapper">
        <svg onclick="{()=>{openSubFolder(folder)}}" style="cursor: pointer" height="8vw" width="8vw" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <button class="icon-text" onclick="{()=>{openSubFolder(folder)}}">{folder}</button>
      </div>
    {/each}
  </div>

</main>

<style>
  .cloud_container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(8vw, 1fr));
    gap: 1rem;
    overflow-y: auto;
    height: 90vh;
    border: 2px solid lightgray;
    border-radius: 10px;
    padding: 1rem;
  }

  .icon-text-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  .icon-text {
    max-width: 8vw;
    margin-top: 0.1rem;
    text-align: center;
    word-wrap: break-word;
    white-space: normal;
  }
</style>