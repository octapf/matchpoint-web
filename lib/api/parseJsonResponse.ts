/**
 * Parse JSON API responses; surface clearer errors when the server returns HTML (e.g. 404 page).
 */
export async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return undefined as T;
  }
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    if (!res.ok) {
      throw new Error(
        `API ${res.status}: la respuesta no es JSON. NEXT_PUBLIC_MATCHPOINT_API_URL debe ser el origen del backend API (repo matchpoint en Vercel, p. ej. https://matchpoint.vercel.app), no la URL de este sitio web (matchpoint-web).`,
      );
    }
    throw new Error("Invalid JSON from server");
  }
  if (!res.ok) {
    const err =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `API error: ${res.status}`;
    throw new Error(err);
  }
  return data as T;
}
