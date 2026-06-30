import { MessageSquare } from "lucide-react";
import { brandClasses } from "@/lib/brand";

export function MockChatSnippet() {
  return (
    <div className={`${brandClasses.card} space-y-3 p-4`}>
      <div className="rounded-lg bg-muted px-3 py-2.5 text-sm text-foreground">
        How much did I spend on subscriptions last month?
      </div>
      <div className="flex gap-2">
        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">$127.42</span> across 4 recurring
          charges — Netflix, Spotify, iCloud, and Planet Fitness.
        </p>
      </div>
    </div>
  );
}
