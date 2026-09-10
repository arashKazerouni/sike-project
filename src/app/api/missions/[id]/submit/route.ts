import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!id || id.length > 100) return NextResponse.json({ error: "Invalid mission." }, { status: 400 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const proof = typeof body === "object" && body !== null && "proof" in body
    ? (body as { proof?: unknown }).proof
    : undefined;

  if (typeof proof !== "string" || proof.trim().length < 20 || proof.trim().length > 10000) {
    return NextResponse.json(
      { error: "Provide at least 20 characters of evidence and keep the submission under 10,000 characters." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.rpc("submit_mission", {
    p_mission_id: id,
    p_proof: proof,
  });

  if (error) {
    const knownErrors: Record<string, { message: string; status: number }> = {
      authentication_required: { message: "Authentication required.", status: 401 },
      invalid_mission: { message: "Invalid mission.", status: 400 },
      invalid_proof: { message: "Invalid evidence.", status: 400 },
      mission_not_initialized: { message: "Initialize the mission before submitting it.", status: 409 },
      mission_closed: { message: "This mission is already closed.", status: 409 },
      mission_already_submitted: { message: "This mission is already under review.", status: 409 },
    };
    const mapped = knownErrors[error.message];
    if (mapped) return NextResponse.json({ error: mapped.message }, { status: mapped.status });
    console.error("Mission submission failed:", error);
    return NextResponse.json({ error: "Unable to submit mission." }, { status: 500 });
  }

  return NextResponse.json(data);
}
