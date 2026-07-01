import type { SupabaseClient } from "@supabase/supabase-js";

const MANUAL_FILE_PATH = "manual";

export async function getOrCreateManualStatement(
  supabase: SupabaseClient,
  userId: string,
  accountId: string
): Promise<string> {
  const { data: existing } = await supabase
    .from("statements")
    .select("id")
    .eq("user_id", userId)
    .eq("account_id", accountId)
    .eq("file_path", MANUAL_FILE_PATH)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("statements")
    .insert({
      user_id: userId,
      account_id: accountId,
      file_path: MANUAL_FILE_PATH,
      file_type: "csv",
      status: "complete",
      parsed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !created) {
    throw new Error(error?.message ?? "Could not create manual statement");
  }

  return created.id;
}
