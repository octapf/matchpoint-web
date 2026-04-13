"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HomeTournamentDetail } from "@/components/home/HomeTournamentDetail";
import { TournamentPickCard } from "@/components/home/TournamentPickCard";
import { TournamentsCalendar } from "@/components/home/TournamentsCalendar";
import { parseLocalDay } from "@/lib/date/calendarHelpers";
import { isApiConfigured } from "@/lib/config";
import { loadTournaments } from "@/store/features/tournamentsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function TournamentListClient() {
  const dispatch = useAppDispatch();
  const { list, listStatus, listError } = useAppSelector((s) => s.tournaments);
  const configured = isApiConfigured();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  useEffect(() => {
    if (!configured) return;
    void dispatch(loadTournaments(undefined));
  }, [dispatch, configured]);

  const sortedList = useMemo(() => {
    return [...list].sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));
  }, [list]);

  useEffect(() => {
    if (sortedList.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !sortedList.some((t) => t._id === selectedId)) {
      const first = sortedList[0]!;
      setSelectedId(first._id);
      const d = parseLocalDay(first.startDate);
      setVisibleMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [sortedList, selectedId]);

  const selectedTournament = useMemo(
    () => sortedList.find((t) => t._id === selectedId) ?? null,
    [sortedList, selectedId],
  );

  const selectTournament = useCallback((id: string) => {
    setSelectedId(id);
    const t = sortedList.find((x) => x._id === id);
    if (t) {
      const d = parseLocalDay(t.startDate);
      setVisibleMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [sortedList]);

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    if (!configured) return;
    setRefreshing(true);
    try {
      await dispatch(loadTournaments(undefined)).unwrap();
    } catch {
      /* listError surfaces below */
    } finally {
      setRefreshing(false);
    }
  }, [configured, dispatch]);

  const onPrevMonth = useCallback(() => {
    setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }, []);

  const onNextMonth = useCallback(() => {
    setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-mp-bg">
      <SiteHeader
        variant="list"
        onRefresh={configured ? handleRefresh : undefined}
        refreshPending={refreshing}
      />

      <main
        id="main-content"
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 xl:max-w-[100rem]"
        tabIndex={-1}
      >
        {!configured && (
          <div
            className="rounded-2xl border border-mp-surface-light bg-mp-surface px-5 py-6 text-center"
            role="status"
          >
            <p className="text-base font-bold text-mp-text">
              API no configurada
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mp-text-muted">
              En Vercel o <code className="text-xs">.env.local</code>, la variable{" "}
              <code className="rounded bg-mp-surface-light px-1.5 py-0.5 text-xs text-mp-yellow">
                NEXT_PUBLIC_MATCHPOINT_API_URL
              </code>{" "}
              debe tener como <strong className="text-mp-text">valor</strong> la URL
              completa del backend, p. ej.{" "}
              <code className="text-xs text-mp-yellow">https://matchpoint.miralab.ar</code>{" "}
              (con <code className="text-xs">https://</code>). No pongas el nombre de la
              variable como valor.
            </p>
          </div>
        )}

        {configured && listStatus === "loading" && (
          <p className="text-center text-mp-text-secondary" role="status">
            Cargando torneos…
          </p>
        )}

        {configured && listStatus === "failed" && listError && (
          <div
            className="rounded-xl border border-red-500/40 bg-mp-surface px-4 py-3 text-sm text-mp-error"
            role="alert"
          >
            {listError}
          </div>
        )}

        {configured && listStatus === "succeeded" && sortedList.length === 0 && (
          <div
            className="rounded-2xl border border-mp-surface-light bg-mp-surface px-5 py-6 text-center"
            role="status"
          >
            <p className="text-base font-bold text-mp-text">
              No hay torneos públicos
            </p>
            <p className="mt-2 text-sm text-mp-text-muted">
              Cuando haya eventos visibles, aparecerán aquí.
            </p>
          </div>
        )}

        {sortedList.length > 0 && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:items-start xl:gap-4">
            <div className="min-w-0 xl:min-h-0">
              <TournamentsCalendar
                tournaments={sortedList}
                visibleMonth={visibleMonth}
                onPrevMonth={onPrevMonth}
                onNextMonth={onNextMonth}
                selectedId={selectedId}
                onSelectTournament={selectTournament}
              />
            </div>

            <div className="min-w-0 xl:min-h-0">
              <h2 className="mb-3 text-sm font-bold uppercase italic tracking-wide text-mp-yellow">
                Detalle del torneo
              </h2>
              <HomeTournamentDetail tournament={selectedTournament} />
            </div>

            <section
              className="flex min-h-0 min-w-0 flex-col xl:max-h-[calc(100vh-10rem)] xl:overflow-hidden"
              aria-labelledby="list-heading"
            >
              <h2
                id="list-heading"
                className="mb-3 shrink-0 text-sm font-bold uppercase italic tracking-wide text-mp-yellow"
              >
                Torneos
              </h2>
              <ul className="list-none space-y-3 overflow-y-auto pr-1 xl:flex-1 xl:min-h-0">
                {sortedList.map((t) => (
                  <li key={t._id} className="min-w-0">
                    <TournamentPickCard
                      t={t}
                      selected={t._id === selectedId}
                      onSelect={selectTournament}
                    />
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
