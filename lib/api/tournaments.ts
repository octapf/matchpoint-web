import { getApiBaseUrl } from "@/lib/config";
import type { TournamentDetail, TournamentListItem } from "@/lib/types/tournament";

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return undefined as T;
  }
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON from server");
  }
  if (!res.ok) {
    const err =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `API error: ${res.status}`;
    throw new Error(err);
  }
  return data as T;
}

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
  return parseJson<TournamentListItem[]>(res);
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
  return parseJson<TournamentDetail>(res);
}
