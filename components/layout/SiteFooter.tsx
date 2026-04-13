"use client";

export function SiteFooter() {
  return (
    <footer
      className="mt-auto border-t border-mp-surface-light bg-mp-bg py-8 text-center text-sm text-mp-text-muted"
      role="contentinfo"
    >
      <p>
        Matchpoint · vista web solo lectura · datos desde la API pública
      </p>
      <p className="mt-1 text-xs text-mp-text-muted/80">
        © {new Date().getFullYear()} Miralab
      </p>
    </footer>
  );
}
