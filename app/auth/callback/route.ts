import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeReturnPath, getAppOriginFromRequest } from "@/lib/auth-redirect";
import { ensureUserProfile } from "@/lib/finance/profile";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = getAppOriginFromRequest(request);
  const code = searchParams.get("code");
  const next = sanitizeReturnPath(
    searchParams.get("next") ?? searchParams.get("redirect")
  );

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await ensureUserProfile(supabase, user.id, { user });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
