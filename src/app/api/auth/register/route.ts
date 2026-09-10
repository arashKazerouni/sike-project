import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeEmail, validateCredentials } from "@/lib/supabase/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const password = String(body.password ?? "");
    if (!validateCredentials(email, password)) return NextResponse.json({ error: "Use a valid email and a password with at least 8 characters." }, { status: 400 });
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("already registered") || message.includes("already exists")) return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
      console.error("Supabase registration failed:", error);
      return NextResponse.json({ error: "Unable to create your account." }, { status: 400 });
    }
    return NextResponse.json({ user: data.user ? { id: data.user.id, email: data.user.email } : null, requiresEmailConfirmation: !data.session });
  } catch (error) {
    console.error("Registration request failed:", error);
    return NextResponse.json({ error: "Unable to create your account." }, { status: 400 });
  }
}
