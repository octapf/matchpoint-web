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
