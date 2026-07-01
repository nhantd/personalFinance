"use client";

import { LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { NavLink } from "@/components/app/nav-link";
import { NAV_GROUPS, SETTINGS_ITEM } from "@/components/app/nav-config";
import { useSignOut } from "@/components/app/use-sign-out";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppSidebar({ className }: { className?: string }) {
  const signOut = useSignOut();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex",
        className
      )}
    >
      <div className="border-b border-sidebar-border px-4 py-4">
        <Logo href="/dashboard" />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-sidebar-border px-3 py-4">
        <NavLink item={SETTINGS_ITEM} />
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start gap-2.5 px-3 text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
