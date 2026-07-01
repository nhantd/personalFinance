"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { useAskMonae } from "@/components/chat/ask-monae-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { brandClasses } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const SUGGESTED_QUESTIONS = [
  "How much did I spend on subscriptions last month?",
  "What's my biggest expense category?",
  "Am I spending more than I earn?",
];

function getMessageText(message: { parts?: { type: string; text?: string }[] }): string {
  return (
    message.parts
      ?.filter((p) => p.type === "text")
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("") ?? ""
  );
}

export function AskMonaeChat() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    submitMessage,
    askSuggested,
    view,
  } = useAskMonae();

  const [insights, setInsights] = useState<string[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const insightsFetched = useRef(false);

  useEffect(() => {
    if (view !== "open" || insightsFetched.current) return;

    insightsFetched.current = true;
    setInsightsLoading(true);

    fetch("/api/chat/insights")
      .then((res) => (res.ok ? res.json() : { insights: [] }))
      .then((data: { insights?: string[] }) => {
        setInsights(data.insights ?? []);
      })
      .catch(() => {
        setInsights(["Upload transactions to unlock personalized insights."]);
      })
      .finally(() => setInsightsLoading(false));
  }, [view]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitMessage();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div>
              <p className="text-base font-semibold text-foreground">Hi there!</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Ask me anything about your finances.
              </p>
            </div>

            <div className="space-y-2">
              {insightsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))
                : insights.map((insight) => (
                    <div
                      key={insight}
                      className={cn(
                        "flex gap-2.5 rounded-lg px-3 py-2.5 text-sm leading-snug",
                        brandClasses.insightBg
                      )}
                    >
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <p className="text-foreground/90">{insight}</p>
                    </div>
                  ))}
            </div>

            <div className="space-y-2 pt-1">
              <p className="text-xs font-medium text-muted-foreground">Try asking</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => askSuggested(q)}
                    disabled={isLoading}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                    message.role === "user"
                      ? "bg-primary/10 text-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {getMessageText(message)}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <p className="text-sm text-muted-foreground animate-pulse">Thinking…</p>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center gap-2 border-t border-border/60 px-4 py-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your data…"
          className="h-10 flex-1"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className={cn("h-10 w-10 shrink-0", brandClasses.btnPrimary)}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
