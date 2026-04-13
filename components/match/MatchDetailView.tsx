import Link from "next/link";
import type { MatchDoc } from "@/lib/types/tournament";
import type { Team } from "@/lib/types/team";
import type { TournamentDetail } from "@/lib/types/tournament";
import { categoryLabel } from "@/lib/format/category";
import { divisionLabel } from "@/lib/format/division";
import { teamNameById } from "@/lib/format/teamName";
import { DataRefreshButton } from "@/components/match/DataRefreshButton";
import { IconArrowBack, IconTrophy } from "@/components/icons/MatchpointIcons";

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

/** Aligns with mobile `match/[matchId].tsx` scoreboard: yellow vs violet columns, italic black headline. */
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
          : null
      : null;

  const sets = Array.isArray(match.setScores) ? match.setScores : [];

  const setsPerMatch = Math.max(
    1,
    Number(match.setsPerMatch ?? tournament.setsPerMatch ?? 1) || 1,
  );
  const swA = Math.floor(Number(match.setsWonA ?? 0));
  const swB = Math.floor(Number(match.setsWonB ?? 0));
  const currentSet = Math.min(setsPerMatch, Math.max(1, swA + swB + 1));

  /** Rally points in columns (mobile); if missing on completed, fall back to sets won. */
  const useRallyPoints =
    (match.pointsA != null && match.pointsB != null) ||
    match.status === "in_progress" ||
    match.status === "scheduled";

  const leftBig = useRallyPoints
    ? Number(match.pointsA ?? 0)
    : Number(match.setsWonA ?? 0);
  const rightBig = useRallyPoints
    ? Number(match.pointsB ?? 0)
    : Number(match.setsWonB ?? 0);
  const boardShowsSetsOnly = !useRallyPoints;

  const isCompleted = match.status === "completed";
  const winnerA = isCompleted && match.winnerId && match.teamAId === match.winnerId;
  const winnerB = isCompleted && match.winnerId && match.teamBId === match.winnerId;
  const loserDimA =
    isCompleted &&
    !!match.winnerId &&
    !!match.teamAId &&
    match.winnerId !== match.teamAId;
  const loserDimB =
    isCompleted &&
    !!match.winnerId &&
    !!match.teamBId &&
    match.winnerId !== match.teamBId;

  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/tournaments/${encodeURIComponent(tid)}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-mp-yellow hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-yellow"
        >
          <IconArrowBack className="h-4 w-4 shrink-0" aria-hidden />
          Volver al torneo
        </Link>
        <DataRefreshButton />
      </div>

      <div className="rounded-2xl border border-mp-surface-light bg-mp-surface p-4 sm:p-6">
        <p className="text-center text-[11px] font-black uppercase italic tracking-[0.08em] text-mp-text-muted">
          {tournament.name}
        </p>

        <div className="mt-3 flex flex-col items-center text-center">
          <p className="max-w-full text-base font-black italic uppercase leading-tight sm:text-lg">
            <span className="text-mp-yellow">{nameA}</span>{" "}
            <span className="text-mp-text-muted">VS</span>{" "}
            <span className="text-mp-violet">{nameB}</span>
          </p>
          {(swA > 0 || swB > 0 || match.status === "in_progress") && (
            <p className="mt-1 text-center text-xs font-black uppercase italic tracking-wide text-mp-text-muted">
              Set {currentSet} de {setsPerMatch} · Sets {swA} — {swB}
            </p>
          )}
        </div>

        {isCompleted && winner ? (
          <div className="mt-4 flex justify-center">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-green-500/35 bg-green-500/15 px-3 py-1"
              role="status"
            >
              <IconTrophy className="h-4 w-4 text-green-500" aria-hidden />
              <span className="text-[11px] font-black uppercase tracking-wide text-mp-text-muted">
                Finalizado · {winner}
              </span>
            </div>
          </div>
        ) : null}

        {/* Mobile-style scoreBoard: two columns, yellow tint | violet tint */}
        <div
          className={`mt-6 flex overflow-hidden rounded-2xl border border-mp-surface-light ${
            isCompleted ? "bg-mp-surface" : ""
          }`}
        >
          <div
            className={`flex min-h-[220px] min-w-0 flex-1 flex-col items-center justify-center px-3 pb-4 pt-3 sm:min-h-[260px] sm:px-4 ${
              isCompleted
                ? "border-b-2 border-l-2 border-t-2 border-mp-yellow/45 bg-transparent"
                : "bg-[rgba(251,191,36,0.22)]"
            }`}
          >
            <p className="line-clamp-2 w-full text-center text-[13px] font-black uppercase text-mp-text-secondary">
              {nameA}
            </p>
            {boardShowsSetsOnly ? (
              <p className="mt-1 text-[10px] font-black uppercase italic text-mp-text-muted">
                Sets ganados
              </p>
            ) : null}
            <div className="flex min-h-0 flex-1 w-full items-center justify-center py-2">
              <span
                className={`max-w-full text-center text-6xl font-black italic leading-none tabular-nums text-mp-yellow sm:text-7xl md:text-8xl ${
                  loserDimA ? "opacity-30" : ""
                }`}
              >
                {leftBig}
              </span>
            </div>
            {winnerA ? (
              <p className="text-[11px] font-black uppercase text-mp-yellow">Ganador</p>
            ) : null}
          </div>

          <div className="w-px shrink-0 self-stretch bg-mp-surface-light" aria-hidden />

          <div
            className={`flex min-h-[220px] min-w-0 flex-1 flex-col items-center justify-center px-3 pb-4 pt-3 sm:min-h-[260px] sm:px-4 ${
              isCompleted
                ? "border-b-2 border-r-2 border-t-2 border-[rgba(139,92,246,0.45)] bg-transparent"
                : "bg-[rgba(139,92,246,0.22)]"
            }`}
          >
            <p className="line-clamp-2 w-full text-center text-[13px] font-black uppercase text-mp-text-secondary">
              {nameB}
            </p>
            {boardShowsSetsOnly ? (
              <p className="mt-1 text-[10px] font-black uppercase italic text-mp-text-muted">
                Sets ganados
              </p>
            ) : null}
            <div className="flex min-h-0 flex-1 w-full items-center justify-center py-2">
              <span
                className={`max-w-full text-center text-6xl font-black italic leading-none tabular-nums text-mp-violet sm:text-7xl md:text-8xl ${
                  loserDimB ? "opacity-30" : ""
                }`}
              >
                {rightBig}
              </span>
            </div>
            {winnerB ? (
              <p className="text-[11px] font-black uppercase text-mp-violet">Ganador</p>
            ) : null}
          </div>
        </div>

        {winner && isCompleted ? (
          <p className="mt-4 text-center text-sm text-mp-text-secondary">
            Resultado: <span className="font-semibold text-mp-text">{winner}</span>
          </p>
        ) : null}

        {sets.length > 0 ? (
          <ul className="mt-4 space-y-1.5 border-t border-mp-surface-light pt-4 text-sm text-mp-text-secondary">
            {sets.map((row, i) => {
              const pa = Number(row?.pointsA);
              const pb = Number(row?.pointsB);
              if (!Number.isFinite(pa) || !Number.isFinite(pb)) return null;
              return (
                <li
                  key={i}
                  className="flex justify-between rounded-lg bg-mp-bg/40 px-3 py-2 font-mono text-mp-text tabular-nums"
                >
                  <span className="text-mp-text-muted">Set {i + 1}</span>
                  <span>
                    <span className="text-mp-yellow">{pa}</span>
                    <span className="mx-2 text-mp-text-muted">—</span>
                    <span className="text-mp-violet">{pb}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <dl className="rounded-2xl border border-mp-surface-light bg-mp-surface/80 p-4 text-sm">
        <div className="flex justify-between gap-4 border-b border-mp-surface-light pb-3">
          <dt className="text-xs font-extrabold text-mp-text-secondary">Estado</dt>
          <dd className="font-semibold text-mp-text">{statusLabel(match.status)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-mp-surface-light py-3">
          <dt className="text-xs font-extrabold text-mp-text-secondary">Etapa</dt>
          <dd className="text-right font-semibold text-mp-text">{stageLabel(match.stage)}</dd>
        </div>
        {match.division ? (
          <div className="flex justify-between gap-4 border-b border-mp-surface-light py-3">
            <dt className="text-xs font-extrabold text-mp-text-secondary">División</dt>
            <dd className="text-right font-semibold text-mp-text">
              {divisionLabel(match.division)}
            </dd>
          </div>
        ) : null}
        {match.groupIndex != null ? (
          <div className="flex justify-between gap-4 border-b border-mp-surface-light py-3">
            <dt className="text-xs font-extrabold text-mp-text-secondary">Grupo</dt>
            <dd className="text-right font-semibold text-mp-text">
              {Number.isFinite(match.groupIndex) ? match.groupIndex + 1 : "—"}
            </dd>
          </div>
        ) : null}
        {match.category ? (
          <div className="flex justify-between gap-4 pt-3">
            <dt className="text-xs font-extrabold text-mp-text-secondary">Categoría</dt>
            <dd className="text-right font-semibold text-mp-text">
              {categoryLabel(match.category)}
            </dd>
          </div>
        ) : null}
      </dl>

      {(match.createdAt || match.updatedAt) && (
        <div className="text-xs text-mp-text-muted">
          {match.createdAt ? (
            <p>
              Creado:{" "}
              {new Date(match.createdAt).toLocaleString("es-AR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          ) : null}
          {match.updatedAt ? (
            <p className={match.createdAt ? "mt-1" : ""}>
              Actualizado:{" "}
              {new Date(match.updatedAt).toLocaleString("es-AR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          ) : null}
        </div>
      )}
    </article>
  );
}
