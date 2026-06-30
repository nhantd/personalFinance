import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

  const { default_currency, display_name } = await request.json();

  const updates: Record<string, string> = {};
  if (default_currency) updates.default_currency = default_currency;
  if (display_name !== undefined) updates.display_name = display_name;

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
