import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getLikes,
  toggleLike,
  SESSION_COOKIE,
  userIdFromCookie,
} from "@/lib/local-store";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Mission ID is required." }, { status: 400 });

  const userId = userIdFromCookie((await cookies()).get(SESSION_COOKIE)?.value);
  return NextResponse.json(await getLikes(id, userId ?? undefined));
}

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Mission ID is required." }, { status: 400 });

  const userId = userIdFromCookie((await cookies()).get(SESSION_COOKIE)?.value);
  if (!userId) return NextResponse.json({ error: "Connect your identity to like missions." }, { status: 401 });

  try {
    return NextResponse.json(await toggleLike(id, userId));
  } catch (error) {
    if (error instanceof Error && error.message === "MISSION_NOT_FOUND") {
      return NextResponse.json({ error: "Mission not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to update mission like." }, { status: 500 });
  }
}
