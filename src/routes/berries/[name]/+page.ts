import { getBerry } from "$lib/api/client";
import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
  try {
    const berry = await getBerry(fetch, params.name);
    return { berry };
  } catch {
    throw error(404, `Berry "${params.name}" not found`);
  }
};
