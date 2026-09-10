import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!id || id.length > 100) return NextResponse.json({ error: "Invalid mission." }, { status: 400 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { data: run, error: runError } = await supabase
    .from("mission_runs")
    .select("status, initialized_at, updated_at")
    .eq("mission_id", id)
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (runError) {
    console.error("Mission status lookup failed:", runError);
    return NextResponse.json({ error: "Mission system is not configured yet." }, { status: 503 });
  }

  const { data: submission, error: submissionError } = await supabase
    .from("mission_submissions")
    .select("id, status, reviewer_note, submitted_at, reviewed_at")
    .eq("mission_id", id)
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (submissionError) {
    console.error("Mission submission lookup failed:", submissionError);
    return NextResponse.json({ error: "Mission submission system is not configured yet." }, { status: 503 });
  }

  return NextResponse.json({
    initialized: Boolean(run),
    status: run?.status ?? null,
    submission: submission ?? null,
  });
}

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!id || id.length > 100) return NextResponse.json({ error: "Invalid mission." }, { status: 400 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { data: existing, error: lookupError } = await supabase
    .from("mission_runs")
    .select("mission_id, status")
    .eq("mission_id", id)
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (lookupError) {
    console.error("Mission initialization lookup failed:", lookupError);
    return NextResponse.json({ error: "Mission system is not configured yet." }, { status: 503 });
  }

  if (existing) return NextResponse.json({ initialized: true, status: existing.status });

  const { error } = await supabase.from("mission_runs").insert({
    mission_id: id,
    user_id: auth.user.id,
    status: "initialized",
  });

  if (error) {
    console.error("Mission initialization failed:", error);
    return NextResponse.json({ error: "Unable to initialize mission." }, { status: 500 });
  }

  return NextResponse.json({ initialized: true, status: "initialized" });
}
