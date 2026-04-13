import { getApiBaseUrl } from "@/lib/config";
import { parseJsonResponse } from "@/lib/api/parseJsonResponse";
import type { TournamentDivision } from "@/lib/types/tournament";
import type { WaitlistByDivision, WaitlistUserRow } from "@/lib/types/waitlist";

type WaitlistApiResponse = {
  count: number;
  position?: number | null;
  users: WaitlistUserRow[];
};

async function fetchWaitlistDivision(
  tournamentId: string,
  division: TournamentDivision,
): Promise<WaitlistUserRow[]> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error("NEXT_PUBLIC_MATCHPOINT_API_URL is not set");
  }
  const url = `${base}/api/waitlist?tournamentId=${encodeURIComponent(tournamentId)}&division=${division}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = await parseJsonResponse<WaitlistApiResponse>(res);
  return Array.isArray(data.users) ? data.users : [];
}

/** Public GET: una petición por división (misma API que la app móvil). */
export async function fetchWaitlistForTournament(
  tournamentId: string,
): Promise<WaitlistByDivision> {
  const divisions: TournamentDivision[] = ["men", "women", "mixed"];
  const results = await Promise.all(
    divisions.map((d) =>
      fetchWaitlistDivision(tournamentId, d).catch((): WaitlistUserRow[] => []),
    ),
  );
  return {
    men: results[0] ?? [],
    women: results[1] ?? [],
    mixed: results[2] ?? [],
  };
}
