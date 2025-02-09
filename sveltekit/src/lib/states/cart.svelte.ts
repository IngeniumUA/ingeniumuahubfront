import type { ProductOutI } from '$lib/models/productsI';

export const cartProducts: ProductOutI[] = $state([]);
export const cartDetails = $state({
	guestEmail: '',
	note: '',
})

/**
 * Stores the products in local storage
 */
export const storeProductsInLocalStorage = () => {
	window.localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
}

/**
 * Retrieves the products from local storage
 */
export const retrieveProductsFromLocalStorage = () => {
	const storageData = window.localStorage.getItem('cartProducts');
	if (!storageData) return;
	cartProducts.push(...JSON.parse(storageData));
}

/**
 *
 * @param product
 * @param count
 */
export const addProductToCart = (product: ProductOutI, count: number = 1) => {
	const productsToAdd: ProductOutI[] = [];
	while (count > 0) {
		productsToAdd.push(structuredClone(product));
		count--;
	}

	cartProducts.push(...productsToAdd);
	storeProductsInLocalStorage();
}

export const removeProductFromCart = (index: number) => {
	cartProducts.splice(index, 1);
	storeProductsInLocalStorage();
}

export const reduceProductQuantity = (product: ProductOutI, count: number = 1) => {
	// Find all products with same settings
	const foundIndexes = cartProducts.reduce<number[]>((acc, p, index, _) => {
		if (p.id === product.id && p.price_policy.id === product.price_policy.id) {
			acc.push(index);
		}
		return acc;
	}, []);

	if (foundIndexes.length <= 0) return;

	let countToRemove = Math.min(foundIndexes.length, count);
	while (countToRemove > 0) {
		removeProductFromCart(foundIndexes[--countToRemove]);
	}
}

/**
 * Get the amount in cart for a specific product
 * @param product the product to check
 * @param checkPricePolicy set to true if you want to differentiate between price policies
 */
export const getProductCount = (product: ProductOutI, checkPricePolicy: boolean = false) => {
	return cartProducts.filter((p) => {
		const isSameProduct = p.id === product.id;
		if (checkPricePolicy) {
			return isSameProduct && p.price_policy.id === product.price_policy.id;
		}
		return isSameProduct;
	}).length;
}