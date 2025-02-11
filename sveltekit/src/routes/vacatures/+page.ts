import { PUBLIC_API_URL } from "$env/static/public";
import { handleRequest } from "$lib/utilities/httpUtilities";
import { error } from "@sveltejs/kit";

export const load = async ({ fetch }) => {
  try {
    const vacancies = await fetch(`${PUBLIC_API_URL}/item/promo/list`).then(handleRequest);

    return {
      vacancies,
    }
  } catch (e) {
    if (e instanceof Response) {
      error(e.status, e.statusText);
    }
    error(500, 'Onbekende fout');
  }
}