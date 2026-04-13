import { getApiBaseUrl } from "@/lib/config";
import type { Entry } from "@/lib/types/entry";
import { parseJsonResponse } from "@/lib/api/parseJsonResponse";

export async function fetchEntriesForTournament(tournamentId: string): Promise<Entry[]> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error("NEXT_PUBLIC_MATCHPOINT_API_URL is not set");
  }
  const url = `${base}/api/entries?tournamentId=${encodeURIComponent(tournamentId)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return parseJsonResponse<Entry[]>(res);
}
