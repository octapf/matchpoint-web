import { getApiBaseUrl } from "@/lib/config";
import { parseJsonResponse } from "@/lib/api/parseJsonResponse";
import type { TournamentDetail, TournamentListItem } from "@/lib/types/tournament";

export async function fetchTournamentsList(params?: {
  status?: string;
}): Promise<TournamentListItem[]> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error("NEXT_PUBLIC_MATCHPOINT_API_URL is not set");
  }
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  const q = search.toString();
  const url = `${base}/api/tournaments${q ? `?${q}` : ""}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return parseJsonResponse<TournamentListItem[]>(res);
}

/** Full detail: matches + standings + list-style counts (API merges them). */
export async function fetchTournamentDetail(id: string): Promise<TournamentDetail> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error("NEXT_PUBLIC_MATCHPOINT_API_URL is not set");
  }
  const search = new URLSearchParams({
    includeMatches: "1",
    includeStandings: "1",
  });
  const url = `${base}/api/tournaments/${encodeURIComponent(id)}?${search.toString()}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return parseJsonResponse<TournamentDetail>(res);
}
