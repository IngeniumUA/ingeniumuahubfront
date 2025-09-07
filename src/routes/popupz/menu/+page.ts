import type { PageLoad } from './$types';
import { CoreItemAPI } from '$lib/core_api/core_api';

export const load: PageLoad = async () => {
	const products = await CoreItemAPI.queryProductsForItem("Pop-up Z 2025");

	return { products }
}