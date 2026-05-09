import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { Card, CardContent } from "./Card";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function StatsCard({ title, value, icon, onClick, className }: StatsCardProps) {
  return (
    <Card
      className={cn(
        "transition-colors",
        onClick && "cursor-pointer hover:border-primary hover:bg-primary-soft/40",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") onClick();
      }}
    >
      <CardContent className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="text-sm text-text-secondary">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-text-primary">{value}</div>
        </div>
        {onClick ? <ChevronRight className="h-5 w-5 shrink-0 text-text-muted" /> : null}
      </CardContent>
    </Card>
  );
}
