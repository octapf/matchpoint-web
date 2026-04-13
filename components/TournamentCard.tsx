import Link from "next/link";
import type { TournamentListItem } from "@/lib/types/tournament";

function formatRange(start: string, end: string) {
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

export function TournamentCard({ t }: { t: TournamentListItem }) {
  const teams = t.teamsCount;
  const entries = t.entriesCount;
  const wait = t.waitlistCount;
  const metaBits: string[] = [];
  if (typeof teams === "number") metaBits.push(`${teams} equipos`);
  if (typeof entries === "number") metaBits.push(`${entries} jugadores`);
  if (typeof wait === "number" && wait > 0) metaBits.push(`${wait} en lista de espera`);

  return (
    <article className="relative mb-3 overflow-hidden rounded-xl border border-mp-surface-light bg-mp-surface">
      <Link
        href={`/tournaments/${t._id}`}
        className="block p-4 no-underline outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-mp-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-mp-bg"
      >
        <h2 className="text-base font-bold text-mp-text">{t.name}</h2>
        <p className="mt-1 text-sm text-mp-text-secondary">
          {formatRange(t.startDate, t.endDate)}
        </p>
        <p className="mt-0.5 text-sm text-mp-text-muted">{t.location}</p>
        {metaBits.length > 0 ? (
          <p className="mt-2 text-xs text-mp-text-secondary">{metaBits.join(" · ")}</p>
        ) : null}
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-mp-text-muted">
          {statusLabel(t.status)}
        </p>
      </Link>
    </article>
  );
}
