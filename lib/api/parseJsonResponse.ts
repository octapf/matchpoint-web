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
        `API ${res.status}: la respuesta no es JSON. Comprobá que NEXT_PUBLIC_MATCHPOINT_API_URL sea el origen del backend Matchpoint (p. ej. https://matchpoint.miralab.ar), no la URL de este sitio.`,
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
