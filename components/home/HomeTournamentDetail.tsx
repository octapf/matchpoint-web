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
        className="flex min-h-[220px] flex-1 flex-col justify-center rounded-2xl border border-dashed border-mp-surface-light bg-mp-surface/50 p-6 text-center lg:min-h-0"
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
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-mp-surface-light bg-mp-surface p-4 lg:min-h-0 lg:p-3.5"
      aria-labelledby="home-detail-title"
    >
      <div className="min-h-0 flex-1 overflow-hidden">
        <h2
          id="home-detail-title"
          className="truncate text-base font-bold italic text-white lg:text-[0.95rem]"
        >
          {t.name}
        </h2>
        <p className="mt-1.5 text-sm text-mp-text-secondary lg:text-[0.8125rem]">
          {formatRange(t.startDate, t.endDate)}
        </p>
        <p className="mt-1 text-sm text-mp-text-muted lg:text-[0.8125rem]">{t.location}</p>
        {t.description ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mp-text-secondary lg:line-clamp-2 lg:text-[0.8125rem]">
            {t.description}
          </p>
        ) : null}
        {metaBits.length > 0 ? (
          <p className="mt-2 text-sm text-mp-text-secondary lg:text-[0.75rem]">{metaBits.join(" · ")}</p>
        ) : null}
        <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-mp-text-muted lg:text-[9px]">
          {statusLabel(t.status)}
        </p>
      </div>
      <div className="mt-auto shrink-0 pt-3 lg:pt-2.5">
        <Link
          href={`/tournaments/${t._id}`}
          className="inline-flex min-h-[40px] w-full items-center justify-center rounded-lg bg-mp-violet px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-mp-violet/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-mp-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-mp-surface lg:min-h-9 lg:text-[0.8125rem]"
        >
          Ver torneo completo
        </Link>
      </div>
    </section>
  );
}
