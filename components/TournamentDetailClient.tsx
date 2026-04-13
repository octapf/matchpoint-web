"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isApiConfigured } from "@/lib/config";
import {
  clearTournamentPage,
  loadTournamentPage,
} from "@/store/features/tournamentsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { DetailTabs } from "@/components/tournament-detail/DetailTabs";
import type { DetailTabId } from "@/components/tournament-detail/DetailTabs";
import { TabResumen } from "@/components/tournament-detail/TabResumen";
import { TabEquipos } from "@/components/tournament-detail/TabEquipos";
import { TabPartidos } from "@/components/tournament-detail/TabPartidos";
import { TabClasificacion } from "@/components/tournament-detail/TabClasificacion";

function formatRange(start: string, end: string) {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    if (s.toDateString() === e.toDateString()) {
      return s.toLocaleDateString("es-AR", opts);
    }
    return `${s.toLocaleDateString("es-AR", opts)} — ${e.toLocaleDateString("es-AR", opts)}`;
  } catch {
    return `${start} — ${end}`;
  }
}

export function TournamentDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { page, detailStatus, detailError } = useAppSelector((s) => s.tournaments);
  const configured = isApiConfigured();

  useEffect(() => {
    if (!configured) return;
    void dispatch(loadTournamentPage(id));
    return () => {
      dispatch(clearTournamentPage());
    };
  }, [dispatch, id, configured]);

  const tournament = page?.tournament;
  const teams = page?.teams ?? [];

  const hasMatches = useMemo(
    () => (tournament?.matches?.length ?? 0) > 0,
    [tournament?.matches?.length],
  );
  const hasStandings = useMemo(
    () => (tournament?.standings?.length ?? 0) > 0,
    [tournament?.standings?.length],
  );

  const renderTab = (tab: DetailTabId) => {
    if (!tournament) return null;
    if (tab === "resumen") {
      return <TabResumen tournament={tournament} formatRange={formatRange} />;
    }
    if (tab === "equipos") {
      return <TabEquipos teams={teams} />;
    }
    if (tab === "partidos") {
      return (
        <TabPartidos matches={tournament.matches ?? []} teams={teams} />
      );
    }
    return (
      <TabClasificacion standings={tournament.standings ?? []} />
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-mp-bg">
      <header className="sticky top-0 z-10 bg-mp-bg px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div className="relative flex min-h-[50px] items-center justify-center px-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-2 top-1/2 z-[1] -translate-y-1/2 rounded-md px-2 py-2 text-sm text-mp-text-secondary outline-none hover:text-mp-text focus-visible:ring-2 focus-visible:ring-mp-yellow"
            aria-label="Volver al listado"
          >
            ← Volver
          </button>
          <h1 className="line-clamp-2 max-w-[min(100%,280px)] px-12 text-center text-[13px] font-semibold italic tracking-wide text-white">
            {tournament?.name ?? "Torneo"}
          </h1>
        </div>
      </header>

      <main id="main-content" className="flex flex-1 flex-col px-4 pb-16" tabIndex={-1}>
        {!configured && (
          <p className="text-mp-text-muted" role="status">
            Configurá la URL de la API en{" "}
            <code className="text-mp-yellow">.env.local</code>.
          </p>
        )}

        {configured && detailStatus === "loading" && (
          <div className="animate-pulse space-y-4" role="status" aria-busy="true">
            <div className="h-40 rounded-2xl bg-mp-surface" />
            <div className="h-10 rounded-lg bg-mp-surface-light/60" />
            <div className="h-24 rounded-lg bg-mp-surface" />
          </div>
        )}

        {configured && detailStatus === "failed" && detailError && (
          <div className="rounded-xl border border-red-500/40 bg-mp-surface px-4 py-3 text-sm text-mp-error">
            {detailError}
            <div className="mt-4">
              <Link
                href="/"
                className="font-semibold text-mp-yellow underline underline-offset-2"
              >
                Volver al listado
              </Link>
            </div>
          </div>
        )}

        {tournament && detailStatus === "succeeded" && (
          <article className="rounded-2xl border border-mp-surface-light bg-mp-surface p-5">
            <p className="text-xs text-mp-text-muted">{formatRange(tournament.startDate, tournament.endDate)}</p>
            <p className="mt-1 text-sm text-mp-text-secondary">{tournament.location}</p>

            <DetailTabs hasMatches={hasMatches} hasStandings={hasStandings}>
              {(active) => renderTab(active)}
            </DetailTabs>
          </article>
        )}
      </main>
    </div>
  );
}
