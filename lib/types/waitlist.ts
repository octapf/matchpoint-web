import type { TournamentDivision } from "@/lib/types/tournament";

export type WaitlistUserRow = {
  userId: string;
  createdAt: string;
};

/** Rows per division (order = orden de llegada a la lista). */
export type WaitlistByDivision = Record<TournamentDivision, WaitlistUserRow[]>;
