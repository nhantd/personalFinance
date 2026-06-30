import { createClient } from "@/lib/supabase/server";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import type { Currency, Profile, Transaction } from "@/lib/types/database";

export default async function TransactionsPage() {
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
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
      <p className="mt-1 text-muted-foreground">
        All parsed transactions. Override categories as needed.
      </p>
      <div className="mt-8">
        <TransactionsTable
          initialTransactions={(transactions ?? []) as Transaction[]}
          currency={((profile as Profile | null)?.default_currency ?? "USD") as Currency}
        />
      </div>
    </div>
  );
}
