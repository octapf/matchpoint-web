/**
 * Public env: `NEXT_PUBLIC_MATCHPOINT_API_URL` must be a full absolute URL to the Matchpoint
 * deployment (origin only), e.g. `https://matchpoint.miralab.ar`
 *
 * Do not set the value to the variable name. Do not omit `https://` — or the browser will treat
 * it as a relative path and requests will hit this site (404 + HTML).
 */
export function getApiBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_MATCHPOINT_API_URL?.trim();
  if (!raw) return null;
  const normalized = raw.replace(/\/$/, "");
  try {
    const u = new URL(normalized);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.origin;
  } catch {
    return null;
  }
}

export function isApiConfigured(): boolean {
  return getApiBaseUrl() !== null;
}

/**
 * Interval (ms) to re-fetch tournament detail while the detail page is open.
 * Set `NEXT_PUBLIC_TOURNAMENT_POLL_MS` — e.g. `15000` for 15s. `0` disables polling.
 * Default: 15000 when unset (read-only “near live” updates without backend WebSockets).
 */
export function getTournamentPollIntervalMs(): number {
  const raw = process.env.NEXT_PUBLIC_TOURNAMENT_POLL_MS?.trim();
  if (raw === "0") return 0;
  if (!raw) return 15_000;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return 15_000;
  if (n === 0) return 0;
  return Math.min(Math.max(n, 5_000), 120_000);
}
