<script lang="ts">
  let { isOpen = $bindable(false), closable = true,
    title = 'Modal title', children
  } = $props();
</script>

<div class="relative z-50" class:hidden={ !isOpen } aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
      <!-- Modal content -->
      <div class="relative min-w-8 w-screen max-w-lg bg-white rounded-lg shadow-sm">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{ title }</h3>
          {#if closable}
            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    onclick={ () => isOpen = false }>
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span class="sr-only">Popup sluiten</span>
            </button>
          {/if}
        </div>

        {@render children?.()}
      </div>
    </div>
  </div>
</div>