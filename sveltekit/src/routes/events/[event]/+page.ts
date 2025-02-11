import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from "$env/static/public";

import type { ItemWideLimitedI } from "$lib/models/item/itemwideI";
import type { ProductOutI } from "$lib/models/productsI";
import { getAuthorizationHeaders } from "$lib/auth/auth";
import {handleRequest} from "$lib/utilities/httpUtilities";
import {error} from "@sveltejs/kit";

export const load: PageLoad = async ({ fetch, params }) => {
  try {
    const eventReq = fetch(`${PUBLIC_API_URL}/item/event/${params.event}`).then(handleRequest);
    const productReq = fetch(`${PUBLIC_API_URL}/item/products/${params.event}`, {
      headers: getAuthorizationHeaders(params),
    }).then(handleRequest);
    const [event, products]: [ event: ItemWideLimitedI, products: ProductOutI[] ] = await Promise.all([eventReq, productReq]);

    return {
      event,
      products
    }
  } catch (e) {
    if (e instanceof Response) {
      error(e.status, e.statusText);
    }

    error(500, 'Onbekende fout');
  }
}