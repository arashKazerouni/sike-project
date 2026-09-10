import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserById, SESSION_COOKIE, userIdFromCookie } from "@/lib/local-store";
export async function GET() { const id = userIdFromCookie((await cookies()).get(SESSION_COOKIE)?.value); const user = id ? await getUserById(id) : null; return NextResponse.json({ user: user ? { id: user.id, email: user.email } : null }); }
export async function DELETE() { const response = NextResponse.json({ ok: true }); response.cookies.delete(SESSION_COOKIE); return response; }
