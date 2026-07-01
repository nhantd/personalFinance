const SUPABASE_ENV_HINT =
  "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel (Production and Preview), then redeploy.";

function assertSupabaseProjectUrl(url: string) {
  if (!url.includes(".supabase.co")) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL must be your Supabase project URL (https://<ref>.supabase.co), not your app URL. Got: ${url}. ${SUPABASE_ENV_HINT}`
    );
  }
}

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error(`@supabase/ssr: Your project's URL and API key are required to create a Supabase client! ${SUPABASE_ENV_HINT}`);
  }

  assertSupabaseProjectUrl(url);

  return { url, anonKey };
}

export function getSupabaseServiceRoleKey() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceRoleKey) {
    throw new Error(`Missing SUPABASE_SERVICE_ROLE_KEY. ${SUPABASE_ENV_HINT}`);
  }

  return serviceRoleKey;
}
