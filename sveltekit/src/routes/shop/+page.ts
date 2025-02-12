import {PUBLIC_API_URL} from "$env/static/public";
import {error, redirect} from "@sveltejs/kit";
import {handleRequest} from "$lib/utilities/httpUtilities";

export const load = async ({ fetch }) => {
  try {
    const data = await fetch(`${PUBLIC_API_URL}/item/shop/list`).then(handleRequest);

    return {
      items: data,
    }
  } catch (e) {
    if (e instanceof Response) {
      error(e.status, e.statusText);
    }

    error(500, 'Onbekende fout');
  }
}