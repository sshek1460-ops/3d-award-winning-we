"use client";

import { cn } from "@/lib/utils";

interface SectionLabelProps {
  label: string;
  className?: string;
}

export default function SectionLabel({ label, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "text-section-label inline-block",
        "relative pb-3",
        "after:content-[''] after:absolute after:bottom-0 after:left-0",
        "after:w-8 after:h-[1px] after:bg-[var(--champagne)]",
        className
      )}
      aria-label={label}
    >
      {label}
    </span>
  );
}
