/**
 * Día civil local a partir de lo que manda la API.
 * - `YYYY-MM-DD` (solo fecha) → ese día en horario local (sin interpretar UTC).
 * - ISO con hora (`…T…Z`, etc.) → día local del instante (coherente con el resto del calendario).
 */
export function parseLocalDay(iso: string): Date {
  const s = iso.trim();
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (dateOnly) {
    const y = Number(dateOnly[1]);
    const mo = Number(dateOnly[2]) - 1;
    const d = Number(dateOnly[3]);
    return new Date(y, mo, d);
  }
  const t = new Date(s);
  if (Number.isNaN(t.getTime())) {
    return new Date(NaN);
  }
  return stripTime(t);
}

export function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Inclusive: `day` (día civil local) está entre inicio y fin del torneo. */
export function dayInTournamentRange(day: Date, startIso: string, endIso: string): boolean {
  const start = stripTime(parseLocalDay(startIso));
  const endSrc = endIso?.trim() ? parseLocalDay(endIso) : start;
  const end = stripTime(endSrc);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
  let s = start.getTime();
  let e = end.getTime();
  if (s > e) [s, e] = [e, s];
  const d = stripTime(day).getTime();
  return d >= s && d <= e;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Monday-first week: 0 = Monday, … 6 = Sunday */
export function mondayIndex(d: Date): number {
  const sun0 = d.getDay();
  return sun0 === 0 ? 6 : sun0 - 1;
}

/** Calendar grid: 6 weeks × 7 days, each cell { date, inCurrentMonth } */
export function getMonthGrid(visibleMonth: Date): { date: Date; inCurrentMonth: boolean }[] {
  const first = startOfMonth(visibleMonth);
  const pad = mondayIndex(first);
  const start = new Date(first);
  start.setDate(start.getDate() - pad);

  const cells: { date: Date; inCurrentMonth: boolean }[] = [];
  const cur = new Date(start);
  const ym = visibleMonth.getFullYear();
  const mm = visibleMonth.getMonth();

  for (let i = 0; i < 42; i++) {
    cells.push({
      date: new Date(cur),
      inCurrentMonth: cur.getMonth() === mm && cur.getFullYear() === ym,
    });
    cur.setDate(cur.getDate() + 1);
  }
  return cells;
}

