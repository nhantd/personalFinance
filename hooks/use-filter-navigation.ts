"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useFilterNavigation(basePath: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => {
      router.push(`${basePath}?${params.toString()}`);
    });
  }

  return { updateParams, isPending };
}
