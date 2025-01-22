import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from "$env/static/public";
import type { RecSysPreviewI } from "$lib/models/RecSysI";

export const load: PageLoad = async ({ fetch }) => {
  try {
    const eventsReq = await fetch(`${PUBLIC_API_URL}/item/event/list`);
    const events = await eventsReq.json() as RecSysPreviewI[];

    return {
      events
    }
  } catch (error) {
    console.error(error);

    return {
      events: []
    }
  }
}