import Link from "next/link";
import type { TournamentListItem } from "@/lib/types/tournament";

function formatRange(start: string, end: string) {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
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

export function HomeTournamentDetail({
  tournament,
}: {
  tournament: TournamentListItem | null;
}) {
  if (!tournament) {
    return (
      <section
        className="flex min-h-[200px] flex-col justify-center rounded-2xl border border-dashed border-mp-surface-light bg-mp-surface/50 p-6 text-center"
        aria-live="polite"
      >
        <p className="text-sm text-mp-text-muted">
          Elegí un torneo en el calendario o en el listado para ver el resumen.
        </p>
      </section>
    );
  }

  const t = tournament;
  const teams = t.teamsCount;
  const entries = t.entriesCount;
  const wait = t.waitlistCount;
  const metaBits: string[] = [];
  if (typeof teams === "number") metaBits.push(`${teams} equipos`);
  if (typeof entries === "number") metaBits.push(`${entries} jugadores`);
  if (typeof wait === "number" && wait > 0) metaBits.push(`${wait} en lista de espera`);

  return (
    <section
      className="rounded-2xl border border-mp-surface-light bg-mp-surface p-5"
      aria-labelledby="home-detail-title"
    >
      <h2 id="home-detail-title" className="text-lg font-bold italic text-white">
        {t.name}
      </h2>
      <p className="mt-2 text-sm text-mp-text-secondary">{formatRange(t.startDate, t.endDate)}</p>
      <p className="mt-1 text-sm text-mp-text-muted">{t.location}</p>
      {t.description ? (
        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-mp-text-secondary">
          {t.description}
        </p>
      ) : null}
      {metaBits.length > 0 ? (
        <p className="mt-3 text-sm text-mp-text-secondary">{metaBits.join(" · ")}</p>
      ) : null}
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-mp-text-muted">
        {statusLabel(t.status)}
      </p>
      <div className="mt-5">
        <Link
          href={`/tournaments/${t._id}`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-mp-violet px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-mp-violet/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-mp-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-mp-surface"
        >
          Ver torneo completo
        </Link>
      </div>
    </section>
  );
}
