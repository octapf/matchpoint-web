"use client";

import { useEffect } from "react";
import { IoHome, IoPersonCircleOutline, IoTrophyOutline } from "react-icons/io5";
import { ScreenHeader } from "@/components/ScreenHeader";
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

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-mp-bg">
      <div className="sticky top-0 z-10 bg-mp-bg px-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <ScreenHeader title="Torneos" />
      </div>

      <main
        id="main-content"
        className="flex flex-1 flex-col px-4 pb-24"
        tabIndex={-1}
      >
        {!configured && (
          <div
            className="mt-6 rounded-2xl border border-mp-surface-light bg-mp-surface px-5 py-6 text-center"
            role="status"
          >
            <p className="text-base font-bold text-mp-text">
              API no configurada
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mp-text-muted">
              Definí{" "}
              <code className="rounded bg-mp-surface-light px-1.5 py-0.5 text-xs text-mp-yellow">
                NEXT_PUBLIC_MATCHPOINT_API_URL
              </code>{" "}
              en <code className="text-xs">.env.local</code> apuntando al
              despliegue de Matchpoint.
            </p>
          </div>
        )}

        {configured && listStatus === "loading" && (
          <p className="mt-8 text-center text-mp-text-secondary" role="status">
            Cargando torneos…
          </p>
        )}

        {configured && listStatus === "failed" && listError && (
          <div
            className="mt-6 rounded-xl border border-red-500/40 bg-mp-surface px-4 py-3 text-sm text-mp-error"
            role="alert"
          >
            {listError}
          </div>
        )}

        {configured && listStatus === "succeeded" && list.length === 0 && (
          <div
            className="mt-8 rounded-2xl border border-mp-surface-light bg-mp-surface px-5 py-6 text-center"
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

        {list.map((t) => (
          <TournamentCard key={t._id} t={t} />
        ))}
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 border-t border-mp-surface-light bg-mp-surface px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        aria-label="Navegación principal"
      >
        <ul className="flex items-stretch justify-around gap-1">
          <li className="flex flex-1 flex-col items-center justify-center py-2 text-mp-tab-inactive">
            <IoHome className="text-2xl" aria-hidden />
            <span className="mt-0.5 text-[11px]">Inicio</span>
          </li>
          <li className="flex flex-1 flex-col items-center justify-center py-2 text-mp-tab-active">
            <IoTrophyOutline className="text-2xl" aria-hidden />
            <span className="mt-0.5 text-[11px] font-medium">Torneos</span>
          </li>
          <li className="flex flex-1 flex-col items-center justify-center py-2 text-mp-tab-inactive opacity-50">
            <IoPersonCircleOutline className="text-2xl" aria-hidden />
            <span className="mt-0.5 text-[11px]">Perfil</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}
