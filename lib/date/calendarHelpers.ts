/** Local date at midnight (avoid UTC shift from ISO strings). */
export function parseLocalDay(iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    return new Date(y, mo, d);
  }
  const t = new Date(iso);
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
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

/** Inclusive: day is between start and end (date-only). */
export function dayInTournamentRange(day: Date, startIso: string, endIso: string): boolean {
  const d = stripTime(day).getTime();
  const s = stripTime(parseLocalDay(startIso)).getTime();
  const e = stripTime(parseLocalDay(endIso)).getTime();
  return d >= s && d <= e;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
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
