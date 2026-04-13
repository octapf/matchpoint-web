import type { MatchDoc } from "@/lib/types/tournament";
import type { Team as TeamRow } from "@/lib/types/team";
import { divisionLabel } from "@/lib/format/division";

function teamNameById(teams: TeamRow[], id: string | undefined): string {
  if (!id) return "—";
  const t = teams.find((x) => x._id === id);
  return t?.name ?? id.slice(0, 8) + "…";
}

export function TabPartidos({
  matches,
  teams,
}: {
  matches: MatchDoc[];
  teams: TeamRow[];
}) {
  const list = [...matches].sort((a, b) => {
    const ca = String(a.createdAt ?? "");
    const cb = String(b.createdAt ?? "");
    return ca.localeCompare(cb);
  });

  if (list.length === 0) {
    return (
      <p className="text-sm text-mp-text-muted" role="status">
        No hay partidos para mostrar.
      </p>
    );
  }

  return (
    <ul className="space-y-2" aria-label="Partidos">
      {list.map((m) => {
        const left = teamNameById(teams, m.teamAId);
        const right = teamNameById(teams, m.teamBId);
        const score =
          m.status === "completed" &&
          m.pointsA != null &&
          m.pointsB != null
            ? `${m.pointsA} — ${m.pointsB}`
            : m.status === "completed" && (m.setsWonA != null || m.setsWonB != null)
              ? `Sets ${m.setsWonA ?? 0} — ${m.setsWonB ?? 0}`
              : m.status ?? "—";
        return (
          <li
            key={m._id}
            className="rounded-lg border border-mp-surface-light bg-mp-bg/40 px-3 py-3 text-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-mp-text-secondary">
                {m.stage === "classification"
                  ? "Clasificación"
                  : m.stage === "category"
                    ? "Categoría"
                    : m.stage ?? "—"}
                {m.division ? ` · ${divisionLabel(m.division)}` : ""}
                {m.category ? ` · ${m.category}` : ""}
              </span>
              <span className="text-xs font-medium text-mp-yellow">{score}</span>
            </div>
            <p className="mt-2 font-medium text-mp-text">
              {left} <span className="text-mp-text-muted">vs</span> {right}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
