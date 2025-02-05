import {PUBLIC_API_URL} from "$env/static/public";

export const load = async ({ fetch }) => {
  try {
    const partnersReq = await fetch(`${PUBLIC_API_URL}/partner/logo`);
    const partners: string[] = await partnersReq.json();

    return {
      partners
    }
  } catch (e) {
    return {
      partners: [],
    }
  }
}