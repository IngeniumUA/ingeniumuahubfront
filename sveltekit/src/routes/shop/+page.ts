import {PUBLIC_API_URL} from "$env/static/public";

export const load = async ({ fetch }) => {
  try {
    const data = await fetch(`${PUBLIC_API_URL}/item/shop/list`).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });

    return {
      items: data,
    }
  } catch (e) {
    console.error(e);
  }
}