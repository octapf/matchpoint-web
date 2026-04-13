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
}
