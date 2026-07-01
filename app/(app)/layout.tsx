import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppMobileHeader } from "@/components/app/app-mobile-header";
import { AppMobileNav } from "@/components/app/app-mobile-nav";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AskMonaeBubble } from "@/components/chat/ask-monae-bubble";
import { AskMonaeProvider } from "@/components/chat/ask-monae-provider";
import { ensureUserProfile } from "@/lib/finance/profile";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await ensureUserProfile(supabase, user.id, {
    display_name: user.email?.split("@")[0] ?? null,
  });

  return (
    <AskMonaeProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppMobileHeader />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-20 sm:px-6 md:pb-8">
            {children}
          </main>
          <AppMobileNav />
        </div>
      </div>
      <AskMonaeBubble />
    </AskMonaeProvider>
  );
}
