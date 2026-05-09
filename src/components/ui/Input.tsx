import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="block space-y-1.5" htmlFor={inputId}>
        {label ? <span className="text-sm font-medium text-text-secondary">{label}</span> : null}
        <span className="relative block">
          {leftIcon ? (
            <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-text-muted">
              {leftIcon}
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "focus-ring h-10 w-full rounded-input border bg-surface px-3 text-sm text-text-primary shadow-card transition-colors",
              "placeholder:text-text-muted disabled:bg-page disabled:text-text-muted",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error ? "border-danger-text" : "border-border",
              className,
            )}
            {...props}
          />
          {rightIcon ? (
            <span className="absolute right-3 top-1/2 flex -translate-y-1/2 text-text-muted">
              {rightIcon}
            </span>
          ) : null}
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

Input.displayName = "Input";
