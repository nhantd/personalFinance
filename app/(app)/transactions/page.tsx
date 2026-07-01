import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { TransactionsClient } from "@/components/transactions/transactions-client";
import { TransactionsPageSkeleton } from "@/components/skeletons/page-skeletons";
import { getBaseCurrency, getUserProfile } from "@/lib/finance/profile";
import type { Account, Transaction } from "@/lib/types/database";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await getUserProfile(supabase, user!.id);
  const baseCurrency = getBaseCurrency(profile);

  const [{ data: transactions }, { data: accounts }] = await Promise.all([
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user!.id)
      .order("date", { ascending: false }),
    supabase
      .from("accounts")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: true }),
  ]);

  return (
    <Suspense fallback={<TransactionsPageSkeleton />}>
      <TransactionsClient
        transactions={(transactions ?? []) as Transaction[]}
        accounts={(accounts ?? []) as Account[]}
        profileCurrency={baseCurrency}
      />
    </Suspense>
  );
}
