import { cn } from "../../lib/cn";

type DevelopmentMetricTone = "success" | "warning" | "danger" | "info" | "purple";

export interface DevelopmentCompactMetric {
  area: string;
  value: number;
  label: string;
  tone: DevelopmentMetricTone;
}

export interface DevelopmentCompactMetricsProps {
  metrics: DevelopmentCompactMetric[];
  className?: string;
}

const toneColors: Record<DevelopmentMetricTone, string> = {
  success: "var(--color-success-text)",
  warning: "var(--color-warning-text)",
  danger: "var(--color-danger-text)",
  info: "var(--color-info-text)",
  purple: "var(--color-purple-text)",
};

export function DevelopmentCompactMetrics({ metrics, className }: DevelopmentCompactMetricsProps) {
  return (
    <div className={cn("flex min-w-max flex-nowrap gap-2", className)}>
      {metrics.map((metric) => (
        <div key={metric.area} className="flex w-14 flex-col items-center gap-1">
          <div
            className="grid h-10 w-10 place-items-center rounded-full text-[11px] font-semibold text-text-primary"
            style={{
              background: `conic-gradient(${toneColors[metric.tone]} ${metric.value * 3.6}deg, var(--color-page) 0deg)`,
            }}
          >
            <div className="grid h-[74%] w-[74%] place-items-center rounded-full bg-surface">{metric.value}%</div>
          </div>
          <div className="w-full truncate text-center text-[10px] font-medium text-text-muted">{metric.label}</div>
        </div>
      ))}
    </div>
  );
}
