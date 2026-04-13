"use client";

import { useMemo, useState } from "react";
import type { Team } from "@/lib/types/team";
import type { MatchDoc } from "@/lib/types/tournament";
import type { TournamentCategory, TournamentDivision } from "@/lib/types/tournament";
import { TabFilterBar } from "@/components/tournament-detail/TabFilterBar";
import { categoryLabel } from "@/lib/format/category";
import { divisionLabel } from "@/lib/format/division";
import { computeTeamMatchStats } from "@/lib/stats/teamMatchStats";

export function TabEquipos({
  teams,
  matches,
}: {
  teams: Team[];
  matches: MatchDoc[];
}) {
  const [division, setDivision] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [group, setGroup] = useState<string>("all");

  const stats = useMemo(
    () => computeTeamMatchStats(
      teams.map((t) => t._id),
      matches,
    ),
    [teams, matches],
  );

  const divisionOpts = useMemo(() => {
    const s = new Set<string>();
    for (const t of teams) {
      if (t.division) s.add(t.division);
    }
    return Array.from(s).sort();
  }, [teams]);

  const categoryOpts = useMemo(() => {
    const s = new Set<string>();
    for (const t of teams) {
      if (t.category) s.add(String(t.category));
    }
    return Array.from(s).sort();
  }, [teams]);

  const groupOpts = useMemo(() => {
    const s = new Set<string>();
    for (const t of teams) {
      if (typeof t.groupIndex === "number") s.add(String(t.groupIndex));
    }
    return Array.from(s).sort((a, b) => Number(a) - Number(b));
  }, [teams]);

  const filtered = useMemo(() => {
    return teams.filter((t) => {
      if (division !== "all" && (t.division ?? "") !== division) return false;
      if (category !== "all" && String(t.category ?? "") !== category) return false;
      if (group !== "all") {
        const gi = typeof t.groupIndex === "number" ? String(t.groupIndex) : "";
        if (gi !== group) return false;
      }
      return true;
    });
  }, [teams, division, category, group]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const da = a.division ?? "";
      const db = b.division ?? "";
      if (da !== db) return da.localeCompare(db);
      return (a.name ?? "").localeCompare(b.name ?? "");
    });
  }, [filtered]);

  if (teams.length === 0) {
    return (
      <p className="text-sm text-mp-text-muted" role="status">
        No hay equipos cargados aún.
      </p>
    );
  }

  return (
    <div>
      <TabFilterBar
        filters={[
          {
            id: "f-e-div",
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
            id: "f-e-cat",
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
            id: "f-e-gr",
            label: "Grupo",
            value: group,
            options: [
              { value: "all", label: "Todos" },
              ...groupOpts.map((g) => ({
                value: g,
                label: `Grupo ${Number(g) + 1}`,
              })),
            ],
            onChange: setGroup,
          },
        ]}
      />
      <div className="overflow-x-auto rounded-lg border border-mp-surface-light">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-mp-surface-light bg-mp-surface/80">
              <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                Equipo
              </th>
              <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                División
              </th>
              <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                Cat.
              </th>
              <th scope="col" className="px-3 py-2 font-semibold text-mp-text">
                Grupo
              </th>
              <th scope="col" className="px-3 py-2 text-center font-semibold text-mp-text">
                PJ
              </th>
              <th scope="col" className="px-3 py-2 text-center font-semibold text-mp-text">
                PG
              </th>
              <th scope="col" className="px-3 py-2 text-center font-semibold text-mp-text">
                PP
              </th>
              <th scope="col" className="px-3 py-2 text-center font-semibold text-mp-text">
                Pts+
              </th>
              <th scope="col" className="px-3 py-2 text-center font-semibold text-mp-text">
                Pts−
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team) => {
              const st = stats[team._id];
              return (
                <tr
                  key={team._id}
                  className="border-b border-mp-surface-light/80 last:border-0"
                >
                  <td className="px-3 py-2 font-semibold text-mp-text">{team.name}</td>
                  <td className="px-3 py-2 text-mp-text-secondary">
                    {divisionLabel(team.division)}
                  </td>
                  <td className="px-3 py-2 text-mp-text-secondary">
                    {team.category
                      ? categoryLabel(team.category as TournamentCategory)
                      : "—"}
                  </td>
                  <td className="px-3 py-2 text-mp-text-muted">
                    {typeof team.groupIndex === "number"
                      ? team.groupIndex + 1
                      : "—"}
                  </td>
                  <td className="px-3 py-2 text-center text-mp-text-secondary">
                    {st?.played ?? 0}
                  </td>
                  <td className="px-3 py-2 text-center text-mp-text-secondary">
                    {st?.wins ?? 0}
                  </td>
                  <td className="px-3 py-2 text-center text-mp-text-secondary">
                    {st?.losses ?? 0}
                  </td>
                  <td className="px-3 py-2 text-center text-mp-text-secondary">
                    {st?.ptsFor ?? 0}
                  </td>
                  <td className="px-3 py-2 text-center text-mp-text-secondary">
                    {st?.ptsAgainst ?? 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-mp-text-muted">
        PJ/PG/PP y puntos: partidos <strong>finalizados</strong> (clasificación y categoría).
      </p>
    </div>
  );
}
