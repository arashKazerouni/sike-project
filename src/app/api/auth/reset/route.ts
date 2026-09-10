import { NextResponse } from "next/server";
import { createResetToken, resetPassword } from "@/lib/local-store";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const token = String(input.token ?? "");
  const password = String(input.password ?? "");

  if (token) {
    if (password.length < 8 || password.length > 256) {
      return NextResponse.json({ error: "Use a password with 8–256 characters." }, { status: 400 });
    }

    const ok = await resetPassword(token, password);
    return NextResponse.json(
      ok ? { message: "Password updated." } : { error: "This reset link is invalid or expired." },
      { status: ok ? 200 : 400 },
    );
  }

  const email = String(input.email ?? "").trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

  const resetToken = await createResetToken(email);
  return NextResponse.json({
    message: resetToken
      ? `Demo reset link: /auth/reset?token=${resetToken}`
      : "If that account exists, a reset link has been created.",
  });
}
