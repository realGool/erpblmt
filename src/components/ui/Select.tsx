import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <label className="block space-y-1.5" htmlFor={selectId}>
        {label ? <span className="text-sm font-medium text-text-secondary">{label}</span> : null}
        <span className="relative block">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "focus-ring h-10 w-full appearance-none rounded-input border bg-surface px-3 pr-10 text-sm text-text-primary shadow-card transition-colors",
              "disabled:bg-page disabled:text-text-muted",
              error ? "border-danger-text" : "border-border",
              className,
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        </span>
        {error ? (
          <span className="text-xs text-danger-text">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-text-muted">{helperText}</span>
        ) : null}
      </label>
    );
  },
);

Select.displayName = "Select";
