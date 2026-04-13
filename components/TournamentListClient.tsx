"use client";

import { useCallback, useEffect, useState } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TournamentCard } from "@/components/TournamentCard";
import { isApiConfigured } from "@/lib/config";
import { loadTournaments } from "@/store/features/tournamentsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function TournamentListClient() {
  const dispatch = useAppDispatch();
  const { list, listStatus, listError } = useAppSelector((s) => s.tournaments);
  const configured = isApiConfigured();

  useEffect(() => {
    if (!configured) return;
    void dispatch(loadTournaments(undefined));
  }, [dispatch, configured]);

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

  return (
    <div className="flex min-h-screen flex-col bg-mp-bg">
      <SiteHeader
        variant="list"
        onRefresh={configured ? handleRefresh : undefined}
        refreshPending={refreshing}
      />

      <main
        id="main-content"
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8"
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

        {configured && listStatus === "succeeded" && list.length === 0 && (
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

        {list.length > 0 && (
          <ul className="grid list-none grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((t) => (
              <li key={t._id} className="min-w-0">
                <TournamentCard t={t} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
