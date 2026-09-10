import { Activity, Wallet, TrendingUp, Hexagon } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { DashboardHeader } from "@/components/sections/dashboard-header";
import { MetricCard } from "@/components/metric-card";
import { HUDPanel } from "@/components/hud-panel";
import { SettlementFeed } from "@/components/sections/settlement-feed";
import { createClient } from "@/lib/supabase/server";

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

function relativeTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60_000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function calculateStreak(dates: string[]) {
  const days = new Set(dates.map((date) => new Date(date).toISOString().slice(0, 10)));
  let streak = 0;
  const cursor = new Date();

  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) return null;

  const userId = auth.user.id;
  const [{ data: profile }, { data: wallet }, { data: completions }, { data: transactions }] = await Promise.all([
    supabase.from("profiles").select("username, stellar_address").eq("id", userId).maybeSingle(),
    supabase.from("wallets").select("sike_balance, stellar_address").eq("user_id", userId).maybeSingle(),
    supabase
      .from("task_completions")
      .select("id, task_id, status, approved_at, created_at")
      .eq("user_id", userId),
    supabase
      .from("transactions")
      .select("id, amount, status, reference, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const completed = (completions ?? []).filter((item) => ["completed", "verified"].includes(item.status));
  const approvedDates = completed.map((item) => item.approved_at ?? item.created_at).filter(Boolean) as string[];
  const totalCompletions = completions?.length ?? 0;
  const completionRate = totalCompletions ? Math.round((completed.length / totalCompletions) * 100) : 0;
  const balance = Number(wallet?.sike_balance ?? 0);
  const streak = calculateStreak(approvedDates);
  const displayName = profile?.username || auth.user.email?.split("@")[0] || "Operator";
  const stellarAddress = wallet?.stellar_address || profile?.stellar_address || null;

  const feed = (transactions ?? []).map((transaction) => ({
    id: transaction.id,
    label: transaction.reference || "SIKE Settlement",
    category: transaction.status === "completed" ? "Verified Reward" : transaction.status || "Transaction",
    reward: Number(transaction.amount ?? 0),
    timestamp: relativeTime(transaction.created_at),
  }));

  return (
    <>
      <Navigation />
      <main className="flex-1 pb-24 md:pb-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:px-8 md:py-12">
          <DashboardHeader displayName={displayName} userId={userId} stellarAddress={stellarAddress} verifiedTasks={completed.length} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="SIKE Balance"
              value={formatAmount(balance)}
              delta="Live wallet balance"
              deltaTrend="neutral"
              icon={<Wallet />}
              accent="cyan"
            />
            <MetricCard
              label="Tasks Completed"
              value={String(completed.length)}
              delta={`${totalCompletions} submitted`}
              deltaTrend="neutral"
              icon={<Hexagon />}
              accent="purple"
            />
            <MetricCard
              label="Completion Rate"
              value={`${completionRate}%`}
              delta="Based on your submissions"
              deltaTrend="neutral"
              icon={<TrendingUp />}
              accent="cyan"
            />
            <MetricCard
              label="Validation Streak"
              value={`${streak} day${streak === 1 ? "" : "s"}`}
              delta={streak ? "Current streak" : "No active streak"}
              deltaTrend="neutral"
              icon={<Activity />}
              accent="purple"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <SettlementFeed entries={feed} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
