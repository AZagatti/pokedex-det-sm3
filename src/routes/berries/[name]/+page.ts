import { getBerry } from "$lib/api/client";
import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const prerender = false;

export const load: PageLoad = async ({ fetch, params }) => {
  try {
    const berry = await getBerry(fetch, params.name);
    return { berry };
  } catch {
    error(404, `Berry "${params.name}" not found`);
  }
};
