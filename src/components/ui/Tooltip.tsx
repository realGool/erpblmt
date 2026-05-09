import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 w-max max-w-64 -translate-x-1/2 rounded-input bg-text-primary px-2.5 py-1.5 text-xs font-medium text-text-inverse opacity-0 shadow-dropdown transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        {content}
      </span>
    </span>
  );
}
