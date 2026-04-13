"use client";

import { useMemo } from "react";
import type { TournamentListItem } from "@/lib/types/tournament";
import {
  dayInTournamentRange,
  getMonthGrid,
  sameDay,
} from "@/lib/date/calendarHelpers";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const CAL_ROWS = 6;

type TournamentsCalendarProps = {
  tournaments: TournamentListItem[];
  visibleMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedId: string | null;
  onSelectTournament: (id: string) => void;
};

export function TournamentsCalendar({
  tournaments,
  visibleMonth,
  onPrevMonth,
  onNextMonth,
  selectedId,
  onSelectTournament,
}: TournamentsCalendarProps) {
  const grid = useMemo(() => getMonthGrid(visibleMonth), [visibleMonth]);

  const tournamentsByDay = useMemo(() => {
    const map = new Map<string, TournamentListItem[]>();
    for (const cell of grid) {
      const key = `${cell.date.getTime()}`;
      const list = tournaments
        .filter((t) => dayInTournamentRange(cell.date, t.startDate, t.endDate))
        .sort((a, b) => {
          const c = String(a.startDate).localeCompare(String(b.startDate));
          return c !== 0 ? c : a.name.localeCompare(b.name);
        });
      if (list.length) map.set(key, list);
    }
    return map;
  }, [grid, tournaments]);

  const monthLabel = `${MONTHS[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`;

  return (
    <section
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-mp-violet/35 bg-mp-violet/5 p-2 sm:p-3 lg:h-full lg:min-h-0 lg:p-2.5"
      aria-label="Calendario"
    >
      <div className="mb-2 flex min-w-0 shrink-0 items-center justify-end">
        <div className="flex min-w-0 max-w-full items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg border border-mp-surface-light bg-mp-surface px-1.5 text-base leading-none text-mp-text hover:bg-mp-surface-light focus-visible:outline focus-visible:ring-2 focus-visible:ring-mp-yellow lg:h-7 lg:min-w-7 lg:text-sm"
            aria-label="Mes anterior"
          >
            ‹
          </button>
          <span className="min-w-0 flex-1 text-center text-xs font-semibold tabular-nums text-mp-text sm:min-w-[9rem] sm:text-sm sm:flex-none">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={onNextMonth}
            className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg border border-mp-surface-light bg-mp-surface px-1.5 text-base leading-none text-mp-text hover:bg-mp-surface-light focus-visible:outline focus-visible:ring-2 focus-visible:ring-mp-yellow lg:h-7 lg:min-w-7 lg:text-sm"
            aria-label="Mes siguiente"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-7 gap-0.5 text-center text-[9px] font-semibold uppercase text-mp-text-muted sm:text-[10px] lg:text-[9px]">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-0.5">
            {w}
          </div>
        ))}
      </div>

      <div
        className="mt-0.5 grid min-h-0 flex-1 grid-cols-7 gap-0.5 sm:gap-0.5 lg:min-h-0 [&>*]:min-h-0"
        style={{
          gridTemplateRows: `repeat(${CAL_ROWS}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((cell, idx) => {
          const key = `${cell.date.getTime()}`;
          const dayTournaments = tournamentsByDay.get(key) ?? [];
          const isToday = sameDay(cell.date, new Date());

          return (
            <div
              key={idx}
              className={`flex min-h-0 flex-col overflow-hidden rounded-md border p-0.5 text-left sm:p-1 lg:rounded-lg ${
                cell.inCurrentMonth
                  ? "border-mp-surface-light bg-mp-bg/50"
                  : "border-transparent bg-mp-bg/20 opacity-50"
              } ${isToday ? "ring-1 ring-mp-yellow/60" : ""}`}
            >
              <div
                className={`shrink-0 text-[10px] font-bold tabular-nums leading-none sm:text-[11px] lg:text-[10px] ${
                  cell.inCurrentMonth ? "text-mp-text" : "text-mp-text-muted"
                }`}
              >
                {cell.date.getDate()}
              </div>
              <div className="mp-scrollbar mt-0.5 flex min-h-0 flex-1 flex-col gap-px overflow-y-auto overflow-x-hidden">
                {dayTournaments.map((t, ti) => {
                  const sel = t._id === selectedId;
                  return (
                    <button
                      key={t._id}
                      type="button"
                      title={t.name}
                      onClick={() => onSelectTournament(t._id)}
                      className={`min-h-0 w-full shrink-0 truncate rounded px-0.5 py-px text-left text-[8px] font-medium leading-tight sm:text-[9px] lg:text-[8px] ${
                        ti % 2 === 0
                          ? "bg-mp-yellow/20 text-mp-yellow"
                          : "bg-mp-violet/25 text-mp-violet"
                      } ${sel ? "ring-1 ring-white" : ""}`}
                    >
                      {t.name.length > 14 ? `${t.name.slice(0, 12)}…` : t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
