"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function parseDateValue(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function toDateValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export interface DatePickerProps {
  id?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  "aria-label"?: string;
}

export function DatePicker({
  id,
  value: valueProp,
  defaultValue,
  onChange,
  onBlur,
  required,
  disabled,
  className,
  placeholder = "Pick a date",
  "aria-label": ariaLabel,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;
  const selected = parseDateValue(value);

  useEffect(() => {
    if (defaultValue !== undefined && !isControlled) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  function updateValue(next: string) {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  }

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    const next = toDateValue(date);
    updateValue(next);
    setOpen(false);
    onBlur?.();
  }

  const display = selected ? format(selected, "d MMM yyyy") : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-required={required}
        className={cn(
          "inline-flex h-8 w-full items-center justify-start gap-2 rounded-lg border border-border bg-background px-2.5 text-sm font-normal transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-open:bg-muted data-open:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
          !value && "text-muted-foreground",
          className
        )}
      >
        <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{display}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto">
        <Calendar mode="single" selected={selected} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
