"use client";

import { useId, useState } from "react";

export type DetailTabId = "resumen" | "equipos" | "partidos" | "clasificacion";

const TABS: { id: DetailTabId; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "equipos", label: "Equipos" },
  { id: "partidos", label: "Partidos" },
  { id: "clasificacion", label: "Clasificación" },
];

type DetailTabsProps = {
  /** Hide tabs with no data (still allow resumen). */
  hasMatches: boolean;
  hasStandings: boolean;
  children: (active: DetailTabId) => React.ReactNode;
};

export function DetailTabs({
  hasMatches,
  hasStandings,
  children,
}: DetailTabsProps) {
  const baseId = useId();
  const visible = TABS.filter((tab) => {
    if (tab.id === "partidos") return hasMatches;
    if (tab.id === "clasificacion") return hasStandings;
    return true;
  });
  const [active, setActive] = useState<DetailTabId>("resumen");

  const effectiveActive = visible.some((t) => t.id === active)
    ? active
    : visible[0]?.id ?? "resumen";

  return (
    <div className="mt-4">
      <div
        role="tablist"
        aria-label="Secciones del torneo"
        className="flex flex-wrap gap-1 rounded-lg border border-mp-violet/45 bg-mp-violet/10 p-1"
      >
        {visible.map((tab) => {
          const selected = tab.id === effectiveActive;
          const panelId = `${baseId}-panel-${tab.id}`;
          const tabId = `${baseId}-tab-${tab.id}`;
          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className={`min-h-[44px] flex-1 rounded-md px-3 py-2 text-center text-xs font-semibold uppercase italic tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-yellow ${
                selected
                  ? "bg-mp-violet text-white"
                  : "text-mp-text-secondary hover:bg-mp-surface-light/80 hover:text-mp-text"
              }`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel-${effectiveActive}`}
        aria-labelledby={`${baseId}-tab-${effectiveActive}`}
        className="mt-4 min-h-[120px]"
        tabIndex={0}
      >
        {children(effectiveActive)}
      </div>
    </div>
  );
}
