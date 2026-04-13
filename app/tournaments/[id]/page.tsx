import type { Metadata } from "next";
import { TournamentDetailClient } from "@/components/TournamentDetailClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

function apiBase(): string | null {
  const raw = process.env.NEXT_PUBLIC_MATCHPOINT_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const base = apiBase();
  if (!base || !id) {
    return { title: "Torneo | Matchpoint" };
  }
  try {
    const res = await fetch(`${base}/api/tournaments/${encodeURIComponent(id)}`, {
      next: { revalidate: 120 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { title: "Torneo | Matchpoint" };
    const data = (await res.json()) as { name?: string };
    const name = typeof data.name === "string" ? data.name : "Torneo";
    return {
      title: `${name} | Matchpoint`,
      description: "Información pública del torneo (solo lectura).",
    };
  } catch {
    return { title: "Torneo | Matchpoint" };
  }
}

export default async function TournamentDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <TournamentDetailClient id={id} />;
}
