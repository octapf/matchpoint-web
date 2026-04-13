"use client";

import { useMemo, useState } from "react";
import type { Entry, EntryStatus } from "@/lib/types/entry";
import type { Team } from "@/lib/types/team";
import { IconPeople, IconPersonOutline } from "@/components/icons/MatchpointIcons";
import { TabFilterBar } from "@/components/tournament-detail/TabFilterBar";
import { shortId } from "@/lib/format/shortId";

function entryUserLabel(e: Entry, teams: Team[]): string {
  const s = e.userDisplayName?.trim();
  if (s) return s;
  const d = e.displayName?.trim();
  if (d) return d;
  const u = e.user;
  if (u && typeof u === "object") {
    const dn = u.displayName?.trim();
    if (dn) return dn;
    const n = u.name?.trim();
    if (n) return n;
  }
  if (e.teamId) {
    const team = teams.find((t) => t._id === e.teamId);
    const ids = team?.playerIds;
    if (team && ids?.length) {
      const idx = ids.indexOf(e.userId);
      if (idx >= 0) {
        return `${team.name} · ${idx + 1}`;
      }
    }
  }
  return shortId(e.userId);
}

function statusLabel(status: EntryStatus | undefined): string {
  if (status === "in_team") return "En equipo";
  if (status === "joined") return "Inscripto";
  return "Sin estado";
}

export function TabJugadores({
  entries,
  teams,
}: {
  entries: Entry[];
  teams: Team[];
}) {
  const [estado, setEstado] = useState<string>("all");
  const [busca, setBusca] = useState<string>("all");

  const teamName = (teamId: string | null | undefined) => {
    if (!teamId) return "—";
    const tm = teams.find((x) => x._id === teamId);
    return tm?.name ?? shortId(teamId);
  };

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (estado === "in_team" && e.status !== "in_team") return false;
      if (estado === "joined" && e.status !== "joined") return false;
      if (busca === "yes" && !e.lookingForPartner) return false;
      if (busca === "no" && e.lookingForPartner) return false;
      return true;
    });
  }, [entries, estado, busca]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) =>
      String(a.userId).localeCompare(String(b.userId)),
    );
  }, [filtered]);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-mp-text-muted" role="status">
        No hay datos de inscripciones o la API no devolvió entradas.
      </p>
    );
  }

  return (
    <div>
      <TabFilterBar
        filters={[
          {
            id: "f-j-estado",
            label: "Estado",
            value: estado,
            options: [
              { value: "all", label: "Todos" },
              { value: "in_team", label: "En equipo" },
              { value: "joined", label: "Inscripto" },
            ],
            onChange: setEstado,
          },
          {
            id: "f-j-busca",
            label: "Busca pareja",
            value: busca,
            options: [
              { value: "all", label: "Todos" },
              { value: "yes", label: "Sí" },
              { value: "no", label: "No" },
            ],
            onChange: setBusca,
          },
        ]}
      />
      <div className="overflow-x-auto rounded-lg border border-mp-surface-light">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead>
            <tr className="border-b border-mp-surface-light bg-mp-surface/80">
              <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                Usuario
              </th>
              <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                Equipo
              </th>
              <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => {
              const label = entryUserLabel(e, teams);
              const idOnly = label === shortId(e.userId);
              return (
                <tr
                  key={e._id}
                  className="border-b border-mp-surface-light/80 last:border-0"
                >
                  <td
                    className={`px-3 py-2 ${
                      idOnly
                        ? "font-mono text-xs text-mp-text-secondary"
                        : "text-mp-text"
                    }`}
                    title={e.userId}
                  >
                    {label}
                  </td>
                  <td className="px-3 py-2 text-mp-text">{teamName(e.teamId)}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 text-mp-text-secondary"
                        title={statusLabel(e.status)}
                      >
                        <span className="sr-only">{statusLabel(e.status)}</span>
                        {e.status === "in_team" ? (
                          <IconPeople
                            className="h-5 w-5 shrink-0 text-mp-yellow"
                            aria-hidden
                          />
                        ) : e.status === "joined" ? (
                          <IconPersonOutline
                            className="h-5 w-5 shrink-0 text-mp-text-secondary"
                            aria-hidden
                          />
                        ) : (
                          <span className="text-xs">—</span>
                        )}
                      </span>
                      {e.lookingForPartner ? (
                        <span className="text-[10px] text-mp-text-muted">busca pareja</span>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
