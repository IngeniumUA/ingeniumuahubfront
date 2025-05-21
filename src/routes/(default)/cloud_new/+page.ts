import { getAuthorizationHeaders, getLoginUrlWithRedirect, hasValidToken } from '$lib/auth/auth';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';
import { handleRequest } from '$lib/utilities/httpUtilities';

export const load = async ({ params, url }) => {
	let url_path_param = url.searchParams.get('path');
	if (url_path_param === null) {
		url_path_param = '';
	}
	const total_url = url.pathname + '?path=' + encodeURI(url_path_param);
	if (!hasValidToken(params)) {
		redirect(307, getLoginUrlWithRedirect(total_url));
	}

	async function get_file_list() {
		let fetched_file_list
		fetched_file_list = localStorage.getItem('fetched_file_list');
		if (fetched_file_list !== null) {
			return JSON.parse(fetched_file_list);
		}
		try {
			fetched_file_list = await fetch(`${PUBLIC_API_URL}/cloud/list_files`, {
				method: 'GET',
				headers: getAuthorizationHeaders(params)
			}).then(handleRequest);
			localStorage.setItem('fetched_file_list', JSON.stringify(fetched_file_list));
			return fetched_file_list;
		} catch (err) {
			console.error('Fetch error:', err);
		}
	}

	const file_list: string[] = await get_file_list();
	return { file_list: file_list };
};
