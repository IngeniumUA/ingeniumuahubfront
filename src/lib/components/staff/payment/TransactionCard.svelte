<script lang="ts">
	import type { TransactionI } from '$lib/models/transactionI';
	import { ValidityEnum } from '$lib/models/productsI';

	let { isOpen = $bindable(), loadingHTTP = $bindable(), transaction = $bindable(), transactionIndex = null }: { isOpen: boolean, loadingHTTP: boolean, transaction: TransactionI, transactionIndex: number | null } = $props();


	let putError: Error | null = $state(null);
	async function update() {
		if (loadingHTTP) {return}
		// todo check for form errors
	}
</script>


<div class="flex justify-between items-center">
	<h4 class="text-ingenium-grey-800 font-bold">
		{#if transactionIndex !== null}{(transactionIndex ?? 0) + 1}){/if} {transaction.product_blueprint_name} at
		{#if transaction.purchased_product.price_policy?.name !== null}{transaction.purchased_product.price_policy?.name} -{/if}
		{#if transaction.purchased_product.price_policy?.price === 0}Gratis{:else}€{transaction.purchased_product.price_policy?.price}{/if}
	</h4>

	<div class="transaction-validity-selector">
		{ValidityEnum[transaction.validity]}
	</div>



	<button type="button" class="button button-primary button-icon-only relative inline-flex items-center justify-center"
					aria-controls="mobile-menu" aria-expanded="{isOpen}"
					onclick={ () => isOpen = !isOpen }
	>
		<span class="sr-only">Open navigatie</span>
		{#if isOpen}
			<svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		{:else}
			<svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
			</svg>
		{/if}
	</button>
</div>
{#if isOpen}
		<form class="ingenium-form flex flex-row gap-4">
		</form>

	<div class="mt-4 flex justify-end">
		<button class="button button-primary button-inline" onclick={update}>
			<span class="text-white">Update</span>
		</button>
	</div>

	{#if (putError !== null)}
		<div class="error-message p-4">
			{JSON.stringify(putError)}
		</div>
	{/if}
{/if}

<style>
	.transaction-validity-selector {
			@apply flex flex-row ml-auto;

			input {
					@apply py-4 px-8 rounded-none
			}

      /* Hide the actual radio buttons */
      .transaction-validity-selector input[type="radio"] {
          display: none;
      }

      /* Style the label to look like a button */
      .transaction-validity-selector label {
          padding: 10px 20px;
          border: 2px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease-in-out;
          user-select: none;
          text-align: center;
          min-width: 100px;
      }

      /* When the radio is selected, style the label as active */
      .transaction-validity-selector input[type="radio"]:checked + label {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
          font-weight: bold;
      }
	}
</style>