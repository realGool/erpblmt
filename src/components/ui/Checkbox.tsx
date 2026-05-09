import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  description?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const checkboxId = id ?? props.name;

    return (
      <label className="flex cursor-pointer items-start gap-3" htmlFor={checkboxId}>
        <span className="relative mt-0.5 flex h-5 w-5 shrink-0">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={cn("peer sr-only", className)}
            {...props}
          />
          <span className="focus-ring flex h-5 w-5 items-center justify-center rounded-[6px] border border-border bg-surface text-transparent transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-text-inverse peer-disabled:opacity-50">
            <Check className="h-3.5 w-3.5" />
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

Checkbox.displayName = "Checkbox";
