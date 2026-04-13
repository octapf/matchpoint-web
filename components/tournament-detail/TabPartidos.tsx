"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MatchDoc } from "@/lib/types/tournament";
import type { Team as TeamRow } from "@/lib/types/team";
import type { TournamentCategory, TournamentDivision } from "@/lib/types/tournament";
import { TabFilterBar } from "@/components/tournament-detail/TabFilterBar";
import { IconChevronForward } from "@/components/icons/MatchpointIcons";
import { categoryLabel } from "@/lib/format/category";
import { divisionLabel } from "@/lib/format/division";
import { teamNameById } from "@/lib/format/teamName";

export function TabPartidos({
  tournamentId,
  matches,
  teams,
}: {
  tournamentId: string;
  matches: MatchDoc[];
  teams: TeamRow[];
}) {
  const [stage, setStage] = useState<string>("all");
  const [division, setDivision] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const divisionOpts = useMemo(() => {
    const s = new Set<string>();
    for (const m of matches) {
      if (m.division) s.add(String(m.division));
    }
    return Array.from(s).sort();
  }, [matches]);

  const categoryOpts = useMemo(() => {
    const s = new Set<string>();
    for (const m of matches) {
      if (m.category) s.add(String(m.category));
    }
    return Array.from(s).sort();
  }, [matches]);

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (stage !== "all" && String(m.stage ?? "") !== stage) return false;
      if (division !== "all" && String(m.division ?? "") !== division) return false;
      if (category !== "all" && String(m.category ?? "") !== category) return false;
      if (status !== "all" && String(m.status ?? "") !== status) return false;
      return true;
    });
  }, [matches, stage, division, category, status]);

  const list = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const ca = String(a.createdAt ?? "");
      const cb = String(b.createdAt ?? "");
      return ca.localeCompare(cb);
    });
  }, [filtered]);

  if (matches.length === 0) {
    return (
      <p className="text-sm text-mp-text-muted" role="status">
        No hay partidos para mostrar.
      </p>
    );
  }

  return (
    <div>
      <TabFilterBar
        filters={[
          {
            id: "f-p-stage",
            label: "Etapa",
            value: stage,
            options: [
              { value: "all", label: "Todas" },
              { value: "classification", label: "Clasificación" },
              { value: "category", label: "Categoría (Oro/Plata/Bronce)" },
            ],
            onChange: setStage,
          },
          {
            id: "f-p-div",
            label: "División",
            value: division,
            options: [
              { value: "all", label: "Todas" },
              ...divisionOpts.map((d) => ({
                value: d,
                label: divisionLabel(d as TournamentDivision),
              })),
            ],
            onChange: setDivision,
          },
          {
            id: "f-p-cat",
            label: "Categoría",
            value: category,
            options: [
              { value: "all", label: "Todas" },
              ...categoryOpts.map((c) => ({
                value: c,
                label: categoryLabel(c as TournamentCategory),
              })),
            ],
            onChange: setCategory,
          },
          {
            id: "f-p-st",
            label: "Estado",
            value: status,
            options: [
              { value: "all", label: "Todos" },
              { value: "scheduled", label: "Programado" },
              { value: "in_progress", label: "En juego" },
              { value: "completed", label: "Finalizado" },
            ],
            onChange: setStatus,
          },
        ]}
      />
      {list.length === 0 ? (
        <p className="text-sm text-mp-text-muted" role="status">
          Ningún partido coincide con los filtros.
        </p>
      ) : (
        <ul className="space-y-2" aria-label="Partidos">
          {list.map((m) => {
            const left = teamNameById(teams, m.teamAId);
            const right = teamNameById(teams, m.teamBId);
            const score =
              m.status === "completed" &&
              m.pointsA != null &&
              m.pointsB != null
                ? `${m.pointsA} — ${m.pointsB}`
                : m.status === "completed" &&
                    (m.setsWonA != null || m.setsWonB != null)
                  ? `Sets ${m.setsWonA ?? 0} — ${m.setsWonB ?? 0}`
                  : m.status ?? "—";
            const href = `/tournaments/${encodeURIComponent(tournamentId)}/matches/${encodeURIComponent(m._id)}`;
            return (
              <li key={m._id}>
                <Link
                  href={href}
                  className="block rounded-lg border border-mp-surface-light bg-mp-bg/40 px-3 py-3 text-sm transition-colors hover:border-mp-violet/50 hover:bg-mp-bg/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-yellow"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-mp-text-secondary">
                      {m.stage === "classification"
                        ? "Clasificación"
                        : m.stage === "category"
                          ? "Categoría"
                          : m.stage ?? "—"}
                      {m.division ? ` · ${divisionLabel(m.division)}` : ""}
                      {m.category
                        ? ` · ${categoryLabel(m.category as TournamentCategory)}`
                        : ""}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-medium text-mp-yellow">{score}</span>
                      <IconChevronForward className="h-4 w-4 shrink-0 text-mp-text-muted" aria-hidden />
                    </span>
                  </div>
                  <p className="mt-2 font-medium text-mp-text">
                    {left} <span className="text-mp-text-muted">vs</span> {right}
                  </p>
                  <p className="mt-2 text-xs text-mp-yellow">Ver detalle del partido</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
