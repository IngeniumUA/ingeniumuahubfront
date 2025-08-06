import { getAuthorizationHeaders } from '$lib/auth/auth';
import { handleRequest } from '$lib/utilities/httpUtilities';
import { PUBLIC_API_URL } from "$env/static/public";
import type { PromoItemWideI } from '$lib/models/item/promoI';


export async function load({ fetch, params }) {
	const query = new URLSearchParams({
		item_type: "promoitem",
		limit: '100',
	});

	const vacatures: PromoItemWideI[] = await fetch(`${PUBLIC_API_URL}/item/wide?${query.toString()}`, {
		headers: getAuthorizationHeaders(params)
	}).then(r => handleRequest(r));
	const total_vacatures_count: number = await fetch(`${PUBLIC_API_URL}/item/count?${query.toString()}`, {
		headers: getAuthorizationHeaders(params)
	}).then(r => handleRequest(r));
	query.set("available", "true")
	const available_vacatures_count: number = await fetch(`${PUBLIC_API_URL}/item/count?${query.toString()}`, {
		headers: getAuthorizationHeaders(params)
	}).then(r => handleRequest(r));


	return { vacatures, available_vacatures_count, total_vacatures_count };
}