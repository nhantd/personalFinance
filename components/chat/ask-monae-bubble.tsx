"use client";

import { Minus, Sparkles, X } from "lucide-react";
import { AskMonaeChat } from "@/components/chat/ask-monae-chat";
import { useAskMonae } from "@/components/chat/ask-monae-provider";
import { Button } from "@/components/ui/button";
import { COLORS } from "@/lib/colors";
import { cn } from "@/lib/utils";

export function AskMonaeBubble() {
  const { view, open, minimize, lastAssistantPreview } = useAskMonae();

  return (
    <>
      {view === "open" && (
        <div
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden rounded-xl border border-border/60 bg-background shadow-xl",
            "animate-in fade-in-0 slide-in-from-bottom-4 duration-200",
            "inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] h-[min(520px,calc(100vh-8rem))]",
            "sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[min(520px,calc(100vh-6rem))] sm:w-[380px]"
          )}
        >
          <header className="flex shrink-0 items-start gap-3 border-b border-border/60 px-4 py-3">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: COLORS.darkGreen }}
            >
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-tight text-foreground">Ask Monae</p>
              <p className="text-xs text-muted-foreground">Ask me about your finances</p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={minimize}
                aria-label="Minimize"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={minimize}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <AskMonaeChat />
        </div>
      )}

      {view === "minimized" && (
        <button
          type="button"
          onClick={open}
          className={cn(
            "fixed z-50 flex items-center gap-2.5 rounded-full px-4 py-2.5 text-left text-sm text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]",
            "inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] mx-auto max-w-md",
            "md:inset-x-auto md:right-6 md:bottom-6 md:mx-0 md:max-w-sm"
          )}
          style={{ backgroundColor: COLORS.darkGreen }}
        >
          <Sparkles className="h-4 w-4 shrink-0 text-accent" />
          <span className="shrink-0 font-medium">Ask Monae</span>
          {lastAssistantPreview && (
            <span className="truncate text-white/70">· {lastAssistantPreview}</span>
          )}
        </button>
      )}
    </>
  );
}
