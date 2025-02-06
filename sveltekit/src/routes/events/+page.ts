import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from "$env/static/public";
import type { RecSysPreviewI } from "$lib/models/RecSysI";

export const load: PageLoad = async ({ fetch }) => {
  try {
    const events = await fetch(`${PUBLIC_API_URL}/item/event/list`).then(r => r.json());

    return {
      events: events as RecSysPreviewI[]
    }
  } catch (error) {
    console.error(error);

    return {
      events: []
    }
  }
}