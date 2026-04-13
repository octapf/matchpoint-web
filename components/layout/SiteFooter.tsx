"use client";

import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="mt-auto shrink-0 border-t border-mp-surface-light bg-mp-bg py-1.5 text-center text-[10px] leading-tight text-mp-text-muted sm:text-[11px]"
      role="contentinfo"
    >
      <p className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5">
        <span>Matchpoint · © {year}</span>
        <span aria-hidden className="text-mp-text-muted/50">
          ·
        </span>
        <a
          href="https://miralab.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-mp-text-secondary underline-offset-2 transition-colors hover:text-mp-yellow hover:underline"
        >
          Miralab
        </a>
        <span aria-hidden className="text-mp-text-muted/50">
          ·
        </span>
        <Link
          href="/terminos-y-condiciones"
          className="text-mp-text-secondary underline-offset-2 transition-colors hover:text-mp-yellow hover:underline"
        >
          Términos y condiciones
        </Link>
        <span aria-hidden className="text-mp-text-muted/50">
          ·
        </span>
        <a
          href="https://www.miralab.ar/es/matchpoint/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-mp-text-secondary underline-offset-2 transition-colors hover:text-mp-yellow hover:underline"
        >
          Política de privacidad
        </a>
      </p>
    </footer>
  );
}
