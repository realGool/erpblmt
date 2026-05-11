import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type IconBadgeTone = "primary" | "info" | "success" | "warning" | "danger" | "purple" | "neutral";
type IconBadgeSize = "sm" | "md" | "lg";

export interface IconBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  icon: ReactNode;
  tone?: IconBadgeTone;
  size?: IconBadgeSize;
}

const toneClasses: Record<IconBadgeTone, string> = {
  primary: "border border-primary/10 bg-primary-soft text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
  info: "border border-info-bg/80 bg-info-bg text-info-text shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
  success: "border border-success-bg/80 bg-success-bg text-success-text shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
  warning: "border border-warning-bg/80 bg-warning-bg text-warning-text shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
  danger: "border border-danger-bg/80 bg-danger-bg text-danger-text shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
  purple: "border border-purple-bg/80 bg-purple-bg text-purple-text shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
  neutral: "border border-border bg-page text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
};

const sizeClasses: Record<IconBadgeSize, string> = {
  sm: "h-8 w-8 rounded-[10px] [&>svg]:h-4 [&>svg]:w-4",
  md: "h-10 w-10 rounded-[12px] [&>svg]:h-5 [&>svg]:w-5",
  lg: "h-12 w-12 rounded-[14px] [&>svg]:h-6 [&>svg]:w-6",
};

export function IconBadge({ icon, tone = "primary", size = "md", className, ...props }: IconBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center shadow-[0_6px_18px_rgba(15,23,42,0.06)]",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {icon}
    </span>
  );
}
