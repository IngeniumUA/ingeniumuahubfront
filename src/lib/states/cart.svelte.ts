import {
	PaymentProviderEnum,
	type ProductFormFieldI,
	type ProductOutI
} from '$lib/models/productsI';
import {getAuthorizationHeaders} from "$lib/auth/auth";
import {PUBLIC_API_URL} from "$env/static/public";
import {isAuthenticated} from "$lib/states/auth.svelte";
import type { CartFailedI, CartSuccessI, CheckoutSmallI } from '$lib/models/cartI';
import {goto} from "$app/navigation";
import { getNotifications } from '$lib/utilities/notificationUtilities.ts';
import { notification_token } from '../../hooks.client.ts';

export interface CartDetailsState {
	guestEmail: string;
	note: string;
	staffCheckout: boolean;
	isPaying: boolean;
	turnstileToken: string|null;
	stripePayment: boolean;
	checkout: CheckoutSmallI|null;
}

export const cartProducts: ProductOutI[] = $state([]);
export const cartDetails: CartDetailsState = $state({
	guestEmail: '',
	note: '',
	staffCheckout: false,
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

/**
 * This functions reduces the quantity of a product
 * It also checks for the price policy to be the same!
 * @param product
 * @param count
 */
export const reduceProductQuantity = (product: ProductOutI, count: number = 1) => {
	// Find all products with same settings
	const foundIndexes = cartProducts.reduce<number[]>((acc, p, index) =>  {
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
 * Updates the product metadata form field
 * @param productIdx index of product in the array list
 * @param formKey the key of the form field
 * @param meta the metadata of the form field
 * @param el the input element
 */
export const updateProductMeta = (productIdx: number, formKey: string, meta: ProductFormFieldI, el: HTMLInputElement) => {
	const formData = cartProducts[productIdx].product_meta.other_meta_data?.form || {};
	formData[formKey] = {
		...meta,
		value: el.value,
	}

	cartProducts[productIdx].product_meta.other_meta_data.form = formData;
	storeProductsInLocalStorage();
}


/**
 * Clears the cart
 */
export const clearCart = () => {
	cartProducts.length = 0;
	cartDetails.note = '';
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
	const paymentProvider = cartDetails.staffCheckout ? PaymentProviderEnum.Kassa : PaymentProviderEnum.Stripe;

	let notification_token_cart: string | null
	if (getNotifications) {
		notification_token_cart = notification_token
	} else {
		notification_token_cart = null
	}

	try {
		const auth = isAuthenticated();
		const data: CartSuccessI = await fetch(`${PUBLIC_API_URL}/cart/checkout?requested_payment_provider=${paymentProvider}`, {
			method: 'POST',
			headers: getAuthorizationHeaders(null, {
				'Content-Type': 'application/json',
			}),
			body: JSON.stringify({
				cart: {
					products: cartProducts,
					checkout_note: cartDetails.note,
					user_email: auth ? null : cartDetails.guestEmail,
					notification_token: notification_token_cart
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
			await goToSuccessPage(data);
			break;

		case PaymentProviderEnum.Free:
			await goToSuccessPage(data);
			break;

		case PaymentProviderEnum.Kassa:
			await goToSuccessPage(data);
			break;

		case PaymentProviderEnum.Stripe:
			cartDetails.checkout = data.checkout;
			cartDetails.stripePayment = true;
			break;
	}
}

/**
 * Navigates to the correct page after payment
 */
export const goToSuccessPage = async (data: CartSuccessI) => {
	clearCart();

	// Clear paying status
	cartDetails.isPaying = false;
	cartDetails.stripePayment = false;
	cartDetails.checkout = null;

	await goto(
		`/shop/confirm?redirect_status=succeeded&checkout_uuid=${data.checkout.checkout_uuid}&tracker_id=${data.tracker_id}`,
		{ replaceState: true, noScroll: false }
	);
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