import Link from "next/link";
import type { MatchDoc } from "@/lib/types/tournament";
import type { Team } from "@/lib/types/team";
import type { TournamentDetail } from "@/lib/types/tournament";
import { categoryLabel } from "@/lib/format/category";
import { divisionLabel } from "@/lib/format/division";
import { teamNameById } from "@/lib/format/teamName";
import { DataRefreshButton } from "@/components/match/DataRefreshButton";
import { IconArrowBack } from "@/components/icons/MatchpointIcons";

function statusLabel(s: string | undefined) {
  switch (s) {
    case "scheduled":
      return "Programado";
    case "in_progress":
      return "En juego";
    case "completed":
      return "Finalizado";
    default:
      return s ?? "—";
  }
}

function stageLabel(stage: string | undefined) {
  if (stage === "classification") return "Clasificación";
  if (stage === "category") return "Categoría (Oro / Plata / Bronce)";
  return stage ?? "—";
}

export function MatchDetailView({
  tournament,
  teams,
  match,
}: {
  tournament: TournamentDetail;
  teams: Team[];
  match: MatchDoc;
}) {
  const tid = tournament._id;
  const nameA = teamNameById(teams, match.teamAId);
  const nameB = teamNameById(teams, match.teamBId);
  const winner =
    match.winnerId && match.teamAId && match.teamBId
      ? match.winnerId === match.teamAId
        ? nameA
        : match.winnerId === match.teamBId
          ? nameB
          : "—"
      : null;

  const sets = Array.isArray(match.setScores) ? match.setScores : [];

  return (
    <article className="rounded-2xl border border-mp-surface-light bg-mp-surface p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/tournaments/${encodeURIComponent(tid)}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-mp-yellow hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-yellow"
        >
          <IconArrowBack className="h-4 w-4 shrink-0" aria-hidden />
          Volver al torneo
        </Link>
        <DataRefreshButton />
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-mp-text-muted">
        {tournament.name}
      </p>
      <h1 className="mt-1 text-xl font-bold italic text-white sm:text-2xl">
        {nameA} <span className="font-normal text-mp-text-muted">vs</span> {nameB}
      </h1>

      <dl className="mt-6 grid gap-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-mp-surface-light pb-2">
          <dt className="text-mp-text-muted">Estado</dt>
          <dd className="font-medium text-mp-text">{statusLabel(match.status)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-mp-surface-light pb-2">
          <dt className="text-mp-text-muted">Etapa</dt>
          <dd className="font-medium text-mp-text">{stageLabel(match.stage)}</dd>
        </div>
        {match.division ? (
          <div className="flex justify-between gap-4 border-b border-mp-surface-light pb-2">
            <dt className="text-mp-text-muted">División</dt>
            <dd className="font-medium text-mp-text">{divisionLabel(match.division)}</dd>
          </div>
        ) : null}
        {match.groupIndex != null ? (
          <div className="flex justify-between gap-4 border-b border-mp-surface-light pb-2">
            <dt className="text-mp-text-muted">Grupo</dt>
            <dd className="font-medium text-mp-text">
              {Number.isFinite(match.groupIndex) ? match.groupIndex + 1 : "—"}
            </dd>
          </div>
        ) : null}
        {match.category ? (
          <div className="flex justify-between gap-4 border-b border-mp-surface-light pb-2">
            <dt className="text-mp-text-muted">Categoría</dt>
            <dd className="font-medium text-mp-text">{categoryLabel(match.category)}</dd>
          </div>
        ) : null}
      </dl>

      <section className="mt-8" aria-labelledby="score-h">
        <h2 id="score-h" className="text-sm font-bold uppercase italic text-mp-yellow">
          Marcador
        </h2>
        <div className="mt-3 rounded-xl border border-mp-violet/35 bg-mp-bg/50 p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-mp-text">{nameA}</p>
              {match.winnerId && match.teamAId && match.winnerId === match.teamAId ? (
                <p className="text-xs text-mp-yellow">Ganador</p>
              ) : null}
            </div>
            <div className="text-center font-mono text-2xl font-bold tabular-nums text-white">
              {match.pointsA != null && match.pointsB != null ? (
                <>
                  {match.pointsA} — {match.pointsB}
                </>
              ) : match.setsWonA != null || match.setsWonB != null ? (
                <>
                  Sets {match.setsWonA ?? 0} — {match.setsWonB ?? 0}
                </>
              ) : (
                <span className="text-base font-normal text-mp-text-muted">—</span>
              )}
            </div>
            <div className="min-w-0 flex-1 text-right">
              <p className="truncate text-sm font-semibold text-mp-text">{nameB}</p>
              {match.winnerId && match.teamBId && match.winnerId === match.teamBId ? (
                <p className="text-xs text-mp-yellow">Ganador</p>
              ) : null}
            </div>
          </div>
          {sets.length > 0 ? (
            <ul className="mt-4 space-y-1 border-t border-mp-surface-light pt-3 text-sm text-mp-text-secondary">
              {sets.map((row, i) => {
                const pa = Number(row?.pointsA);
                const pb = Number(row?.pointsB);
                if (!Number.isFinite(pa) || !Number.isFinite(pb)) return null;
                return (
                  <li key={i} className="flex justify-between font-mono tabular-nums">
                    <span>Set {i + 1}</span>
                    <span>
                      {pa} — {pb}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
        {winner && match.status === "completed" ? (
          <p className="mt-3 text-sm text-mp-text-secondary">
            Resultado: <span className="font-medium text-mp-text">{winner}</span>
          </p>
        ) : null}
      </section>

      {match.createdAt ? (
        <p className="mt-6 text-xs text-mp-text-muted">
          Creado:{" "}
          {new Date(match.createdAt).toLocaleString("es-AR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      ) : null}
      {match.updatedAt ? (
        <p className="mt-1 text-xs text-mp-text-muted">
          Actualizado:{" "}
          {new Date(match.updatedAt).toLocaleString("es-AR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      ) : null}
    </article>
  );
}
