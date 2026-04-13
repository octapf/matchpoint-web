"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { IconRefresh } from "@/components/icons/MatchpointIcons";

/** Re-runs server components for the current route (e.g. after a score update). */
export function DataRefreshButton() {
  const router = useRouter();
  const [spin, setSpin] = useState(false);
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const busy = spin || isPending;

  return (
    <button
      type="button"
      onClick={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setSpin(true);
        startTransition(() => {
          router.refresh();
        });
        timerRef.current = setTimeout(() => {
          setSpin(false);
          timerRef.current = null;
        }, 800);
      }}
      disabled={busy}
      aria-busy={busy}
      aria-label="Actualizar datos"
      className="inline-flex h-10 min-w-[44px] shrink-0 items-center justify-center rounded-lg border border-mp-violet/40 bg-mp-violet/15 px-3 text-mp-yellow transition-colors hover:bg-mp-violet/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-yellow disabled:cursor-not-allowed disabled:opacity-60"
    >
      <IconRefresh className={`h-5 w-5 ${busy ? "animate-spin" : ""}`} aria-hidden />
    </button>
  );
}
