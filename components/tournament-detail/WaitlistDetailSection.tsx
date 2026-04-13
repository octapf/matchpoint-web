import type { WaitlistByDivision } from "@/lib/types/waitlist";
import type { TournamentDivision } from "@/lib/types/tournament";
import { divisionLabel } from "@/lib/format/division";
import { shortId } from "@/lib/format/shortId";

const DIV_ORDER: TournamentDivision[] = ["men", "women", "mixed"];

export function WaitlistDetailSection({
  totalCount,
  waitlistByDivision,
}: {
  totalCount: number;
  waitlistByDivision: WaitlistByDivision;
}) {
  const anyRows = DIV_ORDER.some((d) => (waitlistByDivision[d]?.length ?? 0) > 0);

  if (totalCount === 0 && !anyRows) {
    return (
      <section
        className="rounded-xl border border-mp-surface-light bg-mp-bg/30 p-4"
        aria-labelledby="wl-empty-h"
      >
        <h3 id="wl-empty-h" className="text-sm font-bold text-mp-yellow">
          Lista de espera
        </h3>
        <p className="mt-2 text-sm text-mp-text-muted">
          No hay jugadores en lista de espera.
        </p>
      </section>
    );
  }

  if (totalCount > 0 && !anyRows) {
    return (
      <section
        className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
        role="status"
        aria-labelledby="wl-partial-h"
      >
        <h3 id="wl-partial-h" className="text-sm font-bold text-mp-yellow">
          Lista de espera
        </h3>
        <p className="mt-2 text-sm text-mp-text-secondary">
          Hay {totalCount} persona(s) en lista de espera, pero no se pudieron cargar el detalle. Probá
          actualizar la página.
        </p>
      </section>
    );
  }

  return (
    <section
      className="rounded-xl border border-mp-violet/35 bg-mp-violet/5 p-4"
      aria-labelledby="wl-detail-h"
    >
      <h3 id="wl-detail-h" className="text-sm font-bold text-mp-yellow">
        Detalle lista de espera
      </h3>
      <div className="mt-4 space-y-6">
        {DIV_ORDER.map((div) => {
          const rows = waitlistByDivision[div] ?? [];
          if (rows.length === 0) return null;
          return (
            <div key={div}>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-mp-text-secondary">
                {divisionLabel(div)}
              </h4>
              <div className="overflow-x-auto rounded-lg border border-mp-surface-light">
                <table className="w-full min-w-[280px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-mp-surface-light bg-mp-surface/80">
                      <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                        #
                      </th>
                      <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                        Usuario
                      </th>
                      <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                        Ingreso
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={`${div}-${row.userId}-${row.createdAt}-${i}`}
                        className="border-b border-mp-surface-light/80 last:border-0"
                      >
                        <td className="px-3 py-2 tabular-nums text-mp-text-muted">{i + 1}</td>
                        <td className="px-3 py-2 font-mono text-xs text-mp-text">
                          {shortId(row.userId)}
                        </td>
                        <td className="px-3 py-2 text-mp-text-secondary">
                          {row.createdAt
                            ? new Date(row.createdAt).toLocaleString("es-AR", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
