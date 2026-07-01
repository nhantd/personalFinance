import { buildChatInsights } from "@/lib/ai/chat-insights";
import { createClient } from "@/lib/supabase/server";
import type { Transaction } from "@/lib/types/database";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(500);

  const insights = buildChatInsights((transactions ?? []) as Transaction[]);

  return Response.json({ insights });
}
