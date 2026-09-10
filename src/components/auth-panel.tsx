"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CyberButton } from "@/components/cyber-button";

type Mode = "login" | "register" | "reset";
export function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const endpoint = mode === "reset" ? "/api/auth/reset" : `/api/auth/${mode}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "Unable to complete the request.");
        return;
      }

      if (mode === "login") {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      if (mode === "register" && data.requiresEmailConfirmation) {
        setMessage("Account created. Check your email to confirm your identity before signing in.");
      } else if (mode === "register") {
        router.push("/dashboard");
        router.refresh();
      } else {
        setMessage(data.message ?? "Identity ready.");
      }
    } catch {
      setMessage("Unable to reach the identity service. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-5 py-16"><div className="clip-chamfer w-full border border-border bg-surface p-6 md:p-8"><div className="mb-7 flex flex-col gap-2"><span className="font-mono text-[10px] tracking-[0.16em] text-cyan-strong uppercase">// IDENTITY GATE</span><h1 className="font-display text-3xl font-bold text-foreground">{mode === "register" ? "Initialize identity" : mode === "reset" ? "Recover access" : "Connect identity"}</h1><p className="text-sm leading-relaxed text-text-secondary">Secure Supabase identity is used for your account and session.</p></div><form onSubmit={submit} className="flex flex-col gap-4"><label className="flex flex-col gap-2 font-mono text-xs tracking-wide text-text-secondary">EMAIL<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 border border-border bg-background px-3 font-sans text-sm text-foreground outline-none focus:border-cyan-strong" /></label>{mode !== "reset" && <label className="flex flex-col gap-2 font-mono text-xs tracking-wide text-text-secondary">PASSWORD<input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 border border-border bg-background px-3 font-sans text-sm text-foreground outline-none focus:border-cyan-strong" /></label>}<CyberButton type="submit" disabled={busy}>{busy ? "Processing" : mode === "register" ? "Create identity" : mode === "reset" ? "Generate reset link" : "Connect"}</CyberButton></form>{message && <p className="mt-4 border border-cyan/30 bg-cyan/5 p-3 font-mono text-xs leading-relaxed text-cyan-strong">{message}</p>}<div className="mt-6 flex flex-wrap gap-3 text-xs text-text-muted"><button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="hover:text-cyan-strong">{mode === "login" ? "Create account" : "Back to login"}</button><button type="button" onClick={() => setMode(mode === "reset" ? "login" : "reset")} className="hover:text-cyan-strong">{mode === "reset" ? "Back to login" : "Reset password"}</button></div></div></main>;
}
