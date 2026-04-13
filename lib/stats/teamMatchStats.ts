import type { MatchDoc } from "@/lib/types/tournament";

export type TeamMatchStats = {
  played: number;
  wins: number;
  losses: number;
  ptsFor: number;
  ptsAgainst: number;
};

/** Aggregate W/L and points from completed matches (classification + category). */
export function computeTeamMatchStats(
  teamIds: string[],
  matches: MatchDoc[],
): Record<string, TeamMatchStats> {
  const init = (): TeamMatchStats => ({
    played: 0,
    wins: 0,
    losses: 0,
    ptsFor: 0,
    ptsAgainst: 0,
  });
  const out: Record<string, TeamMatchStats> = {};
  for (const id of teamIds) {
    out[id] = init();
  }

  for (const m of matches) {
    if (m.status !== "completed") continue;
    const a = m.teamAId;
    const b = m.teamBId;
    if (!a || !b) continue;
    if (!out[a]) out[a] = init();
    if (!out[b]) out[b] = init();

    out[a].played += 1;
    out[b].played += 1;

    const pa =
      m.pointsA != null && Number.isFinite(m.pointsA) ? Math.floor(m.pointsA) : 0;
    const pb =
      m.pointsB != null && Number.isFinite(m.pointsB) ? Math.floor(m.pointsB) : 0;
    out[a].ptsFor += pa;
    out[a].ptsAgainst += pb;
    out[b].ptsFor += pb;
    out[b].ptsAgainst += pa;

    const w = m.winnerId;
    if (w === a) {
      out[a].wins += 1;
      out[b].losses += 1;
    } else if (w === b) {
      out[b].wins += 1;
      out[a].losses += 1;
    }
  }

  return out;
}
