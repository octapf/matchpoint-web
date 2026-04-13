"use client";

import Image from "next/image";
import Link from "next/link";
import { IconRefresh } from "@/components/icons/MatchpointIcons";

type SiteHeaderProps =
  | {
      variant: "list";
      onRefresh?: () => void;
      refreshPending?: boolean;
    }
  | {
      variant: "detail";
      title: string;
      onRefresh?: () => void;
      refreshPending?: boolean;
    };

export function SiteHeader(props: SiteHeaderProps) {
  const refreshBtn =
    props.onRefresh != null ? (
      <button
        type="button"
        onClick={props.onRefresh}
        disabled={props.refreshPending}
        aria-busy={props.refreshPending}
        aria-label="Actualizar datos"
        className="inline-flex h-10 min-w-[44px] shrink-0 items-center justify-center rounded-lg border border-mp-violet/40 bg-mp-violet/15 px-3 text-mp-yellow transition-colors hover:bg-mp-violet/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-yellow disabled:cursor-not-allowed disabled:opacity-60"
      >
        <IconRefresh
          className={`h-5 w-5 ${props.refreshPending ? "animate-spin" : ""}`}
          aria-hidden
        />
      </button>
    ) : null;

  if (props.variant === "list") {
    return (
      <header
        className="sticky top-0 z-20 border-b border-mp-surface-light bg-mp-bg/95 backdrop-blur-sm"
        role="banner"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-md outline-none ring-mp-yellow focus-visible:ring-2"
          >
            <Image
              src="/matchpoint-app-icon.png"
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 object-contain"
              priority
              aria-hidden
            />
            <div className="flex min-w-0 flex-col items-start gap-0.5">
              <span className="text-xs font-medium uppercase tracking-wider text-mp-text-muted">
                Matchpoint
              </span>
              <span className="truncate text-lg font-semibold italic tracking-wide text-white sm:text-xl">
                Torneos públicos
              </span>
            </div>
          </Link>
          {refreshBtn}
        </div>
      </header>
    );
  }

  return (
    <header
      className="sticky top-0 z-20 border-b border-mp-surface-light bg-mp-bg/95 backdrop-blur-sm"
      role="banner"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-4 sm:items-center sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 rounded-md py-2 text-sm font-medium text-mp-yellow outline-none hover:underline focus-visible:ring-2 focus-visible:ring-mp-yellow"
        >
          ← Torneos
        </Link>
        <h1 className="min-w-0 flex-1 text-lg font-semibold italic leading-snug text-white sm:text-2xl">
          {props.title}
        </h1>
        {refreshBtn}
      </div>
    </header>
  );
}
