import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email.includes("@") || password.length < 8) {
      return NextResponse.json(
        { error: "Use a valid email and a password with at least 8 characters." },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("already registered") || message.includes("already exists")) {
        return NextResponse.json(
          { error: "An account already exists for this email." },
          { status: 400 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user, session: data.session });
  } catch {
    return NextResponse.json({ error: "Unable to create your account." }, { status: 400 });
  }
}
