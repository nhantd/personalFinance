import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupportedCurrency } from "@/lib/currencies";
import { ensureUserProfile } from "@/lib/finance/profile";
import type { Currency } from "@/lib/types/database";

export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: statements } = await supabase
    .from("statements")
    .select("file_path")
    .eq("user_id", user.id);

  if (statements?.length) {
    const paths = statements.map((s) => s.file_path);
    await admin.storage.from("statements").remove(paths);
  }

  const { data: sessions } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("user_id", user.id);

  if (sessions?.length) {
    await supabase
      .from("chat_messages")
      .delete()
      .in(
        "session_id",
        sessions.map((s) => s.id)
      );
  }

  await supabase.from("transactions").delete().eq("user_id", user.id);
  await supabase.from("statements").delete().eq("user_id", user.id);
  await supabase.from("chat_sessions").delete().eq("user_id", user.id);
  await supabase.from("asset_snapshots").delete().eq("user_id", user.id);
  await supabase.from("assets").delete().eq("user_id", user.id);
  await supabase.from("accounts").delete().eq("user_id", user.id);

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patchSchema = z.object({
    display_name: z.string().optional(),
    default_currency: z
      .string()
      .refine(isSupportedCurrency, "Unsupported currency")
      .optional(),
  });

  const body = patchSchema.parse(await request.json());
  const { default_currency, display_name } = body;

  const updates: Record<string, string | null> = {};
  if (default_currency) updates.default_currency = default_currency.toUpperCase();
  if (display_name !== undefined) updates.display_name = display_name;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  try {
    await ensureUserProfile(supabase, user.id, {
      user,
      default_currency: (default_currency?.toUpperCase() ?? "USD") as Currency,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to ensure profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Profile not found after update" }, { status: 500 });
  }

  revalidatePath("/dashboard");
  revalidatePath("/net-worth");
  revalidatePath("/investments");
  revalidatePath("/transactions");
  revalidatePath("/upload");
  revalidatePath("/settings");

  return NextResponse.json({ success: true, profile: data });
}
