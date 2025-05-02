import type { PageServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { handleRequest } from '$lib/utilities/httpUtilities';
import type { PublicOrderTrackerI } from '$lib/models/trackerI';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const data = await fetch(`${PUBLIC_API_URL}/order_tracking`).then(handleRequest) as PublicOrderTrackerI[];
		return {
			trackerData: data
		}
	} catch (e) {
		console.error(e);
		error(500, 'Error fetching order tracker data');
	}
}