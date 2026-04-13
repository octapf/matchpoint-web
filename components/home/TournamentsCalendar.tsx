"use client";

import { useMemo } from "react";
import type { TournamentListItem } from "@/lib/types/tournament";
import {
  getMonthGrid,
  isCalendarMarkDay,
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
      const list = tournaments.filter((t) =>
        isCalendarMarkDay(cell.date, t.startDate, t.endDate, visibleMonth),
      );
      if (list.length) map.set(key, list);
    }
    return map;
  }, [grid, tournaments, visibleMonth]);

  const label = `${MONTHS[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`;

  return (
    <section
      className="rounded-2xl border border-mp-violet/35 bg-mp-violet/5 p-3 sm:p-4"
      aria-labelledby="cal-heading"
    >
      <p className="mb-2 text-[11px] leading-snug text-mp-text-muted">
        Cada torneo se marca una vez por mes: el primer día del evento en ese mes (el rango completo está
        en el detalle).
      </p>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 id="cal-heading" className="text-sm font-bold uppercase italic tracking-wide text-mp-yellow">
          Calendario
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            className="rounded-lg border border-mp-surface-light bg-mp-surface px-2 py-1.5 text-sm text-mp-text hover:bg-mp-surface-light focus-visible:outline focus-visible:ring-2 focus-visible:ring-mp-yellow"
            aria-label="Mes anterior"
          >
            ‹
          </button>
          <span className="min-w-[10rem] text-center text-sm font-semibold text-mp-text">{label}</span>
          <button
            type="button"
            onClick={onNextMonth}
            className="rounded-lg border border-mp-surface-light bg-mp-surface px-2 py-1.5 text-sm text-mp-text hover:bg-mp-surface-light focus-visible:outline focus-visible:ring-2 focus-visible:ring-mp-yellow"
            aria-label="Mes siguiente"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold uppercase text-mp-text-muted sm:text-xs">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-0.5 sm:gap-1">
        {grid.map((cell, idx) => {
          const key = `${cell.date.getTime()}`;
          const dayTournaments = tournamentsByDay.get(key) ?? [];
          const isToday = sameDay(cell.date, new Date());

          return (
            <div
              key={idx}
              className={`min-h-[72px] rounded-lg border p-1 text-left sm:min-h-[88px] sm:p-1.5 ${
                cell.inCurrentMonth
                  ? "border-mp-surface-light bg-mp-bg/50"
                  : "border-transparent bg-mp-bg/20 opacity-50"
              } ${isToday ? "ring-1 ring-mp-yellow/60" : ""}`}
            >
              <div
                className={`text-[11px] font-bold tabular-nums sm:text-xs ${
                  cell.inCurrentMonth ? "text-mp-text" : "text-mp-text-muted"
                }`}
              >
                {cell.date.getDate()}
              </div>
              <div className="mt-0.5 flex flex-col gap-0.5">
                {dayTournaments.slice(0, 3).map((t, ti) => {
                  const sel = t._id === selectedId;
                  return (
                    <button
                      key={t._id}
                      type="button"
                      title={t.name}
                      onClick={() => onSelectTournament(t._id)}
                      className={`w-full truncate rounded px-0.5 py-0.5 text-left text-[9px] font-medium leading-tight sm:text-[10px] ${
                        ti % 2 === 0
                          ? "bg-mp-yellow/20 text-mp-yellow"
                          : "bg-mp-violet/25 text-mp-violet"
                      } ${sel ? "ring-1 ring-white" : ""}`}
                    >
                      {t.name.length > 18 ? `${t.name.slice(0, 16)}…` : t.name}
                    </button>
                  );
                })}
                {dayTournaments.length > 3 ? (
                  <span className="text-[9px] text-mp-text-muted">+{dayTournaments.length - 3}</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
