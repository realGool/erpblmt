import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface MetricCardProps {
  icon?: ReactNode;
  value: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger" | "purple";
  className?: string;
}

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  neutral: "bg-page text-text-secondary",
  primary: "bg-primary-soft text-primary",
  success: "bg-success-bg text-success-text",
  warning: "bg-warning-bg text-warning-text",
  danger: "bg-danger-bg text-danger-text",
  purple: "bg-purple-bg text-purple-text",
};

export function MetricCard({ icon, value, label, description, tone = "primary", className }: MetricCardProps) {
  return (
    <div className={cn("rounded-card border border-border bg-surface p-5 shadow-card", className)}>
      <div className="flex items-center gap-4">
        {icon ? <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px]", toneClasses[tone])}>{icon}</div> : null}
        <div className="min-w-0">
          <div className="text-2xl font-semibold leading-tight text-text-primary">{value}</div>
          <div className="mt-1 text-sm text-text-secondary">{label}</div>
        </div>
      </div>
      {description ? <div className="mt-3 text-sm text-text-muted">{description}</div> : null}
    </div>
  );
}
