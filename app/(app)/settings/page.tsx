import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/settings/settings-form";
import type { Profile } from "@/lib/types/database";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-muted-foreground">Manage your profile and data.</p>
      <div className="mt-8">
        <SettingsForm profile={(profile ?? { id: user!.id, display_name: null, default_currency: "USD", created_at: "" }) as Profile} />
      </div>
    </div>
  );
}
