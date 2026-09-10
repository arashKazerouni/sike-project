import { NextResponse } from "next/server";
import { authenticate, SESSION_COOKIE, sessionCookie } from "@/lib/local-store";

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

  if (!email || !password || password.length > 256) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const user = await authenticate(email, password);
  if (!user) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, sessionCookie(user.id), cookieOptions);
  return response;
}
