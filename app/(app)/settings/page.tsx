import { createClient } from "@/lib/supabase/server";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import { ensureUserProfile } from "@/lib/finance/profile";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await ensureUserProfile(supabase, user.id, { user });

  const [
    { count: transactionCount },
    { count: statementCount },
    { count: accountCount },
    { count: assetCount },
    { data: statements },
  ] = await Promise.all([
    supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("statements")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("accounts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase.from("assets").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase
      .from("statements")
      .select(
        "id, file_type, status, period_start, period_end, created_at, accounts(name, institution)"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const statementRows =
    statements?.map((row) => {
      const rawAccount = row.accounts as
        | { name: string; institution: string | null }
        | { name: string; institution: string | null }[]
        | null;
      const account = Array.isArray(rawAccount) ? rawAccount[0] : rawAccount;
      const accountLabel = account?.institution
        ? `${account.name} · ${account.institution}`
        : (account?.name ?? "Unknown account");

      return {
        id: row.id,
        file_type: row.file_type,
        status: row.status,
        period_start: row.period_start,
        period_end: row.period_end,
        created_at: row.created_at,
        account_name: accountLabel,
      };
    }) ?? [];

  return (
    <SettingsPageClient
      profile={profile}
      user={{
        email: user.email,
        app_metadata: user.app_metadata,
        identities: user.identities,
      }}
      stats={{
        transactions: transactionCount ?? 0,
        statements: statementCount ?? 0,
        accounts: accountCount ?? 0,
        assets: assetCount ?? 0,
      }}
      statements={statementRows}
    />
  );
}
