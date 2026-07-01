import { createClient } from "@/lib/supabase/server";
import { UploadPageClient } from "@/components/upload/upload-form";
import { getBaseCurrency, getUserProfile } from "@/lib/finance/profile";
import type { Account } from "@/lib/types/database";

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await getUserProfile(supabase, user!.id);
  const baseCurrency = getBaseCurrency(profile);

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Upload statement</h1>
      <p className="mt-1 text-muted-foreground">
        Download a CSV or PDF from your bank and drop it here.
      </p>
      <div className="mt-8">
        <UploadPageClient
          accounts={(accounts ?? []) as Account[]}
          defaultCurrency={baseCurrency}
        />
      </div>
    </div>
  );
}
