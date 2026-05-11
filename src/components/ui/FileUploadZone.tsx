import type { InputHTMLAttributes, ReactNode } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "../../lib/cn";

export interface FileUploadZoneProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function FileUploadZone({ label, description, icon, className, ...props }: FileUploadZoneProps) {
  return (
    <label className={cn("focus-within:ring-primary/20 block cursor-pointer rounded-card border border-dashed border-border bg-surface p-6 text-center transition-colors hover:bg-page focus-within:ring-4", className)}>
      <input type="file" className="sr-only" {...props} />
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
        {icon ?? <UploadCloud className="h-6 w-6" />}
      </span>
      <span className="mt-3 block text-sm font-semibold text-text-primary">{label}</span>
      {description ? <span className="mt-1 block text-xs leading-5 text-text-muted">{description}</span> : null}
    </label>
  );
}
