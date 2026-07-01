"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, MoreHorizontal } from "lucide-react";
import {
  MOBILE_MORE_ITEMS,
  MOBILE_TABS,
  getNavItemClassName,
  isNavActive,
} from "@/components/app/nav-config";
import { useSignOut } from "@/components/app/use-sign-out";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function AppMobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const signOut = useSignOut();
  const [moreOpen, setMoreOpen] = useState(false);

  const moreActive = MOBILE_MORE_ITEMS.some((item) => isNavActive(pathname, item.href));

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg md:hidden",
          className
        )}
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
          {MOBILE_TABS.map((item) => {
            const active = isNavActive(pathname, item.href);
            const Icon = item.icon;
            const label = item.mobileShortLabel ?? item.label;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition-colors",
                  getNavItemClassName(active)
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition-colors",
              getNavItemClassName(moreActive)
            )}
          >
            <MoreHorizontal className="h-5 w-5 shrink-0" />
            <span>More</span>
          </button>
        </div>
      </nav>

      <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>More</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 pb-2">
            {MOBILE_MORE_ITEMS.map((item) => {
              const active = isNavActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    getNavItemClassName(active)
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
            <Button
              variant="ghost"
              onClick={() => {
                setMoreOpen(false);
                void signOut();
              }}
              className="w-full justify-start gap-2.5 px-3 text-muted-foreground"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
