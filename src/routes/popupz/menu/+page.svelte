<script lang="ts">
	import type { ProductOutI } from '$lib/models/productsI';
	import type { ItemWideLimitedI } from '$lib/models/item/itemwideI';

	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();

	let categories: string[] = $state(["All", "Food", "Drinks", "Tickets"]);
	let selectedCategory: string = $state("All");

	let item: ItemWideLimitedI = $state(data.item);
	let products: ProductOutI[] = $state(data.products);

	function getOrdering(ProductOutI: ProductOutI): number {
		return 0
	}

	let showProducts: ProductOutI[] = $derived.by(() => {
		const productsForCategory = products.filter(prod => {return prod.product_meta.categorie == selectedCategory})
		// productsForCategory.sort(
		// 	(lhs, rhs) => {return getOrdering(lhs) getOrdering(rhs)}
		// )
		return productsForCategory;
	})

	/**
	 * @param category
	 */
	function setCategory(category: string) {
		selectedCategory = category;
	}
</script>

<style>
	nav {
			@apply flex flex-row pb-2;
      background-color: #404466;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;

      button {
          @apply flex-1 flex justify-center items-center p-3;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;

					h3 {
							@apply font-bold text-white;
					}
			}

			.selected {
					@apply bg-white;
					h3 {
              color: #404466;
					}
			}
	}

	section {
		@apply m-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-cols-fr;

		.product-card {
				@apply bg-white p-4 rounded-lg max-w-xs min-h-48 shadow-md hover:shadow-lg transition-shadow;

				h3 {
						@apply font-bold ;
				}
		}
	}
</style>

<main>
	<!-- Menu	-->
	<div class="flex items-center justify-center">
		<h1 class="text-3xl underline">Our Menu</h1>
	</div>

	<!-- Category Selector -->
	<nav>
		{#each categories as category}
		<button
			class="{category === selectedCategory ? 'selected': ''}"
			onclick="{() => setCategory(category)}">
			<h3>{category}</h3>
		</button>
		{/each}
	</nav>

	<!-- Product Selector	-->
	{#if products.length > 0}
	<section>
		{#each products as product}
			<div class="product-card">
				<h3>{product.name}</h3>

				<div class="flex justify-end items-center">
					<button class="button button-primary w-32 button-inline">
						<span>Bestel nu ▶</span>
					</button>
				</div>
			</div>
		{/each}
	</section>
	{:else}
	<div class="w-screen h-max flex items-center justify-center">
		<div class="pt-8">
			<h1>De Shop staat niet aan!</h1>
			<h2>'t Zal weer de schuld van de webmaster zijn</h2>
		</div>
	</div>
	{/if}
</main>