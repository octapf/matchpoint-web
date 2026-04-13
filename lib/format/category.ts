import type { TournamentCategory } from "@/lib/types/tournament";

const LABELS: Record<TournamentCategory, string> = {
  Gold: "Oro",
  Silver: "Plata",
  Bronze: "Bronce",
};

export function categoryLabel(
  c: TournamentCategory | string | undefined,
): string {
  if (c === "Gold" || c === "Silver" || c === "Bronze") return LABELS[c];
  return c ? String(c) : "—";
}
