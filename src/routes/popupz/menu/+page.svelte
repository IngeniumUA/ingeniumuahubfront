<script lang="ts">
	import type { PricePolicyLimitedI, ProductFormI, ProductOutI } from '$lib/models/productsI';
	import type { ItemWideLimitedI } from '$lib/models/item/itemwideI';
	import { successToast } from '$lib/components/toast/defined_toast';
	import popupImg from '$assets/images/popupz/popupz_default.png';
	import { slide } from 'svelte/transition';
	import { makePretty } from '$lib/utilities/style-utilities';


	/**
	 * Assigning data from load function in +page.svelte
	 */
	let { data } = $props();

	let categories: string[] = $state(["All", "Food", "Drinks", "Tickets"]);
	let selectedCategory: string = $state("All");

	let products: ProductOutI[] = $state(data.products);

	let groupedProducts = $derived.by(() => {
		const filtered = products.filter(prod => { return selectedCategory === "All" || prod.product_meta.categorie === selectedCategory})

		const grouped = filtered.reduce<Record<number, ProductOutI[]>>((acc, prod) => {
			const key = prod.blueprint_id;
			(acc[key] ||= []).push(prod); // using ||= for brevity
			return acc;
		}, {});

		return Object.entries(grouped).map(([key, value]) => {
			const blueprint = value!.at(0)!
			return {
				product_blueprint_name: blueprint.name,
				origin_item_id: blueprint.origin_item_id,
				form: (blueprint.product_meta.other_meta_data.form as ProductFormI),
				max_count: blueprint.max_count,
				price_policies: value!.filter(prod => prod.price_policy !== null).map(prod => prod.price_policy),
			}
		})
	});

	let item: ItemWideLimitedI = $state(data.item);
	let selectedArray = $state(Array.from({ length: products.length }, () => false));

	/**
	 * @param category
	 */
	function setCategory(category: string) {
		selectedCategory = category;
	}

	/**
	 *
	 */
	function showProduct(index: number) {
		selectedArray[index] = true;
	}
	function addToCard(product, pricePolicy: PricePolicyLimitedI | null) {
		successToast(`${product.product_blueprint_name} toegevoegd!`)
	}

</script>

<style>
	nav {
			@apply flex flex-row pb-2 bg-blue-950 rounded-t-xl;

      button {
          @apply flex-1 flex justify-center items-center p-3 rounded-t-xl;
					h3 {
							@apply font-bold text-white;
					}
			}

			.selected {
					@apply bg-white;
					h3 {
              @apply text-blue-950;
					}
			}
	}

	section {
		@apply m-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-cols-fr bg-gray-100 gap-4;

		.product-card {
				@apply flex flex-col rounded-2xl max-w-xs shadow-md hover:shadow-xl transition-shadow;

				.product-card-image {
						@apply h-36 rounded-t-2xl overflow-hidden;
				}

				.product-card-prices {
						@apply flex flex-col gap-4 border-t-8 border-blue-900 p-4 pl-2;

						.price-policies {
								@apply flex justify-between items-center border-l-8 border-blue-900 pl-2;
						}
				}

				.product-card-content {
					@apply flex-grow p-4 rounded-b-2xl bg-blue-900 flex justify-between items-center;

						h2 {
								@apply font-bold text-white;
						}

						button {
								@apply bg-white;
								span {
										@apply text-blue-900 font-extrabold text-nowrap;
								}
						}
				}

				h3 {
						@apply font-bold ;
				}
		}
	}
</style>

<main class="bg-gray-100">
	<!-- Menu	-->
	<div class="p-6 min-h-36
						circle-arcs bg-blue-900 border-none">
		<h1 class="text-7xl text-white">{item.item.name}</h1>
		<h1 class="text-3xl text-center underline text-white">Our Menu</h1>
	</div>

	<!-- Category Selector -->
	<div class="bg-blue-900">
	<nav>
		{#each categories as category}
		<button
			class="{category === selectedCategory ? 'selected': ''}"
			onclick="{() => setCategory(category)}">
			<h3>{category}</h3>
		</button>
		{/each}
	</nav>
	</div>

	<!-- Product Selector	-->
	{#if products.length > 0}
	<section>
		{#each groupedProducts as product, index}
			<div class="product-card">
				<div class="product-card-image">
					<img src={popupImg} alt="Popup Image" loading="lazy" width="1024" height="1024" aria-hidden="true" />
				</div>

				{#if selectedArray.at(index) ?? false}
					<div class="product-card-prices"
							 in:slide={{ duration: 400, axis: 'y' }}
							 out:slide={{ duration: 300, axis: 'y' }}>
						{#each product.price_policies as pricePolicy}
							<div class="price-policies">
								<h3 class="text-ingenium-grey-800 font-bold">
									{#if pricePolicy !== null}
									Price: {#if pricePolicy["name"] !== null}{pricePolicy["name"]} -{/if}
									{#if pricePolicy["price"] === 0}Gratis{:else}€{pricePolicy["price"]}{/if}
									{/if}
								</h3>

								<button
									class="button button-primary w-32 button-inline"
									onclick="{() => {addToCard(product, pricePolicy)}}">
									<span>Voeg Toe ▶</span>
								</button>

							</div>
						{/each}

						{#if product.form !== null && product.form !== undefined}
							<form class="ingenium-form">
								<fieldset>
									{#each Object.entries(product.form) as [formKey, formField] }
										{#if formField['type'] === "option" }
											<div class="form-field">
												<label for="dynamic_policy_enum">{makePretty(formKey)}</label>
												<select id="dynamic_policy_enum" required>
													{#each formField["options"] ?? [] as option}
														<option value={option}>{makePretty(option)}</option>
													{/each}
												</select>
												<p>Selecteer {formKey}</p>
											</div>
										{:else}
											<p>Unknown field input</p>
										{/if}
									{/each}
								</fieldset>
							</form>
						{/if}
					</div>
				{/if}

				<div class="product-card-content">
					<h2>{product["product_blueprint_name"]}</h2>
					<button
						class="button button-primary w-32 button-inline"
						onclick="{() => {showProduct(index)}}"
						disabled="{product.max_count <= 0}"
					>
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