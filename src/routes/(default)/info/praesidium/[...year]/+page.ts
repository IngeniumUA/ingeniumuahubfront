import type {PageLoad} from './$types';
import {error} from "@sveltejs/kit";

const BASE_URL = "https://ingeniumuapublic.blob.core.windows.net/ingeniumuaimages/praesidium";
const MIN_START_YEAR = 2018; // Base year for 2018-2019

function getAvailableYears(): string[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed: 0 = Jan

  // If before July 1st, the academic year started last year. Otherwise, it starts this year.
  const latestStartYear = currentMonth < 6 ? currentYear - 1 : currentYear;

  const years: string[] = [];
  for (let y = latestStartYear; y >= MIN_START_YEAR; y--) {
    const startStr = y.toString().slice(-2);
    const endStr = (y + 1).toString().slice(-2);
    years.push(`${startStr}-${endStr}`);
  }
  return years; // ["25-26", "24-25", ..., "18-19"]
}

export const load: PageLoad = async ({ params, fetch, setHeaders }) => {
  let requestedYear = params.year;

  // Cache info for browser and CDN's
  setHeaders({
    'Cache-Control': 'public, max-age=360'
  });
  const yearKeys = getAvailableYears();

  // 2. Handle the default route or validate the requested year
  let isDefaultRoute = false;
  if (!requestedYear || requestedYear === '') {
    requestedYear = yearKeys[0];
    isDefaultRoute = true;
  } else if (!yearKeys.includes(requestedYear)) {
    throw error(404, 'Praesidium jaar niet gevonden');
  }
  let dataRes = await fetch(`${BASE_URL}/praesidium/years/praesidium_${requestedYear}.json`);

  // If it's a new academic year but the JSON isn't uploaded yet, fall back to last year
  if (!dataRes.ok && isDefaultRoute && yearKeys.length > 1) {
    const fallbackYear = yearKeys[1];
    dataRes = await fetch(`${BASE_URL}/praesidium/years/praesidium_${fallbackYear}.json`);
    requestedYear = fallbackYear;
  }

  if (!dataRes.ok) {
    throw error(500, 'Kan de praesidium data niet inladen');
  }
  const praesidiumData = await dataRes.json();
  return {
    praesidium: praesidiumData,
    years: yearKeys,
    currentYear: requestedYear,
  };
};