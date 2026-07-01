"use client";

import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export function AppMobileHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/95 px-4 backdrop-blur-lg md:hidden",
        className
      )}
    >
      <Logo href="/dashboard" />
    </header>
  );
}
