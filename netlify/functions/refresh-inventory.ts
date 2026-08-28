import type { Config } from "@netlify/functions";
import { refreshActiveListingCache } from "../../server/mdmRoute";

/**
 * Runs independently of visitors so cold API functions can read a current,
 * provider-backed inventory cache from Netlify Database.
 */
export default async () => {
  try {
    const refresh = await refreshActiveListingCache();
    console.info("[InventoryRefresh] Completed", refresh);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[InventoryRefresh] Failed", error);
    return Response.json({ error: "Inventory refresh failed" }, { status: 500 });
  }
};

export const config: Config = {
  schedule: "*/15 * * * *",
};
