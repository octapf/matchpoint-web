/** Subset of Matchpoint `Tournament` for the web app. */
export type TournamentStatus = "open" | "full" | "cancelled";

export type TournamentPhase =
  | "registration"
  | "classification"
  | "categories"
  | "completed";

export type TournamentDivision = "men" | "women" | "mixed";

export type TournamentCategory = "Gold" | "Silver" | "Bronze";

export interface DivisionCounts {
  men: number;
  women: number;
  mixed: number;
}

export interface Tournament {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  description?: string;
  status: TournamentStatus;
  phase?: TournamentPhase;
  maxTeams: number;
  coverImageUrl?: string;
  visibility?: "public" | "private";
  pointsToWin?: number;
  setsPerMatch?: number;
  divisions?: TournamentDivision[];
  /** When classification is finalized — bracket snapshot (optional). */
  categoriesSnapshot?: {
    computedAt: string;
    divisions: {
      division: TournamentDivision | string;
      categories: {
        category: TournamentCategory;
        teamIds: string[];
        matchIds: string[];
      }[];
    }[];
  };
}

/** List endpoint attaches aggregate counts. */
export interface TournamentListItem extends Tournament {
  entriesCount?: number;
  entriesCountByDivision?: DivisionCounts;
  teamsCount?: number;
  teamsCountByDivision?: DivisionCounts;
  waitlistCount?: number;
  waitlistCountByDivision?: DivisionCounts;
  groupsWithTeamsCount?: number;
}

/** Standing row shape from API `includeStandings=1`. */
export interface StandingRow {
  team: { _id: string; name: string };
  wins: number;
  points: number;
}

export interface StandingsGroupBlock {
  groupIndex: number;
  standings: StandingRow[];
}

export interface StandingsDivisionBlock {
  division: TournamentDivision;
  groups: StandingsGroupBlock[];
}

export interface MatchDoc {
  _id: string;
  tournamentId?: string;
  stage?: string;
  division?: string;
  groupIndex?: number;
  category?: string;
  teamAId?: string;
  teamBId?: string;
  status?: string;
  pointsA?: number;
  pointsB?: number;
  setsWonA?: number;
  setsWonB?: number;
  winnerId?: string;
  /** Per-set points when the API stores them. */
  setScores?: Array<{ pointsA: number; pointsB: number }>;
  createdAt?: string;
  updatedAt?: string;
}

/** Detail GET with `includeMatches` / `includeStandings`. */
export interface TournamentDetail extends TournamentListItem {
  matches?: MatchDoc[];
  standings?: StandingsDivisionBlock[];
  fixture?: unknown;
}
