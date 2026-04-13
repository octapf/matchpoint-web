import type { StandingsDivisionBlock } from "@/lib/types/tournament";
import { divisionLabel } from "@/lib/format/division";

export function TabClasificacion({
  standings,
}: {
  standings: StandingsDivisionBlock[];
}) {
  if (!standings?.length) {
    return (
      <p className="text-sm text-mp-text-muted" role="status">
        No hay tabla de posiciones aún.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {standings.map((div) => (
        <section key={div.division} aria-labelledby={`stand-${div.division}`}>
          <h3
            id={`stand-${div.division}`}
            className="mb-3 text-sm font-bold uppercase italic tracking-wide text-mp-yellow"
          >
            {divisionLabel(div.division)}
          </h3>
          {div.groups.map((g) => (
            <div key={g.groupIndex} className="mb-6 last:mb-0">
              <h4 className="mb-2 text-xs font-semibold text-mp-text-secondary">
                Grupo {g.groupIndex + 1}
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
                        key={row.team._id}
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
