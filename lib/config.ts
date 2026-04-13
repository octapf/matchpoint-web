/**
 * Public env: set `NEXT_PUBLIC_MATCHPOINT_API_URL` to the Matchpoint Vercel origin (no trailing slash).
 * Example: https://matchpoint.vercel.app
 */
export function getApiBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_MATCHPOINT_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export function isApiConfigured(): boolean {
  return getApiBaseUrl() !== null;
}
