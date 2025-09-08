import {PUBLIC_API_URL} from "$env/static/public";
import {handleRequest} from "$lib/utilities/httpUtilities";

export const load = async ({ fetch }) => {
  try {
    const data = await fetch(`${PUBLIC_API_URL}/item/shop/list`).then(handleRequest);

    return {
      items: data,
    }
  } catch (error) {
    console.error(error);
    return {
      items: []
    }
  }
}