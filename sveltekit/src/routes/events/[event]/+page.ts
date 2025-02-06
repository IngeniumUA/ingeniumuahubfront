import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from "$env/static/public";

import type { ItemWideLimitedI } from "$lib/models/item/itemwideI";
import type { ProductOutI } from "$lib/models/productsI";
import { getAuthorizationHeaders } from "$lib/auth/auth";

export const load: PageLoad = async ({ fetch, params }) => {
  try {
    const eventReq = fetch(`${PUBLIC_API_URL}/item/event/${params.event}`);
    const productReq = fetch(`${PUBLIC_API_URL}/item/products/${params.event}`, {
      headers: getAuthorizationHeaders(params),
    });
    const [eventData, productsData] = await Promise.all([eventReq, productReq]);
    const [event, products]: [ event: ItemWideLimitedI, products: ProductOutI[] ] = await Promise.all([eventData.json(), productsData.json()]);

    return {
      event,
      products
    }
  } catch (error) {
    return {
      event: null
    }
  }
}