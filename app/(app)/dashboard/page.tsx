import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { Currency, Profile, Transaction } from "@/lib/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user!.id)
    .order("date", { ascending: false });

  return (
    <Suspense>
      <DashboardClient
        transactions={(transactions ?? []) as Transaction[]}
        currency={((profile as Profile | null)?.default_currency ?? "USD") as Currency}
      />
    </Suspense>
  );
}
