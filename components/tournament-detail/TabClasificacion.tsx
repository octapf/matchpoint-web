import type {
  StandingRow,
  StandingsDivisionBlock,
  TournamentDivision,
} from "@/lib/types/tournament";
import { divisionLabel } from "@/lib/format/division";

/** API shape can omit arrays or fields; normalize so render never throws. */
function normalizeStandings(raw: unknown): StandingsDivisionBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((div) => {
    const d =
      div && typeof div === "object" && "division" in div
        ? (div as { division?: unknown }).division
        : undefined;
    const division = (typeof d === "string" ? d : `mixed`) as TournamentDivision;

    const groupsRaw =
      div && typeof div === "object" && "groups" in div
        ? (div as { groups?: unknown }).groups
        : undefined;
    const groupsArr = Array.isArray(groupsRaw) ? groupsRaw : [];

    const groups = groupsArr.map((g, gi) => {
      const groupIndex =
        g &&
        typeof g === "object" &&
        typeof (g as { groupIndex?: unknown }).groupIndex === "number"
          ? (g as { groupIndex: number }).groupIndex
          : gi;

      const standingsRaw =
        g && typeof g === "object" && "standings" in g
          ? (g as { standings?: unknown }).standings
          : undefined;
      const standingsList = Array.isArray(standingsRaw) ? standingsRaw : [];

      const standings: StandingRow[] = standingsList.map((row) => {
        const teamRaw =
          row && typeof row === "object" && "team" in row
            ? (row as { team?: unknown }).team
            : undefined;
        const t =
          teamRaw && typeof teamRaw === "object"
            ? (teamRaw as { _id?: unknown; name?: unknown })
            : undefined;
        const wins = Number((row as { wins?: unknown })?.wins);
        const points = Number((row as { points?: unknown })?.points);
        return {
          team: {
            _id: t?._id != null ? String(t._id) : "—",
            name: t?.name != null ? String(t.name) : "—",
          },
          wins: Number.isFinite(wins) ? Math.floor(wins) : 0,
          points: Number.isFinite(points) ? Math.floor(points) : 0,
        };
      });

      return { groupIndex, standings };
    });

    return { division, groups };
  });
}

export function TabClasificacion({
  standings,
}: {
  standings: StandingsDivisionBlock[] | undefined;
}) {
  const blocks = normalizeStandings(standings);

  if (blocks.length === 0) {
    return (
      <p className="text-sm text-mp-text-muted" role="status">
        No hay tabla de posiciones aún.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {blocks.map((div, divIdx) => (
        <section
          key={`${String(div.division)}-${divIdx}`}
          aria-labelledby={`stand-${String(div.division)}-${divIdx}`}
        >
          <h3
            id={`stand-${String(div.division)}-${divIdx}`}
            className="mb-3 text-sm font-bold uppercase italic tracking-wide text-mp-yellow"
          >
            {divisionLabel(div.division)}
          </h3>
          {div.groups.map((g) => (
            <div
              key={`g-${String(div.division)}-${g.groupIndex}`}
              className="mb-6 last:mb-0"
            >
              <h4 className="mb-2 text-xs font-semibold text-mp-text-secondary">
                Grupo {Number.isFinite(g.groupIndex) ? g.groupIndex + 1 : "—"}
              </h4>
              <div className="overflow-x-auto rounded-lg border border-mp-surface-light">
                <table className="w-full min-w-[280px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-mp-surface-light bg-mp-surface/80">
                      <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                        #
                      </th>
                      <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                        Equipo
                      </th>
                      <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                        PG
                      </th>
                      <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                        Pts
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.standings.map((row, idx) => (
                      <tr
                        key={`${String(div.division)}-${g.groupIndex}-${idx}`}
                        className="border-b border-mp-surface-light/80 last:border-0"
                      >
                        <td className="px-3 py-2 text-mp-text-muted">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium text-mp-text">
                          {row.team.name}
                        </td>
                        <td className="px-3 py-2 text-mp-text-secondary">{row.wins}</td>
                        <td className="px-3 py-2 text-mp-text-secondary">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
