import {PaymentProviderEnum, type ProductOutI} from '$lib/models/productsI';
import {getAuthorizationHeaders} from "$lib/auth/auth";
import {PUBLIC_API_URL} from "$env/static/public";
import {isAuthenticated} from "$lib/states/auth.svelte";
import type {CartFailedI, CartSuccessI} from "$lib/models/cartI";
import {goto} from "$app/navigation";

export const cartProducts: ProductOutI[] = $state([]);
export const cartDetails = $state({
	guestEmail: '',
	note: '',
	staffCheckout: true,
	isPaying: false,
	turnstileToken: null,
	stripePayment: false,
	checkout: null,
})
export const failedCart: CartFailedI = $state({
	failed_products: [],
});

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
	cartProducts.length = 0; // Clear the array, needed for dev mode
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
	const foundIndexes = cartProducts.reduce<number[]>((acc, p, index, _) =>  {
		const pricePolicyCheck = p.price_policy !== null && product.price_policy !== null && p.price_policy.id === product.price_policy.id;

		if (p.id === product.id && pricePolicyCheck) {
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
 * Clears the cart
 */
export const clearCart = () => {
	cartProducts.length = 0;
	storeProductsInLocalStorage();
}

/**
 * Get the amount in cart for a specific product
 * @param product the product to check
 * @param checkPricePolicy set to true if you want to differentiate between price policies
 */
export const getProductCount = (product: ProductOutI, checkPricePolicy: boolean = false) => {
	return cartProducts.filter((p) => {
		const isSameProduct = p.id === product.id;
		if (checkPricePolicy && p.price_policy !== null && product.price_policy !== null) {
			return isSameProduct && p.price_policy.id === product.price_policy.id;
		}
		return isSameProduct;
	}).length;
}

/**
 * Execute the cart details
 */
export const checkoutCart = async () => {
	Object.assign(failedCart, {});

	try {
		const auth = isAuthenticated();
		const data: CartSuccessI = await fetch(`${PUBLIC_API_URL}/cart/checkout?requested_payment_provider=4`, {
			method: 'POST',
			headers: getAuthorizationHeaders(null, {
				'Content-Type': 'application/json',
			}),
			body: JSON.stringify({
				cart: {
					products: cartProducts,
					checkout_note: cartDetails.note,
					user_email: auth ? null : cartDetails.guestEmail,
				},
				captcha_token: auth ? null : cartDetails.turnstileToken,
			}),
		}).then((res) => {
			if (!res.ok) throw res;
			return res.json();
		});

		await handlePayment(data);
	} catch (error: any) {
		if (error instanceof Response && error.status === 406) {
			const data = await error.json();
			Object.assign(failedCart, data.detail);
		}

		throw error;
	}
}

/**
 *
 */
export const handlePayment = async (data: CartSuccessI) => {
	cartDetails.isPaying = true;

	switch (data.checkout.payment_provider) {
		case PaymentProviderEnum.Dev:
			await goToSuccessPage();
			break;

		case PaymentProviderEnum.Free:
			await goToSuccessPage();
			break;

		case PaymentProviderEnum.Kassa:
			//await goto(data.checkout.payment_url);
			break;

		case PaymentProviderEnum.Stripe:
			// @ts-expect-error TODO: fix the types for this
			cartDetails.checkout = data.checkout;
			cartDetails.stripePayment = true;
			break;
	}
}

/**
 * Navigates to the correct page after payment
 */
export const goToSuccessPage = async () => {
	clearCart();

	if (isAuthenticated()) {
		await goto('/account/transactions');
	} else {
		await goto('/shop/confirm?redirect_status=succeeded');
	}
}

/**
 * Get the failed product from the failed cart
 */
export const getFailedProduct = (product: ProductOutI) => {
	if (!failedCart.failed_products) return undefined;

	return failedCart.failed_products.find(failedProduct => {
		return product.id === failedProduct.product.id && product.price_policy?.id === failedProduct.product.price_policy?.id;
	});
}