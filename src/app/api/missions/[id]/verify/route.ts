import { NextResponse } from "next/server";
import { missionCatalog } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { verifyMissionProof } from "@/lib/task-verification";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!id || id.length > 100) return NextResponse.json({ error: "Invalid mission." }, { status: 400 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  if (auth.user.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Administrator review required." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const userId = typeof body === "object" && body !== null && "userId" in body
    ? (body as { userId?: unknown }).userId
    : undefined;
  const note = typeof body === "object" && body !== null && "note" in body
    ? (body as { note?: unknown }).note
    : undefined;
  const approved = typeof body === "object" && body !== null && "approved" in body
    ? (body as { approved?: unknown }).approved
    : undefined;

  if (typeof userId !== "string" || typeof approved !== "boolean") {
    return NextResponse.json({ error: "userId and approved are required." }, { status: 400 });
  }

  const directive = missionCatalog.find((item) => item.id === id);
  if (!directive) return NextResponse.json({ error: "Mission not found." }, { status: 404 });

  const admin = createAdminClient();
  const { data: submission, error: submissionError } = await admin
    .from("mission_submissions")
    .select("id, proof, status")
    .eq("mission_id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (submissionError) {
    console.error("Mission review lookup failed:", submissionError);
    return NextResponse.json({ error: "Unable to load submission." }, { status: 500 });
  }

  if (!submission) return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  if (submission.status !== "submitted") return NextResponse.json({ error: "Submission has already been reviewed." }, { status: 409 });

  if (approved && !verifyMissionProof(directive, submission.proof)) {
    return NextResponse.json({ error: "Evidence did not pass the required quality checks." }, { status: 422 });
  }

  const { data, error } = await admin.rpc("review_mission", {
    p_mission_id: id,
    p_user_id: userId,
    p_reviewer_id: auth.user.id,
    p_approved: approved,
    p_reward: directive.reward,
    p_note: typeof note === "string" ? note : null,
  });

  if (error) {
    console.error("Mission review settlement failed:", error);
    return NextResponse.json({ error: "Unable to settle mission review." }, { status: 500 });
  }

  return NextResponse.json(data);
}
