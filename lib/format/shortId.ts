/** Shorten Mongo-style ids for read-only lists (names need auth). */
export function shortId(id: string) {
  if (id.length <= 10) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}
