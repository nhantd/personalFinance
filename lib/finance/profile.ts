import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Currency, Profile } from "@/lib/types/database";

type AuthUserLike = Pick<User, "email" | "user_metadata">;

/** Name from OAuth (Google sends full_name) or email local-part fallback. */
export function getDisplayNameFromUser(user: AuthUserLike): string | null {
  const meta = user.user_metadata ?? {};
  for (const key of ["full_name", "name", "display_name"] as const) {
    const value = meta[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  const local = user.email?.split("@")[0]?.trim();
  return local || null;
}

/** True when the stored name is empty or still the auto email prefix. */
export function isPlaceholderDisplayName(
  displayName: string | null | undefined,
  email: string | null | undefined
): boolean {
  if (!displayName?.trim()) return true;
  if (!email) return false;
  const local = email.split("@")[0];
  return displayName === email || displayName === local;
}

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
  options?: { user?: AuthUserLike; default_currency?: Currency }
): Promise<Profile> {
  const authName = options?.user ? getDisplayNameFromUser(options.user) : null;
  const existing = await getUserProfile(supabase, userId);

  if (existing) {
    if (
      options?.user &&
      authName &&
      !isPlaceholderDisplayName(authName, options.user.email ?? null) &&
      isPlaceholderDisplayName(existing.display_name, options.user.email ?? null)
    ) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ display_name: authName })
        .eq("id", userId)
        .select("*")
        .maybeSingle();

      if (!error && data) {
        return data as Profile;
      }
    }
    return existing;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      display_name: authName,
      default_currency: options?.default_currency ?? "USD",
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
