import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "../../lib/cn";

export interface SearchableSelectOption {
  label: string;
  value: string;
  description?: ReactNode;
  avatar?: ReactNode;
}

export interface SearchableSelectProps {
  label?: string;
  value?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  helperText?: string;
  options: SearchableSelectOption[];
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchableSelect({
  label,
  value,
  placeholder,
  searchPlaceholder,
  helperText,
  options,
  onChange,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return options;
    return options.filter((option) => option.label.toLocaleLowerCase().includes(normalizedQuery));
  }, [options, query]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative space-y-1.5", className)}>
      {label ? <div className="text-sm font-medium text-text-secondary">{label}</div> : null}
      <button
        type="button"
        className="focus-ring flex min-h-10 w-full items-center gap-3 rounded-input border border-border bg-surface px-3 py-2 text-left text-sm text-text-primary shadow-card"
        onClick={() => setOpen((current) => !current)}
      >
        {selected?.avatar}
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-text-muted")}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-text-muted transition-transform", open && "rotate-180")} />
      </button>
      {helperText ? <div className="text-xs text-text-muted">{helperText}</div> : null}
      {open ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-card border border-border bg-surface p-2 shadow-dropdown">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              autoFocus
              className="focus-ring h-9 w-full rounded-input border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted"
              placeholder={searchPlaceholder ?? placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="max-h-64 overflow-auto">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn("flex w-full items-center gap-3 rounded-input px-3 py-2 text-left text-sm hover:bg-page", option.value === selected?.value && "bg-primary-soft text-primary")}
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                  setQuery("");
                }}
              >
                {option.avatar}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{option.label}</span>
                  {option.description ? <span className="block truncate text-xs text-text-muted">{option.description}</span> : null}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
