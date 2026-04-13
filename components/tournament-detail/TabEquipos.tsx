import type { Team } from "@/lib/types/team";
import { divisionLabel } from "@/lib/format/division";

export function TabEquipos({ teams }: { teams: Team[] }) {
  const sorted = [...teams].sort((a, b) => {
    const da = a.division ?? "";
    const db = b.division ?? "";
    if (da !== db) return da.localeCompare(db);
    return (a.name ?? "").localeCompare(b.name ?? "");
  });

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-mp-text-muted" role="status">
        No hay equipos cargados aún.
      </p>
    );
  }

  return (
    <ul className="space-y-2" aria-label="Listado de equipos">
      {sorted.map((team) => (
        <li
          key={team._id}
          className="rounded-lg border border-mp-surface-light bg-mp-bg/40 px-3 py-3"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-semibold text-mp-text">{team.name}</span>
            <span className="text-xs uppercase text-mp-violet">
              {divisionLabel(team.division)}
              {typeof team.groupIndex === "number"
                ? ` · Grupo ${team.groupIndex + 1}`
                : ""}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
