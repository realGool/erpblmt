import type { HTMLAttributes, ImgHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type AvatarSize = "sm" | "md" | "lg";

const sizes: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
}

export function Avatar({ className, size = "md", ...props }: AvatarProps) {
  return <div className={cn("relative inline-flex shrink-0 overflow-hidden rounded-full bg-primary-soft text-primary", sizes[size], className)} {...props} />;
}

export function AvatarImage({ className, alt = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return <img alt={alt} className={cn("h-full w-full object-cover", className)} {...props} />;
}

export function AvatarFallback({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("flex h-full w-full items-center justify-center font-semibold", className)} {...props} />;
}
