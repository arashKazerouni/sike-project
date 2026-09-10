import { NextResponse } from "next/server";
import { allMissions } from "@/lib/local-store";

const PAGE_SIZE = 24;
const VALID_TIERS = new Set(["All", "Recon", "Standard", "Advanced", "Apex"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedTier = url.searchParams.get("tier") ?? "All";
  const tier = VALID_TIERS.has(requestedTier) ? requestedTier : "All";
  const query = (url.searchParams.get("q") ?? "").trim().toLowerCase().slice(0, 100);

  const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, Math.min(requestedPage, 10_000)) : 1;

  const filtered = allMissions.filter(
    (mission) =>
      (tier === "All" || mission.difficulty === tier) &&
      (!query || `${mission.title} ${mission.skillVector} ${mission.impact}`.toLowerCase().includes(query)),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;

  return NextResponse.json({
    missions: filtered.slice(start, start + PAGE_SIZE),
    total: filtered.length,
    page: safePage,
    pageSize: PAGE_SIZE,
    totalPages,
  });
}
