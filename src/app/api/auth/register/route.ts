import { NextResponse } from "next/server";
import { register, SESSION_COOKIE, sessionCookie } from "@/lib/local-store";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
};

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
  const email = String(input.email ?? "").trim().toLowerCase();
  const password = String(input.password ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 256) {
    return NextResponse.json({ error: "Use a valid email and a password with 8–256 characters." }, { status: 400 });
  }

  try {
    const user = await register(email, password);
    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set(SESSION_COOKIE, sessionCookie(user.id), cookieOptions);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return NextResponse.json(
      { error: message === "ACCOUNT_EXISTS" ? "An account already exists for this email." : "Unable to create your account." },
      { status: message === "ACCOUNT_EXISTS" ? 409 : 500 },
    );
  }
}
