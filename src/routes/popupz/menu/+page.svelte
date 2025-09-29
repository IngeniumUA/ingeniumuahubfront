<script lang="ts">
	import type { PricePolicyLimitedI, ProductFormI, ProductOutI } from '$lib/models/productsI';
	import type { ItemWideLimitedI } from '$lib/models/item/itemwideI';
	import { failedToast, successToast } from '$lib/components/toast/defined_toast';
	import popupImg from '$assets/images/popupz/popupz_default.png';
	import { slide } from 'svelte/transition';
	import { makePretty } from '$lib/utilities/style-utilities';
	import {
		addProductToCart, cartDetails,
		cartProducts, clearCart, failedCart,
		updateProductMetaForm
	} from '$lib/states/cart.svelte';
	import { goto } from '$app/navigation';
	import type { CartSuccessI } from '$lib/models/cartI';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';

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
				product_blueprint: blueprint,
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
	function addToCard(productGrouped, pricePolicy: PricePolicyLimitedI | null) {
		if (pricePolicy === null) return;

		// Translating separate product and price policy back to ProductOut
		const productOut: ProductOutI = {
			...productGrouped["product_blueprint"],
		}
		productOut.price_policy = { ...pricePolicy }
		productOut.product_meta = JSON.parse(JSON.stringify(productOut.product_meta))

		addProductToCart(productOut, 1);

		// Also setting correct form value
		if (productOut.product_meta.other_meta_data.form !== undefined) {
			const productInCartIndex = cartProducts.length - 1;
			updateProductMetaForm(productInCartIndex, productOut.product_meta.other_meta_data.form);
		}
		successToast(`${productGrouped.product_blueprint_name} toegevoegd!`)
	}

	/**
	 * Cart functions
	 */
	function handleCartClick() {
		goto('/shop/cart');
	}

	let httpLoading: boolean = $state(false)
	async function handleCheckoutNow() {
		if (httpLoading) return;
		if (cartProducts.length === 0) {
			failedToast("Geen producten!")
		}
		const data: CartSuccessI = await fetch(`${PUBLIC_API_URL}/cart/checkout?requested_payment_provider=2`, {
			method: 'POST',
			headers: getAuthorizationHeaders(null, {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
			}),
			body: JSON.stringify({
				cart: {
					products: cartProducts,
					checkout_note: cartDetails.note,
					tracker_ordering: cartDetails.tracker_ordering
				},
			}),
		}).then((res) => {
			if (!res.ok) throw res;
			clearCart()
			successToast("Besteld!")
			return res.json();
		});
	}
</script>

<style>
	nav {
			@apply flex flex-row bg-blue-950 rounded-t-xl;

      button {
          @apply flex-1 flex justify-center items-center p-3 rounded-t-xl;
					h3 {
							@apply font-bold text-white;
					}
			}

			.selected {
					@apply bg-gray-100;
					h3 {
              @apply text-blue-950;
					}
			}
	}

	section {
		@apply m-4 flex flex-col bg-gray-100 gap-4 items-center md:flex-row md:flex-wrap md:items-start;

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
                flex: 0 1 auto;
                text-align: left;
                transition: flex-grow 0.3s ease, text-align 0.3s ease;
            }

            h2.moved {
                flex-grow: 1;
                text-align: right;
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

<main class="bg-gray-100 pb-40">
	<!-- Menu	-->
	<div class="p-6 min-h-36
						circle-arcs bg-blue-900 border-none">
		<h1 class="text-7xl text-white">{item.item.name}</h1>
		<div class="flex flex-row gap-8 items-center justify-center">
			<h1 class="text-3xl text-center underline text-white">Our Menu</h1>
			<h1 class="text-3xl text-center underline text-white"><a href="orders">Volg Orders</a></h1>
			{#if data.isStaff}
				<h1 class="text-3xl text-center underline text-white"><a href="manage">Staff</a></h1>
			{/if}
		</div>
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
		{#each groupedProducts as groupedProduct, index}
			<div class="product-card">
				<div class="product-card-image">
					<img src={popupImg} alt="Popup Image" loading="lazy" width="1024" height="1024" aria-hidden="true" />
				</div>

					{#if selectedArray.at(index) ?? false}
						<div class="product-card-prices"
								 in:slide={{ duration: 400, axis: 'y' }}
								 out:slide={{ duration: 300, axis: 'y' }}>
							{#each groupedProduct.price_policies as pricePolicy}
								<div class="price-policies">
									<h3 class="text-ingenium-grey-800 font-bold">
										{#if pricePolicy !== null}
										Price: {#if pricePolicy["name"] !== null}{pricePolicy["name"]} -{/if}
										{#if pricePolicy["price"] === 0}Gratis{:else}€{pricePolicy["price"]}{/if}
										{/if}
									</h3>

									<button
										class="button button-primary w-32 button-inline"
										onclick="{() => {addToCard(groupedProduct, pricePolicy)}}">
										<span>Voeg Toe ▶</span>
									</button>
								</div>
							{/each}

							{#if groupedProduct.form !== null && groupedProduct.form !== undefined}
								<form class="ingenium-form">
									<fieldset>
										{#each Object.entries(groupedProduct.form) as [formKey, formField] }
											{#if formField['type'] === "option" }
												<div class="form-field">
													<label for={`form-field-${formKey}`}>{makePretty(formKey)}</label>
													<select id={`form-field-${formKey}`}
																	bind:value={formField.value}
																	required>
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
					<h2 class:moved={(selectedArray.at(index) ?? false)}>{groupedProduct["product_blueprint_name"]}</h2>
					{#if !(selectedArray.at(index) ?? false)}
						<button
							class="button button-primary w-32 button-inline"
							onclick="{() => {showProduct(index)}}"
						>
							<span>Bestel nu ▶</span>
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</section>
	{:else}
	<div class="w-screen h-max flex items-center justify-center">
		<div class="pt-8">
			<h1>De Shop staat niet aan vandaag.</h1>
			<h2>Kom naar de kassa!</h2>
		</div>
	</div>
	{/if}

	<article class="absolute bottom-4 right-4 flex flex-col gap-4">
		{#if data.isStaff}
			<button disabled={cartProducts.length === 0 || httpLoading} onclick={handleCheckoutNow} class="text-white bg-blue-900 hover:bg-blue-950 focus:ring-4
		focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-center
		inline-flex items-center me-2 py-4 px-6 disabled:bg-ingenium-grey-800">
				<span class="text-lg">Bestel meteen</span>
			</button>
		{/if}

		<button disabled={httpLoading} onclick={handleCartClick} class="text-white bg-blue-900 hover:bg-blue-950 focus:ring-4
	focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-center
	inline-flex items-center me-2 py-4 px-6">
			<svg class="w-8 h-8 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
				<path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z"/>
			</svg>
			<span class="text-lg">Naar Winkelkar ({cartProducts.length})</span>
		</button>
	</article>
</main>