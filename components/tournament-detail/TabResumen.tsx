import type { TournamentDetail } from "@/lib/types/tournament";

type TabResumenProps = {
  tournament: TournamentDetail;
  formatRange: (start: string, end: string) => string;
};

export function TabResumen({ tournament: t, formatRange }: TabResumenProps) {
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
      <p className="text-xs text-mp-text-muted">
        Vista solo lectura. Inscripciones y gestión en la app Matchpoint.
      </p>
    </div>
  );
}
