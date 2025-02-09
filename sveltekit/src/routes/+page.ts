import type { PageLoad } from './$types';
import type { RecSysPreviewI } from '$lib/models/RecSysI';
import { PUBLIC_API_URL } from '$env/static/public';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const recommendationsReq = fetch(`${PUBLIC_API_URL}/item/event/list`).then(r => r.json());
		const sponsoredReq = fetch(`${PUBLIC_API_URL}/item/promo/list`).then(r => r.json());

		// Wait for all promises
		const [recommendations, sponsored] = await Promise.all([
			recommendationsReq, sponsoredReq
		]);

		return {
			recommendations: recommendations as RecSysPreviewI[],
			sponsored: sponsored as RecSysPreviewI[],
			partnersReq: fetch(`${PUBLIC_API_URL}/partner/logo`).then(r => r.json()),
		}
	} catch (e) {
		console.error(e);
	}
}