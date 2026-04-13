import type { TournamentDivision } from "@/lib/types/tournament";

const LABELS: Record<TournamentDivision, string> = {
  men: "Masculino",
  women: "Femenino",
  mixed: "Mixto",
};

export function divisionLabel(d: TournamentDivision | string | undefined): string {
  if (d === "men" || d === "women" || d === "mixed") return LABELS[d];
  return d ? String(d) : "—";
}
