import { getApiBaseUrl } from "@/lib/config";
import { parseJsonResponse } from "@/lib/api/parseJsonResponse";
import type { Team } from "@/lib/types/team";

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
  return parseJsonResponse<Team[]>(res);
}
