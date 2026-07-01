import type { SupabaseClient } from "@supabase/supabase-js";
import type { Currency, Profile } from "@/lib/types/database";

export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("getUserProfile error:", error.message);
    return null;
  }

  return data as Profile | null;
}

export function getBaseCurrency(profile: Profile | null): Currency {
  return (profile?.default_currency ?? "USD") as Currency;
}

export async function ensureUserProfile(
  supabase: SupabaseClient,
  userId: string,
  defaults?: { display_name?: string | null; default_currency?: Currency }
): Promise<Profile> {
  const existing = await getUserProfile(supabase, userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      display_name: defaults?.display_name ?? null,
      default_currency: defaults?.default_currency ?? "USD",
    })
    .select("*")
    .single();

  if (error) {
    // Race: another request may have created the profile
    const retry = await getUserProfile(supabase, userId);
    if (retry) return retry;
    throw new Error(error.message);
  }

  return data as Profile;
}
