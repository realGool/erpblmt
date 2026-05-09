import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info" | "purple";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const badgeVariants: Record<BadgeVariant, string> = {
  neutral: "bg-page text-text-secondary border-border",
  success: "bg-success-bg text-success-text border-success-bg",
  warning: "bg-warning-bg text-warning-text border-warning-bg",
  danger: "bg-danger-bg text-danger-text border-danger-bg",
  info: "bg-info-bg text-info-text border-info-bg",
  purple: "bg-purple-bg text-purple-text border-purple-bg",
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-[7px] border px-2.5 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

export interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status?: BadgeVariant;
}

export function StatusBadge({ status = "neutral", ...props }: StatusBadgeProps) {
  return <Badge variant={status} {...props} />;
}
