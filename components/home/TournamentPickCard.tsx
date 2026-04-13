"use client";

import Link from "next/link";
import type { TournamentListItem } from "@/lib/types/tournament";

function formatRangeShort(start: string, end: string) {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    if (s.toDateString() === e.toDateString()) {
      return s.toLocaleDateString("es-AR", opts);
    }
    return `${s.toLocaleDateString("es-AR", opts)} — ${e.toLocaleDateString("es-AR", opts)}`;
  } catch {
    return `${start} — ${end}`;
  }
}

function statusLabel(status: TournamentListItem["status"]) {
  if (status === "open") return "Inscripciones abiertas";
  if (status === "full") return "Cupo completo";
  return "Cancelado";
}

export function TournamentPickCard({
  t,
  selected,
  onSelect,
}: {
  t: TournamentListItem;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const teams = t.teamsCount;
  const entries = t.entriesCount;
  const wait = t.waitlistCount;
  const metaBits: string[] = [];
  if (typeof teams === "number") metaBits.push(`${teams} equipos`);
  if (typeof entries === "number") metaBits.push(`${entries} jugadores`);
  if (typeof wait === "number" && wait > 0) metaBits.push(`${wait} en lista de espera`);

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-xl border bg-mp-surface transition-shadow ${
        selected
          ? "border-mp-yellow ring-2 ring-mp-yellow ring-offset-2 ring-offset-mp-bg"
          : "border-mp-surface-light hover:border-mp-violet/40"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(t._id)}
        className="flex flex-1 flex-col p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-mp-yellow"
      >
        <span className="text-base font-bold text-mp-text">{t.name}</span>
        <span className="mt-1 text-sm text-mp-text-secondary">
          {formatRangeShort(t.startDate, t.endDate)}
        </span>
        <span className="mt-0.5 text-sm text-mp-text-muted">{t.location}</span>
        {metaBits.length > 0 ? (
          <span className="mt-2 text-xs text-mp-text-secondary">{metaBits.join(" · ")}</span>
        ) : null}
        <span className="mt-2 text-xs font-medium uppercase tracking-wide text-mp-text-muted">
          {statusLabel(t.status)}
        </span>
      </button>
      <div className="border-t border-mp-surface-light px-4 py-2">
        <Link
          href={`/tournaments/${t._id}`}
          className="text-sm font-medium text-mp-yellow underline-offset-2 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Abrir ficha →
        </Link>
      </div>
    </article>
  );
}
