import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, userIdFromCookie } from "@/lib/local-store";

export async function GET() {
  const id = userIdFromCookie((await cookies()).get(SESSION_COOKIE)?.value);
  return NextResponse.json({ user: id ? { id } : null });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
