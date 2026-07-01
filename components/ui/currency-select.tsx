"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CurrencyBadge } from "@/components/ui/currency-badge";
import { getCurrencyGroups, getCurrencyMeta } from "@/lib/currencies";
import { cn } from "@/lib/utils";

interface CurrencySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

export function CurrencySelect({
  value,
  onValueChange,
  className,
  id,
  disabled,
  placeholder = "Select currency",
}: CurrencySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<DropdownPosition | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = getCurrencyMeta(value);
  const groups = useMemo(() => getCurrencyGroups(query), [query]);

  useEffect(() => {
    setMounted(true);
  }, []);

  function updatePosition() {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom - gap - 16;
    const spaceAbove = rect.top - gap - 16;
    const preferBelow = spaceBelow >= 200 || spaceBelow >= spaceAbove;
    const maxHeight = Math.min(320, Math.max(160, preferBelow ? spaceBelow : spaceAbove));

    setPosition({
      top: preferBelow ? rect.bottom + gap : rect.top - gap - maxHeight,
      left: rect.left,
      width: rect.width,
      maxHeight,
    });
  }

  useEffect(() => {
    if (!open) return;

    updatePosition();

    function handleScrollOrResize() {
      updatePosition();
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
      setQuery("");
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function select(code: string) {
    onValueChange(code);
    setOpen(false);
    setQuery("");
  }

  const dropdown =
    open && position ? (
      <div
        ref={dropdownRef}
        role="listbox"
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          width: position.width,
          zIndex: 9999,
        }}
        className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xl ring-1 ring-foreground/10"
      >
        <div className="border-b border-border/60 bg-card p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by code or name…"
              className="h-9 border border-border/60 bg-background pl-8 text-sm text-foreground shadow-none focus-visible:ring-1"
              autoFocus
            />
          </div>
        </div>

        <div
          className="overflow-y-auto overscroll-contain p-1.5"
          style={{ maxHeight: position.maxHeight - 52 }}
        >
          {groups.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No currencies match &ldquo;{query}&rdquo;
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="mb-1 last:mb-0">
                <p className="sticky top-0 z-10 bg-card px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.currencies.map((currency) => {
                    const isSelected = currency.code === value.toUpperCase();
                    return (
                      <li key={currency.code}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => select(currency.code)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm text-foreground transition-colors",
                            isSelected ? "bg-primary/15" : "hover:bg-muted"
                          )}
                        >
                          <CurrencyBadge code={currency.code} />
                          <span className="min-w-0 flex-1 truncate">{currency.name}</span>
                          <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                            {currency.symbol}
                          </span>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          if (disabled) return;
          if (!open) updatePosition();
          setOpen((o) => !o);
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 text-sm transition-colors",
          "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          disabled && "cursor-not-allowed opacity-50",
          open && "border-primary/40 ring-2 ring-ring/30",
          className
        )}
      >
        {selected ? (
          <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
            <CurrencyBadge code={selected.code} />
            <span className="truncate text-foreground">{selected.name}</span>
            <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">
              {selected.symbol}
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {mounted && dropdown ? createPortal(dropdown, document.body) : null}
    </>
  );
}
