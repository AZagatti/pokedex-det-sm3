import { getBerry, getBerryList } from "$lib/api/client";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const list = await getBerryList(fetch);
  const berries = await Promise.all(
    list.results.map((b) => getBerry(fetch, b.name))
  );
  return { berries };
};
