import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from "$env/static/public";

import type { ItemWideLimitedI } from "$lib/models/item/itemwideI";
import type { ProductOutI } from "$lib/models/productsI";
import { getAuthorizationHeaders } from "$lib/auth/auth";
import {handleRequest} from "$lib/utilities/httpUtilities";
import {error} from "@sveltejs/kit";

export const load: PageLoad = async ({ fetch, params, url }) => {
  try {
    // Check for the access token
    let accessKey = url.searchParams.get('access_key');
    accessKey = accessKey ? `?access_key=${accessKey}` : '';

    const shopReq = fetch(`${PUBLIC_API_URL}/item/shop/${params.product}${accessKey}`).then(handleRequest);
    const productReq = fetch(`${PUBLIC_API_URL}/item/products/${params.product}${accessKey}`, {
      headers: getAuthorizationHeaders(params),
    }).then(handleRequest);
    const [shop, products]: [ event: ItemWideLimitedI, products: ProductOutI[] ] = await Promise.all([shopReq, productReq]);

    return {
      shop,
      products
    }
  } catch (e) {
    if (e instanceof Response) {
      error(e.status, e.statusText);
    }

    error(500, 'Onbekende fout');
  }
}