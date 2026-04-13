import type { TournamentDivision } from "@/lib/types/tournament";

export interface Team {
  _id: string;
  tournamentId: string;
  name: string;
  division?: TournamentDivision;
  groupIndex?: number;
  playerIds?: string[];
  category?: string;
  createdAt?: string;
}
