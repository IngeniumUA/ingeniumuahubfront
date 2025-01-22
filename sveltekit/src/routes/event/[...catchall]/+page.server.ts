import type {PageServerLoad} from './$types';
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async ({ url }) => {
  // Replace path with the correct path to the event
  return redirect(302, url.pathname.replace('/event', '/events'));
}