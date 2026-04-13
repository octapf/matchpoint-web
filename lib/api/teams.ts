import { getApiBaseUrl } from "@/lib/config";
import type { Team } from "@/lib/types/team";

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

export async function fetchTeamsForTournament(tournamentId: string): Promise<Team[]> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error("NEXT_PUBLIC_MATCHPOINT_API_URL is not set");
  }
  const url = `${base}/api/teams?tournamentId=${encodeURIComponent(tournamentId)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return parseJson<Team[]>(res);
}
