import { cn } from "../../lib/cn";

type CircularMetricTone = "success" | "warning" | "danger" | "info" | "purple";

export interface CircularMetricProps {
  value: number;
  label: string;
  tone?: CircularMetricTone;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const toneColors: Record<CircularMetricTone, string> = {
  success: "var(--color-success-text)",
  warning: "var(--color-warning-text)",
  danger: "var(--color-danger-text)",
  info: "var(--color-info-text)",
  purple: "var(--color-purple-text)",
};

const sizes = {
  sm: "h-11 w-11 text-[11px]",
  md: "h-16 w-16 text-sm",
  lg: "h-20 w-20 text-base",
};

export function CircularMetric({ value, label, tone = "success", size = "md", className }: CircularMetricProps) {
  const color = toneColors[tone];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn("grid shrink-0 place-items-center rounded-full font-semibold text-text-primary", sizes[size])}
        style={{
          background: `conic-gradient(${color} ${value * 3.6}deg, var(--color-page) 0deg)`,
        }}
      >
        <div className="grid h-[78%] w-[78%] place-items-center rounded-full bg-surface">{value}</div>
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-text-primary">{label}</div>
        <div className="text-xs text-text-muted">100</div>
      </div>
    </div>
  );
}
