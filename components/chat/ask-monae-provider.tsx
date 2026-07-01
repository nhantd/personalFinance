"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AskMonaeView = "minimized" | "open";

interface AskMonaeContextValue {
  view: AskMonaeView;
  open: () => void;
  minimize: () => void;
  toggle: () => void;
  messages: ReturnType<typeof useChat>["messages"];
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  status: ReturnType<typeof useChat>["status"];
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  submitMessage: () => void;
  askSuggested: (question: string) => void;
  lastAssistantPreview: string | null;
}

const AskMonaeContext = createContext<AskMonaeContextValue | null>(null);

function getMessageText(message: AskMonaeContextValue["messages"][number]): string {
  return (
    message.parts
      ?.filter((p) => p.type === "text")
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("") ?? ""
  );
}

export function AskMonaeProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AskMonaeView>("minimized");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const sessionRef = useRef<string | undefined>(undefined);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      fetch: async (inputUrl, init) => {
        const res = await fetch(inputUrl, init);
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

  const isLoading = status === "streaming" || status === "submitted";

  const open = useCallback(() => setView("open"), []);
  const minimize = useCallback(() => setView("minimized"), []);
  const toggle = useCallback(
    () => setView((v) => (v === "open" ? "minimized" : "open")),
    []
  );

  const submitMessage = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }, [input, isLoading, sendMessage]);

  const askSuggested = useCallback(
    (question: string) => {
      if (isLoading) return;
      sendMessage({ text: question });
    },
    [isLoading, sendMessage]
  );

  const lastAssistantPreview = useMemo(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant) return null;
    const text = getMessageText(lastAssistant).replace(/\s+/g, " ").trim();
    if (!text) return null;
    return text.length > 72 ? `${text.slice(0, 72)}…` : text;
  }, [messages]);

  const value = useMemo(
    () => ({
      view,
      open,
      minimize,
      toggle,
      messages,
      sendMessage,
      status,
      input,
      setInput,
      isLoading,
      submitMessage,
      askSuggested,
      lastAssistantPreview,
    }),
    [
      view,
      open,
      minimize,
      toggle,
      messages,
      sendMessage,
      status,
      input,
      isLoading,
      submitMessage,
      askSuggested,
      lastAssistantPreview,
    ]
  );

  return (
    <AskMonaeContext.Provider value={value}>{children}</AskMonaeContext.Provider>
  );
}

export function useAskMonae() {
  const ctx = useContext(AskMonaeContext);
  if (!ctx) {
    throw new Error("useAskMonae must be used within AskMonaeProvider");
  }
  return ctx;
}
