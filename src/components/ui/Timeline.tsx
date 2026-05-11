import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface TimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  icon?: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger" | "purple";
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const toneClasses: Record<NonNullable<TimelineItem["tone"]>, string> = {
  neutral: "bg-page text-text-secondary",
  primary: "bg-primary-soft text-primary",
  success: "bg-success-bg text-success-text",
  warning: "bg-warning-bg text-warning-text",
  danger: "bg-danger-bg text-danger-text",
  purple: "bg-purple-bg text-purple-text",
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, index) => (
        <div key={item.id} className="grid grid-cols-[32px_1fr] gap-3">
          <div className="flex flex-col items-center">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", toneClasses[item.tone ?? "primary"])}>
              {item.icon}
            </div>
            {index < items.length - 1 ? <div className="min-h-8 w-px flex-1 bg-border" /> : null}
          </div>
          <div className="pb-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium text-text-primary">{item.title}</div>
              {item.meta ? <div className="text-xs text-text-muted">{item.meta}</div> : null}
            </div>
            {item.description ? <div className="mt-1 text-sm text-text-secondary">{item.description}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
