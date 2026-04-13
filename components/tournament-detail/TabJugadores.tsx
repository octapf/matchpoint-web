"use client";

import { useMemo, useState } from "react";
import type { Entry } from "@/lib/types/entry";
import type { Team } from "@/lib/types/team";
import { TabFilterBar } from "@/components/tournament-detail/TabFilterBar";
import { shortId } from "@/lib/format/shortId";

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
      <p className="mb-3 text-xs text-mp-text-muted">
        Identificadores de usuario (sin nombres públicos: la API de perfiles requiere sesión).
      </p>
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
            {sorted.map((e) => (
              <tr
                key={e._id}
                className="border-b border-mp-surface-light/80 last:border-0"
              >
                <td className="px-3 py-2 font-mono text-xs text-mp-text-secondary">
                  {shortId(e.userId)}
                </td>
                <td className="px-3 py-2 text-mp-text">{teamName(e.teamId)}</td>
                <td className="px-3 py-2 text-mp-text-muted">
                  {e.status ?? "—"}
                  {e.lookingForPartner ? " · busca pareja" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
