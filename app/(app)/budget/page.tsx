import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { BudgetClient } from "@/components/budget/budget-client";
import { BudgetPageSkeleton } from "@/components/skeletons/page-skeletons";
import { createFxContext } from "@/lib/finance/fx-context";
import { getBaseCurrency, getUserProfile } from "@/lib/finance/profile";
import type { Account, Transaction } from "@/lib/types/database";

export default async function BudgetPage() {
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

  const txList = (transactions ?? []) as Transaction[];
  const txCurrencies = txList.map((t) => t.currency);
  const fx = await createFxContext(baseCurrency, txCurrencies);

  return (
    <Suspense fallback={<BudgetPageSkeleton />}>
      <BudgetClient
        transactions={txList}
        accounts={(accounts ?? []) as Account[]}
        profileCurrency={baseCurrency}
        fxRates={fx.rates}
      />
    </Suspense>
  );
}
