"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { brandClasses } from "@/lib/brand";

const SUGGESTED_QUESTIONS = [
  "How much did I spend on subscriptions last month?",
  "What's my biggest expense category?",
  "Am I spending more than I earn?",
];

export function ChatPanel() {
  const [sessionId, setSessionId] = useState<string | undefined>();
  const sessionRef = useRef<string | undefined>(undefined);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      fetch: async (input, init) => {
        const res = await fetch(input, init);
        const sid = res.headers.get("X-Session-Id");
        if (sid) {
          sessionRef.current = sid;
          setSessionId(sid);
        }
        return res;
      },
      body: () => ({
        sessionId: sessionRef.current ?? sessionId,
      }),
    }),
  });

  const [input, setInput] = useState("");
  const isLoading = status === "streaming" || status === "submitted";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }

  function askSuggested(question: string) {
    sendMessage({ text: question });
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Ask Monae</h1>
        <p className="text-muted-foreground">
          Questions answered from your real transactions — not generic advice.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-border/60 bg-card/30 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Sparkles className="h-10 w-10 text-primary" />
            <p className="mt-4 font-medium">Ask anything about your money</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Every answer is computed from your uploaded statements.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => askSuggested(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <Card
                className={cn(
                  "max-w-[85%] border-border/60",
                  message.role === "user"
                    ? "bg-primary/10 border-primary/20"
                    : "bg-card"
                )}
              >
                <CardContent className="p-3 text-sm whitespace-pre-wrap">
                  {message.parts
                    ?.filter((p) => p.type === "text")
                    .map((p) => (p.type === "text" ? p.text : ""))
                    .join("") ?? ""}
                </CardContent>
              </Card>
            </div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <p className="text-sm text-muted-foreground animate-pulse">Thinking...</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="How's my savings rate tracking?"
          className="min-h-[52px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className={`h-[52px] w-[52px] shrink-0 ${brandClasses.btnPrimary}`}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
