import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/settings/settings-form";
import { ensureUserProfile } from "@/lib/finance/profile";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await ensureUserProfile(supabase, user!.id, {
    display_name: user!.email?.split("@")[0] ?? null,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-muted-foreground">Manage your profile and data.</p>
      <div className="mt-8">
        <SettingsForm profile={profile} />
      </div>
    </div>
  );
}
