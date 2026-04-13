export type EntryStatus = "joined" | "in_team";

export interface Entry {
  _id: string;
  tournamentId: string;
  userId: string;
  teamId: string | null;
  lookingForPartner?: boolean;
  status?: EntryStatus;
  createdAt?: string;
  updatedAt?: string;
  /** Si la API incluye nombre visible en el listado público. */
  userDisplayName?: string;
  displayName?: string;
  /** Si el backend devuelve usuario poblado. */
  user?: {
    displayName?: string;
    name?: string;
  };
}
