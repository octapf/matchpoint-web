import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MatchDetailView } from "@/components/match/MatchDetailView";
import { fetchTournamentDetail } from "@/lib/api/tournaments";
import { fetchTeamsForTournament } from "@/lib/api/teams";
import { getApiBaseUrl } from "@/lib/config";
import { teamNameById } from "@/lib/format/teamName";

type PageProps = {
  params: Promise<{ id: string; matchId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, matchId } = await params;
  const base = getApiBaseUrl();
  if (!base) {
    return { title: "Partido | Matchpoint" };
  }
  try {
    const tournament = await fetchTournamentDetail(id);
    const match = tournament.matches?.find((m) => m._id === matchId);
    if (!match) return { title: "Partido | Matchpoint" };
    const teams = await fetchTeamsForTournament(id);
    const a = teamNameById(teams, match.teamAId);
    const b = teamNameById(teams, match.teamBId);
    return {
      title: `${a} vs ${b} | Matchpoint`,
      description: `Partido en ${tournament.name}.`,
    };
  } catch {
    return { title: "Partido | Matchpoint" };
  }
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id, matchId } = await params;
  if (!getApiBaseUrl()) {
    notFound();
  }

  let tournament;
  let teams;
  try {
    [tournament, teams] = await Promise.all([
      fetchTournamentDetail(id),
      fetchTeamsForTournament(id),
    ]);
  } catch {
    notFound();
  }

  const match = tournament.matches?.find((m) => m._id === matchId);
  if (!match) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-mp-bg">
      <SiteHeader variant="detail" title={tournament.name} />
      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
        tabIndex={-1}
      >
        <MatchDetailView tournament={tournament} teams={teams} match={match} />
      </main>
      <SiteFooter />
    </div>
  );
}
