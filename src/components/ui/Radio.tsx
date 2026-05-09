import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  description?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const radioId = id ?? props.name;

    return (
      <label className="flex cursor-pointer items-start gap-3" htmlFor={radioId}>
        <span className="relative mt-0.5 flex h-5 w-5 shrink-0">
          <input ref={ref} id={radioId} type="radio" className={cn("peer sr-only", className)} {...props} />
          <span className="focus-ring flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface transition-colors peer-checked:border-primary peer-checked:[&>span]:bg-primary peer-disabled:opacity-50">
            <span className="h-2.5 w-2.5 rounded-full bg-transparent transition-colors peer-checked:bg-primary" />
          </span>
        </span>
        {(label || description) && (
          <span className="space-y-0.5">
            {label ? <span className="block text-sm font-medium text-text-primary">{label}</span> : null}
            {description ? <span className="block text-xs text-text-muted">{description}</span> : null}
          </span>
        )}
      </label>
    );
  },
);

Radio.displayName = "Radio";
