import { streamText } from "ai";
import { claudeModel } from "@/lib/ai/model";
import { createClient } from "@/lib/supabase/server";
import { buildChatContext, CHAT_SYSTEM_PROMPT } from "@/lib/ai/chat-context";
import type { Transaction } from "@/lib/types/database";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, sessionId } = await request.json();

  let activeSessionId = sessionId as string | undefined;

  if (!activeSessionId) {
    const { data: session } = await supabase
      .from("chat_sessions")
      .insert({ user_id: user.id, title: "New chat" })
      .select("id")
      .single();
    activeSessionId = session?.id;
  }

  const lastUserMessage = messages[messages.length - 1]?.content as string;

  if (activeSessionId && lastUserMessage) {
    await supabase.from("chat_messages").insert({
      session_id: activeSessionId,
      role: "user",
      content: lastUserMessage,
    });

    if (messages.length === 1) {
      const title = lastUserMessage.slice(0, 50) + (lastUserMessage.length > 50 ? "..." : "");
      await supabase
        .from("chat_sessions")
        .update({ title })
        .eq("id", activeSessionId);
    }
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(500);

  const context = buildChatContext((transactions ?? []) as Transaction[]);

  const result = streamText({
    model: claudeModel,
    system: `${CHAT_SYSTEM_PROMPT}\n\n${context}`,
    messages,
    onFinish: async ({ text }) => {
      if (activeSessionId && text) {
        await supabase.from("chat_messages").insert({
          session_id: activeSessionId,
          role: "assistant",
          content: text,
        });
      }
    },
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "X-Session-Id": activeSessionId ?? "",
    },
  });
}
