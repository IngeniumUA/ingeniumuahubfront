import type {EntryGenerator, PageLoad} from './$types';

import praesidium from "$lib/praesidium";
import {error} from "@sveltejs/kit";
const yearKeys = Object.keys(praesidium);

export const prerender = true;

// Done to prerender all the praesidium pages, useful for reducing load on SSR
export const entries: EntryGenerator = () => {
  let years = yearKeys.map((year) => {
    return { year }
  });
  return [
    { year: '' }, ...years
  ];
};

export const load: PageLoad = async ({ params }) => {
  let year = params.year;

  // If the year is empty, use the latest year
  if (year === '') {
    year = yearKeys[0];
  } else if (!yearKeys.includes(year)) { // Otherwise check if the year actually exists
    return error(404, 'Praesidium jaar niet gevonden');
  }

  return {
    praesidium: praesidium[year],
    years: yearKeys,
    currentYear: year,
  }
}