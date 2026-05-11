import type { InputHTMLAttributes, ReactNode } from "react";
import { Camera } from "lucide-react";
import { cn } from "../../lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";

export interface AvatarUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  actionLabel: string;
  imageUrl?: string;
  fallback: string;
  helperText?: ReactNode;
  className?: string;
}

export function AvatarUpload({ label, actionLabel, imageUrl, fallback, helperText, className, ...props }: AvatarUploadProps) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-card border border-border bg-surface p-4 sm:flex-row sm:items-center", className)}>
      <Avatar className="h-16 w-16">
        {imageUrl ? <AvatarImage src={imageUrl} alt={label} /> : null}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-text-primary">{label}</div>
        {helperText ? <div className="mt-1 text-xs text-text-muted">{helperText}</div> : null}
      </div>
      <label>
        <input type="file" accept="image/*" className="sr-only" {...props} />
        <span className="focus-ring inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-button border border-border bg-surface px-4 text-sm font-medium text-text-primary shadow-card transition-colors hover:bg-page">
          <Camera className="h-4 w-4" />
          {actionLabel}
        </span>
      </label>
    </div>
  );
}
