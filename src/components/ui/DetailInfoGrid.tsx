import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface DetailInfoItem {
  label: string;
  value: ReactNode;
}

export interface DetailInfoGridProps {
  items: DetailInfoItem[];
  columns?: 1 | 2;
  className?: string;
}

export function DetailInfoGrid({ items, columns = 2, className }: DetailInfoGridProps) {
  return (
    <dl className={cn("grid gap-x-8 gap-y-5", columns === 2 ? "md:grid-cols-2" : "grid-cols-1", className)}>
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-[minmax(140px,0.85fr)_minmax(0,1fr)] gap-4">
          <dt className="text-sm text-text-secondary">{item.label}</dt>
          <dd className="min-w-0 text-sm font-medium text-text-primary">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
