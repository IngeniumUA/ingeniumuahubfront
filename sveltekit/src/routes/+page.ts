import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { RecSysPreviewI } from '$lib/models/RecSysI';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const recommendationsRequest = fetch(`${PUBLIC_API_URL}/item/event/list`);
		const sponsoredRequest = fetch(`${PUBLIC_API_URL}/item/promo/list`);

		// Wait for all promises
		const [recommendations, sponsored] = await Promise.all([
			recommendationsRequest, sponsoredRequest
		]);

		// Parse JSON
		const [parsedRecommendations, parsedSponsored] = await Promise.all([
			recommendations.json(), sponsored.json()
		]);

		return {
			recommendations: parsedRecommendations as RecSysPreviewI[],
			sponsored: parsedSponsored as RecSysPreviewI[]
		}
	} catch (e) {
		console.error(e);
	}
}