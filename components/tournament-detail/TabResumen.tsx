import type { TournamentDetail } from "@/lib/types/tournament";
import { categoryLabel } from "@/lib/format/category";
import { divisionLabel } from "@/lib/format/division";

type TabResumenProps = {
  tournament: TournamentDetail;
  formatRange: (start: string, end: string) => string;
};

export function TabResumen({ tournament: t, formatRange }: TabResumenProps) {
  const snap = t.categoriesSnapshot;

  return (
    <div className="space-y-4">
      <p className="text-sm text-mp-text-secondary">
        {formatRange(t.startDate, t.endDate)}
      </p>
      <p className="text-sm text-mp-text-muted">{t.location}</p>
      {t.description ? (
        <p className="text-sm leading-relaxed text-mp-text-secondary">{t.description}</p>
      ) : null}
      <dl className="grid gap-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-mp-surface-light pb-2">
          <dt className="text-mp-text-muted">Estado</dt>
          <dd className="font-medium text-mp-text">{t.status}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-mp-surface-light pb-2">
          <dt className="text-mp-text-muted">Fase</dt>
          <dd className="font-medium text-mp-text">{t.phase ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-mp-surface-light pb-2">
          <dt className="text-mp-text-muted">Equipos inscriptos</dt>
          <dd className="font-medium text-mp-text">{t.teamsCount ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-mp-surface-light pb-2">
          <dt className="text-mp-text-muted">Jugadores</dt>
          <dd className="font-medium text-mp-text">{t.entriesCount ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-mp-surface-light pb-2">
          <dt className="text-mp-text-muted">Lista de espera</dt>
          <dd className="font-medium text-mp-text">{t.waitlistCount ?? 0}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-mp-surface-light pb-2">
          <dt className="text-mp-text-muted">Cupo máx. equipos</dt>
          <dd className="font-medium text-mp-text">{t.maxTeams}</dd>
        </div>
        {(t.pointsToWin != null || t.setsPerMatch != null) && (
          <div className="flex justify-between gap-4 pb-2">
            <dt className="text-mp-text-muted">Reglas</dt>
            <dd className="text-right font-medium text-mp-text">
              {t.pointsToWin != null ? `${t.pointsToWin} pts / set` : ""}
              {t.pointsToWin != null && t.setsPerMatch != null ? " · " : ""}
              {t.setsPerMatch != null ? `${t.setsPerMatch} set(s)` : ""}
            </dd>
          </div>
        )}
      </dl>

      {snap?.divisions?.length ? (
        <section className="rounded-xl border border-mp-violet/35 bg-mp-violet/5 p-4" aria-labelledby="cat-snap-h">
          <h3 id="cat-snap-h" className="text-sm font-bold text-mp-yellow">
            Categorías (Oro · Plata · Bronce)
          </h3>
          <p className="mt-1 text-xs text-mp-text-muted">
            Cuadros generados el{" "}
            {new Date(snap.computedAt).toLocaleString("es-AR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
          <ul className="mt-3 space-y-3">
            {snap.divisions.map((row, i) => (
              <li key={`${String(row.division)}-${i}`}>
                <p className="text-xs font-semibold uppercase text-mp-text-secondary">
                  {divisionLabel(String(row.division))}
                </p>
                <ul className="mt-1 space-y-1 pl-2">
                  {row.categories.map((c) => (
                    <li
                      key={c.category}
                      className="flex flex-wrap justify-between gap-2 text-sm text-mp-text"
                    >
                      <span>{categoryLabel(c.category)}</span>
                      <span className="text-mp-text-muted">
                        {c.teamIds?.length ?? 0} equipos · {c.matchIds?.length ?? 0}{" "}
                        partidos
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-mp-text-muted">
        Vista solo lectura. Inscripciones y gestión en la app Matchpoint.
      </p>
    </div>
  );
}
