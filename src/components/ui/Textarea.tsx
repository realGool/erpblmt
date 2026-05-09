import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const textareaId = id ?? props.name;

    return (
      <label className="block space-y-1.5" htmlFor={textareaId}>
        {label ? <span className="text-sm font-medium text-text-secondary">{label}</span> : null}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "focus-ring min-h-24 w-full resize-y rounded-input border bg-surface px-3 py-2 text-sm text-text-primary shadow-card transition-colors",
            "placeholder:text-text-muted disabled:bg-page disabled:text-text-muted",
            error ? "border-danger-text" : "border-border",
            className,
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs text-danger-text">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-text-muted">{helperText}</span>
        ) : null}
      </label>
    );
  },
);

Textarea.displayName = "Textarea";
