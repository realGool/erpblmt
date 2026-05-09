import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface FilterBarProps {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function FilterBar({ left, right, className }: FilterBarProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex flex-wrap items-center gap-3">{left}</div>
      <div className="flex flex-wrap items-center justify-end gap-3">{right}</div>
    </div>
  );
}
