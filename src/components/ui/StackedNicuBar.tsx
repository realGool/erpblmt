import { cn } from "../../lib/cn";

export interface NicuValue {
  n: number;
  i: number;
  ch: number;
  u: number;
}

export interface NicuLabels {
  n: string;
  i: string;
  ch: string;
  u: string;
}

export interface StackedNicuBarProps {
  value: NicuValue;
  labels: NicuLabels;
  compact?: boolean;
  className?: string;
}

const segments = [
  { key: "n", className: "bg-danger-bg text-danger-text" },
  { key: "i", className: "bg-warning-bg text-warning-text" },
  { key: "ch", className: "bg-success-bg text-success-text" },
  { key: "u", className: "bg-info-bg text-info-text" },
] as const;

export function StackedNicuBar({ value, labels, compact = false, className }: StackedNicuBarProps) {
  return (
    <div className={cn("min-w-[132px] space-y-1.5", className)}>
      <div className="flex h-2 overflow-hidden rounded-full bg-page">
        {segments.map((segment) => (
          <div
            key={segment.key}
            className={cn(segment.className.split(" ")[0])}
            style={{ width: `${Math.max(value[segment.key], 4)}%` }}
          />
        ))}
      </div>
      <div className={cn("grid grid-cols-4 gap-1", compact && "gap-0.5")}>
        {segments.map((segment) => (
          <span
            key={segment.key}
            className={cn(
              "inline-flex items-center justify-center rounded-[6px] px-1.5 py-1 text-[11px] font-semibold leading-none",
              segment.className,
            )}
          >
            {labels[segment.key]} {value[segment.key]}%
          </span>
        ))}
      </div>
    </div>
  );
}
