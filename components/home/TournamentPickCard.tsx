"use client";

import Link from "next/link";
import type { TournamentListItem } from "@/lib/types/tournament";
import { IconDocumentTextOutline } from "@/components/icons/MatchpointIcons";

export function TournamentPickCard({
  t,
  selected,
  onSelect,
}: {
  t: TournamentListItem;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <article
      className={`flex min-h-0 items-center gap-2 rounded-xl border bg-mp-surface px-2.5 py-2 transition-colors ${
        selected
          ? "border border-mp-yellow"
          : "border border-mp-surface-light hover:border-mp-violet/40"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(t._id)}
        className="min-w-0 flex-1 truncate text-left text-sm font-bold text-mp-text outline-none focus-visible:ring-2 focus-visible:ring-mp-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-mp-surface"
      >
        {t.name}
      </button>
      <Link
        href={`/tournaments/${t._id}`}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-mp-yellow transition-colors hover:bg-mp-violet/15 hover:text-mp-yellow focus-visible:outline focus-visible:ring-2 focus-visible:ring-mp-yellow"
        aria-label="Abrir ficha"
        title="Abrir ficha"
        onClick={(e) => e.stopPropagation()}
      >
        <IconDocumentTextOutline className="h-5 w-5" aria-hidden />
      </Link>
    </article>
  );
}
