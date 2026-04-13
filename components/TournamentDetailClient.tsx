"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getTournamentPollIntervalMs, isApiConfigured } from "@/lib/config";
import {
  clearTournamentPage,
  loadTournamentPage,
  refreshTournamentPage,
} from "@/store/features/tournamentsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { DetailTabs } from "@/components/tournament-detail/DetailTabs";
import type { DetailTabId } from "@/components/tournament-detail/DetailTabs";
import { TabResumen } from "@/components/tournament-detail/TabResumen";
import { TabEquipos } from "@/components/tournament-detail/TabEquipos";
import { TabJugadores } from "@/components/tournament-detail/TabJugadores";
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
  const dispatch = useAppDispatch();
  const { page, detailStatus, detailError } = useAppSelector((s) => s.tournaments);
  const configured = isApiConfigured();

  const pollMs = getTournamentPollIntervalMs();

  useEffect(() => {
    if (!configured) return;
    void dispatch(loadTournamentPage(id));
    return () => {
      dispatch(clearTournamentPage());
    };
  }, [dispatch, id, configured]);

  /** Near–live updates: re-fetch detail + teams on an interval; pause when tab is hidden. */
  useEffect(() => {
    if (!configured || pollMs <= 0 || detailStatus !== "succeeded") return;

    const run = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }
      void dispatch(refreshTournamentPage(id));
    };

    const intervalId = window.setInterval(run, pollMs);
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        run();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [configured, detailStatus, dispatch, id, pollMs]);

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    if (!configured) return;
    setRefreshing(true);
    try {
      await dispatch(refreshTournamentPage(id)).unwrap();
    } catch {
      /* keep last good payload */
    } finally {
      setRefreshing(false);
    }
  }, [configured, dispatch, id]);

  const tournament = page?.tournament;
  const teams = page?.teams ?? [];
  const entries = page?.entries ?? [];

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
      return (
        <TabEquipos teams={teams} matches={tournament.matches ?? []} />
      );
    }
    if (tab === "jugadores") {
      return <TabJugadores entries={entries} teams={teams} />;
    }
    if (tab === "partidos") {
      return (
        <TabPartidos
          tournamentId={tournament._id}
          matches={tournament.matches ?? []}
          teams={teams}
        />
      );
    }
    if (tab === "clasificacion") {
      return <TabClasificacion standings={tournament.standings ?? []} />;
    }
    return null;
  };

  const headerTitle =
    tournament?.name ??
    (detailStatus === "loading" ? "Cargando…" : "Torneo");

  return (
    <div className="flex min-h-screen flex-col bg-mp-bg">
      <SiteHeader
        variant="detail"
        title={headerTitle}
        onRefresh={configured && detailStatus === "succeeded" ? handleRefresh : undefined}
        refreshPending={refreshing}
      />

      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
        tabIndex={-1}
      >
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
          <article className="rounded-2xl border border-mp-surface-light bg-mp-surface p-5 sm:p-8">
            {pollMs > 0 ? (
              <p className="mb-4 text-xs text-mp-text-muted" role="status">
                Actualización automática cada {Math.round(pollMs / 1000)} s con la página
                visible (partidos y clasificación se refrescan desde la API).
              </p>
            ) : null}
            <p className="text-sm text-mp-text-muted">
              {formatRange(tournament.startDate, tournament.endDate)}
            </p>
            <p className="mt-1 text-base text-mp-text-secondary">
              {tournament.location}
            </p>

            <DetailTabs hasMatches={hasMatches} hasStandings={hasStandings}>
              {(active) => renderTab(active)}
            </DetailTabs>
          </article>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
