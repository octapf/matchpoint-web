import type { Team } from "@/lib/types/team";

export function teamNameById(teams: Team[], id: string | undefined): string {
  if (!id) return "—";
  const t = teams.find((x) => x._id === id);
  return t?.name ?? `${id.slice(0, 8)}…`;
}
