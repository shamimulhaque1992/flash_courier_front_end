"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const PERIODS = ["AM", "PM"];

interface TimePickerProps {
  value: string; // "HH:MM" 24h format
  onChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  isInvalid?: boolean;
}

function to24h(hour: string, minute: string, period: string): string {
  let h = parseInt(hour, 10);
  if (period === "AM" && h === 12) h = 0;
  if (period === "PM" && h !== 12) h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

function from24h(value: string): { hour: string; minute: string; period: string } {
  if (!value) return { hour: "12", minute: "00", period: "AM" };
  const [h, m] = value.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return { hour: String(hour12).padStart(2, "0"), minute: String(m).padStart(2, "0"), period };
}

function ScrollColumn({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = items.indexOf(selected);
    if (idx !== -1) {
      el.scrollTop = idx * 36;
    }
  }, [selected, items]);

  return (
    <div
      ref={ref}
      className="flex h-[180px] flex-col overflow-y-auto scroll-smooth scrollbar-none"
      style={{ scrollbarWidth: "none" }}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className={cn(
            "flex h-9 w-12 shrink-0 items-center justify-center rounded-md text-sm font-medium transition-colors",
            selected === item
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-accent hover:text-accent-foreground",
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default function TimePicker({
  value,
  onChange,
  onBlur,
  id,
  isInvalid,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const { hour, minute, period } = from24h(value);

  const handleHour = (h: string) => onChange(to24h(h, minute, period));
  const handleMinute = (m: string) => onChange(to24h(hour, m, period));
  const handlePeriod = (p: string) => onChange(to24h(hour, minute, p));

  const displayValue = value
    ? `${hour}:${minute} ${period}`
    : "Select time";

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o && onBlur) onBlur();
      }}
    >
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-invalid={isInvalid}
            className={cn(
              "w-full justify-start gap-2 font-normal",
              !value && "text-muted-foreground",
            )}
          />
        }
      >
        <Clock className="size-4 text-muted-foreground" />
        {displayValue}
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-3"
        align="start"
        side="bottom"
      >
        <div className="flex gap-1">
          <ScrollColumn items={HOURS} selected={hour} onSelect={handleHour} />
          <div className="flex items-center justify-center px-0.5 text-muted-foreground">:</div>
          <ScrollColumn items={MINUTES} selected={minute} onSelect={handleMinute} />
          <div className="ml-1 flex flex-col gap-1 pt-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePeriod(p)}
                className={cn(
                  "flex h-9 w-12 items-center justify-center rounded-md text-sm font-medium transition-colors",
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
