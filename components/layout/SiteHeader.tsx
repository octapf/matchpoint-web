"use client";

import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps =
  | {
      variant: "list";
    }
  | {
      variant: "detail";
      title: string;
};

export function SiteHeader(props: SiteHeaderProps) {
  if (props.variant === "list") {
    return (
      <header
        className="sticky top-0 z-20 border-b border-mp-surface-light bg-mp-bg/95 backdrop-blur-sm"
        role="banner"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 rounded-md outline-none ring-mp-yellow focus-visible:ring-2"
          >
            <Image
              src="/matchpoint-logo.png"
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
              priority
              aria-hidden
            />
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-xs font-medium uppercase tracking-wider text-mp-text-muted">
                Matchpoint
              </span>
              <span className="text-lg font-semibold italic tracking-wide text-white sm:text-xl">
                Torneos públicos
              </span>
            </div>
          </Link>
          <span className="ml-auto hidden rounded-full border border-mp-violet/40 bg-mp-violet/10 px-3 py-1 text-xs font-medium text-mp-text-secondary sm:inline">
            Solo lectura
          </span>
        </div>
      </header>
    );
  }

  return (
    <header
      className="sticky top-0 z-20 border-b border-mp-surface-light bg-mp-bg/95 backdrop-blur-sm"
      role="banner"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-4 sm:items-center sm:gap-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 rounded-md py-2 text-sm font-medium text-mp-yellow outline-none hover:underline focus-visible:ring-2 focus-visible:ring-mp-yellow"
        >
          ← Torneos
        </Link>
        <h1 className="min-w-0 flex-1 text-lg font-semibold italic leading-snug text-white sm:text-2xl">
          {props.title}
        </h1>
      </div>
    </header>
  );
}
